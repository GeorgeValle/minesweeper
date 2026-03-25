Phase 1: Global Theme & Assets Setup
[✓] 1.1 Update Global Palette: Modificar index.css o el contenedor principal en App.tsx para aplicar el fondo Agua Marina (#7FFFD4) en todo el dashboard.

[✓] 1.2 Asset Migration: Crear el directorio public/assets/ y copiar todos los archivos .png desde src/assets/ a public/assets/.

Phase 2: Toolbar Refinement (Toolbar.tsx)
[✓] 2.1 Icon Integration: Reemplazar los textos de los botones:

'Shovel' → /assets/radar.png.

'Flag' → /assets/boya.png.

'Question' → Emoji ❓.

[✓] 2.2 Layout Fix: Revertir a diseño centrado y con ancho máximo controlado. Eliminar gap-6 p-6 que estiraba la UI y usar un contenedor max-w-4xl mx-auto con gap-6 más controlado (aumentado de gap-4).

[✓] 2.3 Pressed States: Implementar estilos de Tailwind para que el botón de la herramienta activa se vea "hundido" (tonalidad más oscura y sombra sutil).

[✓] 2.4 Dynamic Pause Button: Cambiar el texto "Play/Pause" por los emojis ▶️ y ⏸️ que alternen según el estado isPaused.

[✓] 2.5 Button Consistency: Asegurar que todos los botones tengan el mismo tamaño visual mediante padding uniforme (px-4 py-3) para que boya.png, radar.png y ❓ tengan apariencia consistente.

Phase 3: Board & Cell Evolution (Board.tsx & Cell.tsx)
[✓] 3.1 Aquatic Cell Styling:

Celdas no descubiertas: Tono de agua marina claro (#B2FFF2).

Celdas despejadas: Tono de agua marina oscuro (#40E0D0).

[✓] 3.2 Cell Borders: Todas las celdas deben tener bordes claros para definir sus límites usando un color oscuro de aquamarine con opacidad (border border-[rgb(0,139,139)/0.3]).

[✓] 3.3 Marine Markers:

Actualizar el renderizado de banderas para mostrar la imagen de la boya amarilla (boya.png).

Mantener el emoji ❓ para las marcas de duda.

[✓] 3.4 Redefined Loss Logic:

Al detectar status === 'lost', revelar todas las minas usando /assets/mina.png.

Implementar un overlay de "X" roja específicamente sobre la mina que el usuario clickeó (identificando el índice de la explosión).

Phase 4: Verification & Performance
[✓] 4.1 React 19 Optimization: Verificar que las celdas sigan usando React.memo para evitar re-renders innecesarios durante el efecto de agua marina.

[✓] 4.2 Manual Playtest: Confirmar que los botones de dificultad y tamaño reinician correctamente el tema acuático y limpian el estado de pausa.