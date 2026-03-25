## Why

El comportamiento de pausa del tablero es parte del contrato del producto. `openspec/specs/project.md` indica que cuando el juego está en pausa, el tablero debe estar oculto (o cubierto) para evitar que el jugador planifique movimientos mientras el temporizador está detenido.

Esta actualización asegura que el botón `Play/Pause` no solo detenga el contador, sino que también oculte/deshabilite la interacción del tablero según lo definido en la visión (`project.md`) y las decisiones de diseño (ver `design.md` del cambio base).

## What Changes

- Ajustar el comportamiento del botón **Play/Pause**:
  - Al pausar: el temporizador se detiene y el tablero queda oculto (o cubierto con overlay “Paused”).
  - Mientras esté pausado: el tablero es no-interactivo (clics/acciones no deben modificar el estado).
  - Al reanudar: el temporizador continúa y el tablero vuelve a mostrarse de forma normal.
- Asegurar que **Restart** limpia el estado de pausa y devuelve la UI a un juego jugable.

## Capabilities

### New Capabilities
- `minesweeper-pause-behavior`: Especificación y requisitos para que la pausa oculte/cubra el tablero y deshabilite la interacción.

### Modified Capabilities
- _(None — este cambio introduce una especificación incremental de la regla de pausa.)_

## Impact

- Principalmente afecta a la UI del dashboard (estado de pausa, overlay, y bloqueo de interacciones).
- No requiere cambios en el FSM base `idle | playing | won | lost`; la pausa se modela como estado de UI adicional (por ejemplo, `isPaused`).
