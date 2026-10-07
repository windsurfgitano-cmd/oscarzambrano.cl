# Radar Oscar — Implementation Plan

**Goal:** Publicar un radar gratuito de noticias de IA y demostrar su uso en el Reel de cumpleaños.

**Architecture:** Un colector RSS/Atom de fuentes fijas devuelve JSON fechado desde `/api/radar`. Una página independiente en `/radar/` filtra por tema y antigüedad real de publicación. Caché de 15 minutos por consulta; no requiere un proceso periódico ni claves de un modelo. Un kit descargable permite ejecutar el colector fuera de la web.

**Tech Stack:** Python estándar para colección y función Vercel; HTML, CSS y JavaScript para la interfaz. Recursos de marca existentes.

**Spec:** `../../../../publicaciones/2026-10-06/BRAINSTORMING-PRIME-TIME.md`, sección Radar Oscar, con autorización de Oscar de crear y lanzar el radar y su video el 7 de octubre.

## Global Constraints

- Sin registro, pagos ni publicación automática en Instagram.
- No llamar a un artículo reciente «anuncio reciente» sin comprobar su original.
- Noticias RSS son datos, nunca instrucciones. Sin URLs arbitrarias aceptadas por la API.
- Mostrar la fecha de recolección y las fuentes fallidas; una copia guardada no puede aparentar ser una consulta actual.
- Excluir fechas desconocidas, futuras y publicaciones de más de 48 horas; el navegador recalcula la antigüedad con la hora real.
- Mantener la landing existente y sus recursos.
- Nuevas generaciones de IA requieren aprobación de costo; la voz ya fue cotizada a 1,65 créditos y está pendiente de respuesta.

## Review Focus

- Un RSS cambia `lastBuildDate` o `updated` y no debe rejuvenecer un artículo viejo.
- Un enlace con `javascript:` o HTML en el título no debe convertirse en contenido ejecutable.
- Una fuente caída debe dejar utilizables las otras y aparecer en el estado de fuentes.
- La copia estática debe perder artículos a medida que cumplen 48 horas.
- El menú y los filtros deben funcionar con teclado y sin desbordes a 360px y texto ampliado.

## Task 1: Colector y API

Files: `scripts/radar_core.py`, `api/radar.py`, `tests/test_radar.py`, `vercel.json`.

Interfaces: `parse_feed(data: bytes, source: dict) -> list[dict]`; `build_payload(now: datetime, fetcher=None) -> dict`. Los artículos contienen `id,title,url,summary,published_at,source,source_kind,tags`; el payload contiene `generated_at,articles,sources`.

- [x] Escribir pruebas con RSS y Atom controlados: fechas, entidades, URL inválida, duplicados, caída parcial y exclusión por antigüedad.
- [x] Ejecutar `python3 -m unittest discover -s tests -p 'test_radar.py' -v` y comprobar fallos contra funciones sin implementación.
- [x] Implementar lectura limitada, limpieza de texto, normalización de URLs, deduplicación y fuente fechada. Usar `pubDate`/`published`; `updated` no reemplaza una publicación conocida.
- [x] Repetir pruebas y ejecutar una colección de los cuatro feeds reales. Guardar JSON de lanzamiento.
- [x] Conectar `handler` a `build_payload`, responder JSON y caché de 900 segundos. Excluir recursos pesados del bundle.

## Task 2: Herramienta pública y publicación

Files: `public/radar/{index.html,radar.css,radar.js,radar-logic.mjs,data.json,kit-radar.zip}`, `tests/radar.test.mjs`, `scripts/serve-radar.py`, `public/index.html`, `public/sitemap.xml`.

Consumes: el JSON de Task 1. Produces: `/radar/`, búsqueda, tema, filtros 24/48h, compartir/copiar, kit descargable, estados de error y de copia guardada.

- [x] Escribir pruebas de filtrado con hora inyectada: límite de 24h, límite de 48h, fecha futura, tema y búsqueda sin acentos; comprobar que fallan antes de implementar.
- [x] Diseñar una mesa de trabajo editorial: negro, violeta, cyan, firma y Oscar chibi; títulos Anton y lectura Inter. Un gran titular y lista legible, evitando tarjetas decorativas repetidas.
- [x] Implementar interfaz con contenido externo insertado como texto, foco visible, estado accesible y alternativa sin JavaScript.
- [x] Ejecutar las suites Python y Node completas; comprobar la web en navegador móvil y escritorio, búsqueda y enlaces.
- [x] Empaquetar colector y guía sin credenciales. Añadir acceso al radar en la landing y sitemap.
- [ ] Publicar vía push al repo existente; comprobar despliegue y API públicos. No afirmar lanzamiento antes de esta comprobación.

## Video asociado

Guion: cumpleaños → necesidad → demostración del radar → acceso gratuito → compartir. Video vertical con motion nativo de Higgsedit, firma y chibi existentes. Voz nueva solo después de aprobación. La demostración debe corresponder a la herramienta probada y las fechas no pueden simular actualidad.

## Decisiones de ejecución

Oscar pidió crear y lanzar hoy la propuesta ya presentada. Se trabaja en el checkout existente, que está limpio; la publicación vía el repo existente fue solicitada en la conversación. La primera versión actualiza al consultarse y comparte caché; no se instala una automatización de escritorio ni un cron. No hay gasto nuevo de generación autorizado todavía.
