## Context

El proyecto implementa un Minesweeper “dashboard” con React + Vite + TypeScript. En `openspec/specs/project.md` se define que el botón **Play/Pause** no solo debe detener el temporizador, sino que además debe ocultar (o cubrir) el tablero y deshabilitar cualquier interacción hasta reanudar.

En el diseño base (`openspec/changes/initial-minesweeper-structure/design.md`) ya existe la decisión de “Board Visibility on Pause”, pero falta que la regla quede totalmente especificada/aterrizada para implementación en la capa de requisitos y tareas de este cambio.

## Goals / Non-Goals

**Goals:**

- Garantizar que al pausar, el tablero no sea visible/usable (oculto o cubierto con overlay “Paused”).
- Garantizar que mientras esté pausado, ninguna acción sobre celdas modifique el estado del juego.
- Mantener consistente el temporizador: al pausar se congela; al reanudar continúa.
- Mantener FSM del juego en `idle | playing | won | lost` (la pausa es un estado de UI, no un estado de FSM).

**Non-Goals:**

- Introducir una nueva condición terminal adicional (la pausa no debe convertir el juego en `won`/`lost`).
- Implementar funcionalidades extra como chord reveal o accesibilidad avanzada (fuera del alcance).

## Decisions

1. **La pausa se modela como estado de UI (`isPaused`)**
   - El FSM del motor del juego se mantiene en `idle | playing | won | lost`.
   - `isPaused` vive en la capa del dashboard (reducer UI o estado local), ya que afecta principalmente a la presentación y al bloqueo de interacción.

2. **Estrategia de ocultación: overlay “Paused” y/o unmount del tablero**
   - Cuando `isPaused` es `true`, se renderiza un overlay “Paused” por encima del área del tablero.
   - Alternativamente (y preferible si simplifica bloqueo): el componente `Board` se des-monta mientras el juego está pausado.
   - En ambos casos, el tablero debe ser no-interactivo.

3. **Bloqueo de interacción**
   - Además del unmount/overlay, se aplicará un guard en los handlers de celdas/acciones: si `isPaused` es `true`, las acciones no deben despachar transiciones que cambien la grilla.

4. **Timer**
   - El incremento de segundos se ejecuta solo cuando el estado del juego es `playing` y `isPaused` es `false`.
   - Pausar durante `playing` detiene el contador, pero no altera `status` del juego.

## Risks / Trade-offs

- **[Risk] Unmount del tablero rompe focus/hover** → Mitigación: overlay visible y el primer render al reanudar restaura el tablero desde el estado actual del motor.
- **[Risk] “Paused overlay” vs “board unmounted”** → Mitigación: si hay glitches, preferir unmount para garantizar interacción cero.
- **[Risk] Pause presionado en estados `idle`/`won`/`lost`** → Mitigación: el UI puede limitar/deshabilitar el botón en esos estados; la especificación de este cambio prioriza consistencia de “playing ↔ paused”.

## Migration Plan

No aplica en este repositorio (proyecto greenfield / scaffolding). Se implementa ajustando la capa UI que ya controla el timer y la interacción con celdas.

## Open Questions

- Si el botón Play/Pause debe estar habilitado en `idle`: por simplicidad de UX, se recomienda habilitarlo solo cuando la UI está en “playing” (o definir que en `idle` solo se detiene el contador, sin efecto adicional).
