## 1. UI pause state wiring

- [x] 1.1 Introducir un estado UI `isPaused` en el dashboard (con un toggle por el botón `Play/Pause`).
- [x] 1.2 Asegurar que `isPaused` solo está activo cuando el FSM está en `playing` (o deshabilitar el botón fuera de `playing`, según el diseño elegido).
- [x] 1.3 Implementar que `Restart` ponga `isPaused` en `false` y deje el tablero visible.

## 2. Timer behavior (congelar/continuar)

- [x] 2.1 Actualizar el `setInterval`/efecto del timer para incrementar segundos solo cuando `status === 'playing' && isPaused === false`.
- [x] 2.2 Verificar que al pausar el valor mostrado deje de aumentar y al reanudar vuelva a aumentar desde el mismo valor.

## 3. Ocultar/cubrir el tablero al pausar

- [x] 3.1 Crear un componente `PausedOverlay` (texto “Paused”) o elegir la estrategia equivalente de ocultación.
- [x] 3.2 Condicionar la renderización del `Board`: cuando `isPaused === true`, ocultar (o des-montar) el tablero y mostrar el overlay.

## 4. Bloqueo de interacción mientras está pausado

- [x] 4.1 Asegurar que el tablero sea no-interactivo cuando `isPaused === true` (por unmount/overlay y/o `pointer-events: none`).
- [x] 4.2 Añadir guard en handlers de celdas (shovel/flag/question): si `isPaused === true`, no despachar acciones que alteren la grilla.

## 5. Verificación manual

- [x] 5.1 Jugar una partida, pausar, intentar clicks repetidos sobre celdas y confirmar que la grilla no cambia.
- [x] 5.2 Reanudar y confirmar que el tablero vuelve, el timer continúa y las herramientas vuelven a funcionar.
- [x] 5.3 Probar restart desde pausa para confirmar que el juego reinicia en estado no-pausado y el tablero aparece.

