# Repos para potenciar oscarzambrano.cl

Revisión: 5 de octubre de 2026. Fuentes primarias consultadas directamente. La landing se revisó en localhost; esta revisión aún no está publicada.

## Selección y aplicación

| Repositorio | Qué aporta | Aplicación en Oscar |
| --- | --- | --- |
| [GoogleChrome/lighthouse](https://github.com/GoogleChrome/lighthouse) | Auditorías automatizadas de accesibilidad, rendimiento, SEO, buenas prácticas y navegación agéntica. | Ejecutado en móvil y escritorio; informes HTML y JSON locales en `qa/`. Sin añadir dependencia a la página. |
| [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | Detecta problemas automatizables de accesibilidad, con reglas para WCAG 2.2. | Usado en revisión normal, opciones de voz abiertas, texto 200% y espaciado personalizado. Fixture excluido del sitio publicado. |
| [schemaorg/schemaorg](https://github.com/schemaorg/schemaorg) | Vocabulario para expresar personas, sitios, perfiles, obras y preguntas. | JSON-LD de Person, WebSite, ProfilePage y CreativeWork, consistente con el perfil visible. No se instala el repositorio completo. |
| [AnswerDotAI/llms-txt](https://github.com/AnswerDotAI/llms-txt) | Propuesta para ayudar a agentes a localizar contenido claro en Markdown. | `llms.txt`, `llms-full.txt`, `index.md`, enlaces HTML alternate/describedby y cabeceras de Vercel. |
| [kyliamet/geo-optimize-site](https://github.com/kyliamet/geo-optimize-site) | Skill de Codex orientada a revisar rastreo, estructura de respuestas, metadatos, datos estructurados y propagación. | Revisado su alcance declarado. Sus áreas principales quedan cubiertas por esta implementación. No instalado ni ejecutado: su README no constituye validación independiente de eficacia. |
| [GEO-optim/GEO](https://github.com/GEO-optim/GEO) | Código y benchmark del estudio original de Generative Engine Optimization. | Referencia de investigación para diseñar experimentos de visibilidad. No es un plugin de ranking ni un servicio que haya que insertar en la landing. |

## Qué ya tiene el sitio

- Perfil público consistente: Oscar Zambrano, Chile, agentes de IA, experiencias digitales, charlas y cursos.
- Proyectos principales: Tribu Impulsa y Consejeros IA; referencias secundarias a El Rey de las Páginas y Ultra Infinity Software.
- Participación aportada por Oscar: Agentes Crean Agentes, RE/MAX Chile, Novotel Vitacura, 21 de septiembre de 2026. No se presenta como TED/TEDx ni como una validación externa de ranking.
- Título, descripción, canonical, etiquetas sociales, texto HTML rastreable, `robots.txt` y `sitemap.xml`.
- Relato editorial en HTML sobre identidad, proyectos, IA agéntica, charlas y contacto. El capítulo «Lo que me mueve» reemplaza las preguntas frecuentes para conservar el tono personal.
- Perfil factual en `perfil.json`, versión Markdown y archivos llms sin datos privados ni detalles de implementación del producto.
- Una voz emergente de la IA agéntica en Chile como propuesta de marca. No se atribuyen premios, ranking nacional, edad, certificaciones o actividades futuras sin evidencia.

## Qué estos repos no prometen

`llms.txt` guía la lectura de agentes; no controla el entrenamiento de modelos ni garantiza menciones. [La documentación de Google](https://developers.google.com/search/docs/appearance/ai-features) indica que no hacen falta archivos de IA ni un marcado especial para aparecer en sus funciones de búsqueda con IA: siguen siendo esenciales el rastreo, la información textual útil y el SEO.

El estudio GEO usa un benchmark y condiciones experimentales; sus resultados no equivalen a una mejora garantizada para esta marca en buscadores actuales. La autoridad se refuerza con obras accesibles, casos demostrables, publicaciones originales y referencias externas reales que nombren a Oscar.

Un 100 de Lighthouse es una medición automática, no una certificación WCAG completa. [Google explica qué entra en la puntuación de accesibilidad](https://developer.chrome.com/docs/lighthouse/accessibility/scoring). Las revisiones manuales deben complementarla.

## Al publicar

1. Comprobar en el dominio final que homepage, canonical, robots, sitemap, Markdown y llms responden correctamente y que CDN/WAF no bloquean rastreadores.
2. Verificar la propiedad en Google Search Console y Bing Webmaster Tools; enviar el sitemap y revisar la URL canónica. Estas acciones no se han ejecutado desde esta revisión local.
3. Medir Lighthouse otra vez sobre HTTPS y el alojamiento real. Los valores locales no son datos de usuarios reales.
4. Mantener nombre, bio y enlaces consistentes en Instagram, LinkedIn y los proyectos. Incorporar enlaces públicos de las participaciones cuando existan.
5. Publicar piezas útiles con ejemplos propios: qué problema había, qué experiencia creó Oscar y qué cambió. Añadir testimonios o métricas solo con respaldo y permiso.
6. Medir consultas y menciones observables; comparar resultados con fecha y fuentes citadas. No confundir publicar cambios con que un buscador ya los haya incorporado.

No se instalaron rastreadores, grabadores de sesiones ni herramientas de pago; no hacen falta para dejar esta base preparada.
