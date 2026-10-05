# Composición móvil

Problema observado a 373 × 654 px: el personaje está en una capa fija, mientras el título de Mirada aparece alrededor de y=647 px al entrar al capítulo. El CSS reserva márgenes de 355 y 390 px y alturas mínimas de hasta 1130 px. La capa oscura de lectura puede tapar al personaje aunque su encuadre geométrico sea correcto.

Dirección: cada capítulo móvil tiene su propia escena junto al título, en el flujo del documento. Oscar y el objeto correspondiente forman una composición: orquestar una experiencia, hacerse una pregunta, dirigir, conversar, explorar y dar la bienvenida. La entrada usa un encuadre más cercano; la cabeza y las manos tienen aire. Las obras conservan las dos ilustraciones nuevas, con menos hueco entre imagen y texto.

Se conserva la paleta tinta #06040b, violeta #822bff, lila #cba8ff y cian #4ef4ed; Anton para títulos e Inter para lectura. No se altera la escala semántica H2/H3 ni la firma. El carácter viene de la relación entre gesto, objeto y palabras. No se añaden tarjetas, etiquetas ni imágenes de pago.

Alcance: HTML de escenas decorativas, CSS móvil aislado y animación local con GSAP. El escenario fijo de escritorio se conserva. Movimiento reducido, texto ampliado y navegación por capítulos deben seguir disponibles. Verificación: móvil estrecho y alto, escritorio, pausa, capítulos y Lighthouse de accesibilidad.
