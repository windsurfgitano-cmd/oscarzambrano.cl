# Oscar Zambrano

Landing personal de **oscarzambrano.cl**: seis escenas, un manifiesto personal y contacto, con Oscar orquestando agentes y experiencias digitales. Su firma original aparece en la entrada, la navegación y el cierre. Sitio estático en HTML, CSS y JavaScript; fuentes y recursos alojados en el propio sitio. No necesita paquetes, variables de entorno ni compilación.

## Conectar a Vercel

1. En Vercel, abre **Add New → Project** e importa `windsurfgitano-cmd/oscarzambrano.cl`.
2. Usa la raíz del repositorio como Root Directory y `main` como rama de producción.
3. Framework Preset: **Other**. La configuración del repositorio establece `public` como Output Directory y desactiva comandos de instalación y build. Si la interfaz pide los valores manualmente, deja Build Command vacío y usa `public` como salida.
4. Despliega y abre la URL que devuelva Vercel para comprobar el sitio.

[Documentación oficial para conectar GitHub](https://vercel.com/docs/git/vercel-for-github) y [configuración de vercel.json](https://vercel.com/docs/project-configuration/vercel-json).

## Conectar el dominio con DNS en Cloudflare

1. En **Settings → Domains** del proyecto de Vercel, añade `oscarzambrano.cl`; añade también `www.oscarzambrano.cl` si quieres que redirija al dominio principal.
2. Vercel mostrará los registros DNS que necesita ese proyecto. Copia los tipos, nombres y valores exactos a la zona DNS de `oscarzambrano.cl` en Cloudflare. Usa los valores del panel actual; no una IP o un destino de otro proyecto.
3. Comprueba en Vercel la validación del dominio y abre `https://oscarzambrano.cl`. No hace falta trasladar los nameservers a Vercel para añadir sus registros en el proveedor DNS existente.

[Guía oficial para añadir un dominio con DNS externo](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

La versión artística y su narración se publican desde la rama `main` de este repositorio, mediante la integración existente con Vercel. La configuración de dominio y DNS se gestiona por separado.

## Vista local

Sirve la carpeta `public` con cualquier servidor de archivos estáticos. Por ejemplo, desde la raíz del repositorio:

```sh
python3 -m http.server 8080 --directory public
```

Abre `http://localhost:8080`.

## Recursos de marca

La V2 usa imágenes de Oscar y objetos por separado, con transparencia real en `public/assets/capas`. Se generaron tres recursos en Higgsfield: personaje, hoja de seis poses y hoja de objetos (6 créditos cotizados adicionales; 8 de 100 en esta exploración). Los fondos de esas hojas se eliminaron con el generador de imágenes integrado y los recortes se exportaron a WebP. Tribu Impulsa y Consejeros IA ahora tienen escenas propias: colaboración entre emprendedores y una conversación que abre perspectivas. Las dos imágenes nuevas tienen alpha nativo y versiones WebP responsivas; suman 1 crédito cotizado adicional (9 de 100 en total). Los originales, las hojas con alpha, los prompts y el registro de presupuesto se conservan en el workspace de marca.

GSAP 3.13.0 y ScrollTrigger coordinan desplazamiento, escala, cambio entre seis poses clave, revelado de títulos y capas de profundidad. Las poses cambian por escena; no se trata de una secuencia de fotogramas de video ni de manos articuladas. Three.js 0.180.0 dibuja una escultura tubular y tres acentos, sin modelos externos, HDR descargado ni posprocesado. Su resolución se limita a 1.5 DPR y el dibujo a 30 fps; el render se detiene con la página oculta, la pausa o la escultura invisible. El fallo de WebGL conserva la narrativa de imágenes y texto. Las bibliotecas se sirven localmente.

La firma se presenta desde un recorte PNG sin pérdida en SVG; el original se conserva intacto. Fuentes Anton e Inter, con licencia SIL Open Font License en `public/assets/licencias`, junto a las referencias de licencia de GSAP y Three.js. La imagen social conserva la ilustración aprobada de Oscar orquestando. Hay pausa accesible y una variante estática para movimiento reducido. No se generaron videos.

Las comprobaciones actuales se realizan en navegador sobre la versión local. `verificar-pagina.cjs` pertenece a la anterior página de construcción y no debe ejecutarse para regenerar recursos de esta revisión.


## Lectura, accesibilidad y visibilidad

El recorrido tiene ocho capítulos. El icono de audífonos de la cabecera abre, a petición del visitante, Anterior/Siguiente y la narración con la voz de Oscar: pausa, continuación, velocidad y avance automático opcional. La barra empieza cerrada y no reserva espacio. Cerrar o Escape detiene la voz y devuelve el foco al activador; Escape primero cierra las opciones si están abiertas. La voz se inicia únicamente al pulsar Escuchar a Oscar. Un maestro de Eleven v4 (2 min 19 s, una generación en Higgsfield con la voz Oscar-zambrano; 9,43 créditos cotizados) se dividió en ocho MP3 mono de 96 kb/s. Solo se solicita el capítulo activado: el audio no se precarga al entrar ni consume créditos por visita. El contenido escrito funciona como alternativa a la narración; las pausas y los cambios de velocidad conservan la posición. Cerrar descarga el reproductor. Los cortes y el texto narrado están en `public/assets/audio/capitulos.json`. No hay credenciales ni conexión a un generador en la web. El 3D se carga al comenzar una interacción; el texto y las imágenes iniciales quedan disponibles antes. La pausa de movimiento y el movimiento reducido conservan la información.

La revisión incorpora tipografía consistente, foco visible, reflujo de texto ampliado, controles utilizables con teclado y un capítulo editorial sobre lo que mueve a Oscar. El perfil JSON-LD coincide con el contenido público. Se incluyen `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `index.md` y `perfil.json`, sin promesas de ranking ni entrenamiento.

Consulta [los repos revisados y el plan de publicación](docs/repos-seo-geo-aeo-2026-10-05.md) y [las mediciones y límites de la verificación](docs/verificacion-2026-10-05.md). Las pruebas del lector se ejecutan con `node --test tests/*.test.mjs`; no se necesitan dependencias de producción.

El personaje se ajusta al espacio disponible entre la cabecera y el lector para conservar margen alrededor del pelo, también durante transiciones y en pantallas bajas. La cabecera se retira al avanzar y regresa al subir o usar el teclado.

En móvil, cada capítulo tiene su propia composición de Oscar y objetos junto al título, en el flujo del documento. La portada usa un encuadre más cercano; se mantienen margen sobre la cabeza, texto accesible y parallax local con GSAP. Se eliminan los huecos reservados para el escenario fijo, que se conserva en escritorio. `mobile.css` contiene estos ajustes; las ilustraciones reutilizan los recursos existentes, sin nuevas generaciones. Anterior/Siguiente llevan al título y sincronizan la cabecera para no taparlo. Texto ampliado y espaciado personalizado usan lectura en flujo natural.
