# Registro de auditoría anterior — 5 de octubre de 2026

Estas mediciones corresponden a la revisión que incluía FAQ. Después Oscar pidió reemplazarla por «Lo que me mueve». Los informes originales se conservan como registro histórico; las puntuaciones no se atribuyen automáticamente a la revisión posterior.

# Verificación de la landing — 5 de octubre de 2026

Revisión local de `http://127.0.0.1:8771/`, con Lighthouse 13.5.0 y Chrome headless. Informes originales: `qa/lighthouse-mobile-2026-10-05.report.html` y `qa/lighthouse-desktop-2026-10-05.report.html`, con sus respectivos JSON. `qa/` queda fuera de Git.

| Categoría | Móvil | Escritorio |
| --- | ---: | ---: |
| Rendimiento | 82 | 99 |
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 100 | 100 |
| SEO | 100 | 100 |
| Navegación agéntica | 100 | 100 |

La primera carga móvil obtuvo 50 en rendimiento; el recorte lossless de la firma, las imágenes optimizadas y la carga del 3D al comenzar a interactuar mejoraron el resultado. La escultura sigue disponible durante el recorrido. No se cambió el diseño según el auditor ni se filtraron fallos del informe.

## Comprobaciones realizadas

- Node: cinco pruebas del controlador de voz pasan. Detener/reemplazar invalida finales tardíos, pausa/reanudación conserva la toma y un error no adelanta capítulos.
- Navegador: Anterior/Siguiente cambian de capítulo, actualizan hash, llevan foco al encabezado y respetan extremos 1/8 y 8/8. El lector avanzó automáticamente desde Inicio hasta En escena durante la prueba real. La calidad sonora de las voces disponibles depende del navegador y sistema.
- Opciones: velocidad, avance automático y detener lectura; Escape cierra el panel. El lector no usa servicios de voz de pago ni créditos de generación.
- FAQ: apertura de respuesta y avance posterior a Contacto comprobados. La animación se recalcula cuando el contenido cambia de altura.
- Tipografía: todos los H2 de escritorio usan 112 px; los H3 comparten escala. Los tamaños se definen en rem con dos ajustes responsivos. H4/H5 quedan definidos para contenido futuro, sin introducir títulos artificiales.
- axe-core: cero infracciones en opciones abiertas a 278 px de ancho, texto al 200% a 320 px y espaciado personalizado a 320 px. Se corrigieron el desbordamiento del lector y el límite vertical de su panel. Los resultados incompletos de contraste sobre degradados requieren revisión manual.
- Teclado: salto al contenido, foco visible, controles de movimiento y navegación revisados. Se reserva espacio para el lector inferior y se corrige el foco bajo la cabecera.
- HTML: ocho capítulos, IDs únicos y recursos locales existentes. Diez preguntas y respuestas de FAQ coinciden exactamente con JSON-LD.
- Sitemap XML, perfil JSON y configuración Vercel parsean correctamente. JavaScript pasa comprobación de sintaxis; `git diff --check` pasa.

## Límites de la revisión

100 en accesibilidad es una puntuación automatizada; no certifica todos los criterios WCAG 2.2 AA. No se completó una auditoría independiente con VoiceOver ni una revisión manual de todos los estados de contraste dinámico. El movimiento reducido y colores forzados tienen variantes implementadas, pero no se certifica aquí su comportamiento en cada sistema.

Rendimiento móvil quedó en 82/100, escritorio en 99/100. Medir otra vez en HTTPS con compresión y caché reales; no se afirma un 100 de rendimiento ni resultados de campo. La revisión está local, sin push ni despliegue. No se han pedido indexaciones ni confirmado citas en motores externos.

## Revisión editorial posterior

Se retiraron el acordeón, FAQPage y las preguntas de Markdown/llms. El séptimo capítulo ahora es «Lo que me mueve», con «Que algo te pase» como título. La navegación y voz conservan ocho capítulos. El bloque mantiene la escala H2 compartida y texto HTML accesible.

Reauditoría de la revisión editorial: Lighthouse 13.5.0, accesibilidad 100/100 y SEO 100/100. Informes `qa/lighthouse-editorial-2026-10-05.report.*`. Navegación 7/8 → 8/8 → 7/8 comprobada en navegador; foco en el encabezado correspondiente y ancho 373 px sin desbordamiento horizontal.

## Márgenes del personaje y cabecera adaptable

El ajuste del personaje usa la altura real de cabecera, lector y contenedor en cada tamaño. Reserva 24 px de separación más holgura para el movimiento; reduce la escala cuando la pantalla es baja. La pose Ideas antes quedaba 28 px bajo la cabecera; después se midieron unos 33 px libres. En móvil se midieron entre 30 y 37 px durante los cambios de capítulo. En escritorio a 1028 × 643 px se midieron unos 33 px.

La cabecera se retira al avanzar y reaparece al subir o navegar con Tab. La prueba de teclado detectó un scroll de foco que volvía a esconderla; se corrigió conservándola visible durante la navegación de teclado, hasta volver a ratón, rueda o pantalla táctil. Las nueve pruebas del lector y encuadre pasan; JavaScript y `git diff --check` pasan. Lighthouse de accesibilidad tras esta revisión: 100/100, informe `qa/lighthouse-personaje-2026-10-05.report.*`.

## Obras con vínculo y expresión

Se sustituyeron las esculturas genéricas de Tribu y Consejeros por dos ilustraciones conceptuales con Oscar: colaboración entre emprendedores y conversación con presencias sintéticas. Los originales Higgsfield tienen transparencia nativa; las exportaciones WebP conservan alpha y añaden margen. Cada escena se sirve a 500 o 900 px según el ancho: versiones pequeñas de 53.808 y 64.544 bytes; grandes de 140.238 y 171.574 bytes. Textos alternativos, dimensiones declaradas, carga diferida y decodificación asíncrona.

Se verificaron imágenes cargadas y ausencia de desbordamiento horizontal a 374 × 654 y 1440 × 1000 px. En escritorio las dos columnas comparten ancho y encuadre; en móvil las escenas se apilan. Las nueve pruebas existentes, sintaxis JavaScript y `git diff --check` pasan. Lighthouse 13.5.0 tras la sustitución: accesibilidad 100/100; informe `qa/lighthouse-obras-2026-10-05.report.*`. No se repitió la medición de rendimiento ni se afirma una puntuación nueva para esa categoría. Captura `qa/obras-con-alma-2026-10-05.jpg`. Revisión local, sin push ni despliegue.

## Composición propia para móvil

Se retiró el escenario fijo en móvil y se incorporaron seis escenas decorativas en el flujo HTML. Los gestos de Oscar, objetos y palabras ahora viajan juntos; GSAP aplica desplazamientos locales suaves sin ocultar títulos ni texto. La portada usa un plano más cercano. Las ilustraciones nuevas de proyectos aprovechan su proporción real y tienen menos espacio alrededor. Se conserva la escala H2 móvil de 56 px y escritorio de 112 px.

A 373 × 654 px, Mirada pasó de 942 a 722 px de contenido/capítulo y Crear de 1130 a 839 px. El título de Mirada, que antes aparecía alrededor de y=647 al entrar, ahora queda alrededor de y=16 al usar los controles táctiles de capítulos. Un evento de navegación sincroniza el detector de dirección para que volver con Anterior no haga aparecer la cabecera sobre el título. Se comprobaron avance y retroceso, llegada hasta Contacto, pausa/reanudación y reaparición de cabecera con Tab.

Sin desbordamiento horizontal en móvil de 320 × 700 y 373 × 654 px. Se comprobó escritorio a 1280 × 720 y geometría a 1440 × 900 px: escenas móviles ocultas y escenario fijo conservado. La fixture local de axe-core 4.13.0, a 320 × 700 px con opciones abiertas, dio cero infracciones con texto al 200% y espaciado personalizado. La prueba detectó una palabra larga del manifiesto fuera del ancho: se corrigió permitiendo reflujo de párrafos en lectura ampliada. Se añadió rol de grupo al contador para admitir su nombre accesible. Los resultados incompletos restantes incluyen contraste de glifos y elementos cubiertos por el panel de la propia prueba; se mantienen los límites de auditoría manual descritos arriba.

Lighthouse 13.5.0 de la revisión final: accesibilidad 100/100, informe `qa/lighthouse-movil-composicion-2026-10-05.report.*`. Las nueve pruebas existentes, sintaxis y `git diff --check` pasan. Capturas `qa/movil-portada-integrada-2026-10-05.jpg` y `qa/movil-mirada-integrada-2026-10-05.jpg`; mediciones en `qa/movil-composicion-2026-10-05.json`. No se generaron imágenes ni videos adicionales, no se gastaron créditos de generación y no se publicó esta revisión.

## Lectura y capítulos como herramienta opcional

La barra empieza cerrada. Se abre desde el icono de audífonos de la cabecera, con nombre accesible, aria-expanded y aria-controls. Cerrada queda fuera del árbol de accesibilidad y del orden de foco; no reserva espacio inferior (`--reader-height: 0px`). Abrir no reproduce voz automáticamente. Cerrar con el botón, el activador o Escape detiene la voz y devuelve el foco al activador. Si las opciones están abiertas, el primer Escape cierra solo las opciones; el siguiente cierra la herramienta. Escape también funciona después de avanzar y llevar el foco al título.

Se verificó apertura, inicio y pausa de voz, cierre desde «Continuar lectura», retorno a «Escuchar» al reabrir y liberación del espacio. La vuelta de la cabecera al devolver foco podía tapar el título del capítulo: se corrigió conservando separación debajo de la cabecera. Se midieron unos 120 px para el título frente a una cabecera de 104 px. En móvil de 320 × 700 px, los controles abiertos se distribuyen en dos filas, sin desbordamiento horizontal; axe-core con lector y opciones abiertos dio cero infracciones. Lighthouse de entrada con lector cerrado: accesibilidad 100/100, informe `qa/lighthouse-lector-opcional-2026-10-05.report.*`. Las nueve pruebas existentes, sintaxis y `git diff --check` pasan. Captura de entrada limpia: `qa/lector-opcional-cerrado-2026-10-05.jpg`. Sin publicación de esta revisión.
# Narración con la voz de Oscar y publicación desde GitHub

El usuario solicitó reemplazar el lector del navegador por su voz mediante el MCP de Higgsfield y eligió el elemento **Oscar-zambrano**. Se generó un solo maestro con **Eleven v4**, de **139,284688 segundos**, y se exportaron ocho capítulos MP3 mono de 96 kb/s (aproximadamente 1,68 MB en conjunto). Los tiempos de corte se ubicaron en los silencios entre capítulos con una transcripción local con marcas por palabra. La transcripción automática sirve para localizar cortes; no es una certificación subjetiva de pronunciación ni de similitud de voz. El texto narrado y la duración de cada archivo están en `public/assets/audio/capitulos.json`.

La página no hace peticiones al generador: reutiliza los archivos estáticos. El audio tiene `preload="none"`, no tiene fuente inicial y solo carga el capítulo solicitado al pulsar **Escuchar a Oscar**. Pausa, continuación y velocidad mantienen el punto de reproducción. Cerrar limpia la fuente, cancela la carga y evita que una promesa o un final tardío active el avance. Los errores permiten reintentar y mantienen disponible el contenido escrito; no cambian silenciosamente a una voz sintética del navegador.

Verificación antes de publicar:

- **15 pruebas automáticas aprobadas**, incluidas seis para reproducción por archivos: carga bajo demanda, cierre durante carga, respuestas tardías, pausa/continuación, rechazo del navegador y archivo fallido.
- Navegador real: reproducción de Mirada, avance automático hasta capítulos posteriores, pausa, cambio a 1,25× sin perder posición, continuación y cierre con audio en pausa, fuente ausente y reserva inferior de 0 px. Sin desbordamiento horizontal en el viewport móvil observado.
- **Lighthouse: accesibilidad 100/100** para la versión con voz. Informe local: `qa/lighthouse-voz-oscar-2026-10-05.json`. Esta medición automática no sustituye una auditoría completa de WCAG 2.2 AA ni asegura otras categorías en 100.
- Existencia de todos los recursos referenciados por el HTML y los ocho audios; sintaxis JavaScript y `git diff --check` correctos.

Publicación autorizada por el usuario: actualizar `windsurfgitano-cmd/oscarzambrano.cl`, rama `main`, para que la integración existente de Vercel despliegue. El proyecto existente fue identificado como `ozymandias1/oscarzambrano.cl`; no se crea otro hosting ni se modifica DNS en esta entrega. Las verificaciones anteriores marcadas como locales corresponden a etapas previas de esta misma revisión.
