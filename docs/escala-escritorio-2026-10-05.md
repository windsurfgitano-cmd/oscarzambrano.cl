# Escala de escritorio — 5 de octubre de 2026

Los textos y varios objetos conservaban límites fijos al ampliar la ventana.
La composición ahora utiliza una unidad fluida desde 1101 px, limitada por el
ancho y el alto de la pantalla. Firma, jerarquía tipográfica, columnas, objetos
y navegación crecen juntos. Se conserva una escala por nivel H1–H5.

| Vista comprobada | Texto principal | H2 | Firma de entrada |
| --- | --- | --- | --- |
| 1920 × 1080 | 22,46 px | 157,25 px | 1128 px |
| 2560 × 1440 | 29,95 px | 209,66 px | 1504 px |

Las imágenes de los proyectos aprovechan toda la columna con su proporción
900/618. El personaje continúa usando el ajuste de margen bajo la cabecera.
La escala depende también de la altura para evitar ampliar una ventana ancha
y baja como si fuera una pantalla 2K completa. El modo de lectura ampliada
conserva su flujo natural y queda fuera de estas reglas de composición.

## Verificación

- Inspección visual y mediciones DOM en Full HD y 2K.
- Cinco escenas narrativas revisadas a 2K: contenido dentro del alto de pantalla
  durante el recorrido, personaje con margen superior y sin desbordamiento horizontal.
- Comparación móvil a 374 × 654: mismos tamaños de cabecera, firma, textos,
  personaje local e imágenes de proyectos antes y después.
- 15 pruebas existentes aprobadas.
- Lighthouse local: accesibilidad 100/100. No equivale a una certificación WCAG completa.
- Capturas y mediciones guardadas en `qa/`, excluidas del repositorio público.
