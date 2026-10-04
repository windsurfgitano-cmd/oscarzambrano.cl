# Oscar Zambrano

Página de **En construcción** para **oscarzambrano.cl**, con el chibi elegido por Oscar, su firma de marca y un enlace a **@oscarzambrano.cl**. Sitio estático en HTML y CSS; fuentes y recursos alojados en el propio sitio. No necesita paquetes, variables de entorno ni compilación.

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

Esta entrega sube el código al repositorio. La importación a Vercel y los cambios DNS los realiza Oscar; todavía no se han aplicado.

## Vista local

Sirve la carpeta `public` con cualquier servidor de archivos estáticos. Por ejemplo, desde la raíz del repositorio:

```sh
python3 -m http.server 8080 --directory public
```

Abre `http://localhost:8080`.

## Recursos de marca

La ilustración y la referencia de firma proceden de los diseños de Higgsfield ya aprobados. Se reutilizaron; esta página no requirió nuevas generaciones de IA. La firma se presenta en una ventana SVG; el archivo original se conserva intacto. Fuentes: Anton e Inter, con licencia SIL Open Font License incluida en `public/assets/licencias`. La imagen social se compone mediante captura del diseño HTML.
