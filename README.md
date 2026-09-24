# API REST de Authors, Posts y Comments

Proyecto académico desarrollado con **Node.js, Express y PostgreSQL** para administrar autores, publicaciones y comentarios. Incluye operaciones CRUD, validaciones de entrada, consultas SQL parametrizadas, pruebas automatizadas con Jest y Supertest, documentación OpenAPI y despliegue en Railway.

> La consigna menciona `posts.author_id` como una referencia a `users.id`, pero la entidad definida en el proyecto se llama `authors`. Por coherencia, la implementación utiliza `posts.author_id -> authors.id`.

## API desplegada

- API: https://proyectom2josereategui-production.up.railway.app
- Documentación Swagger: https://proyectom2josereategui-production.up.railway.app/api-docs
- Estado de la API: https://proyectom2josereategui-production.up.railway.app/health
- Repositorio: https://github.com/jose-reategui/ProyectoM2_JoseReategui

## Tecnologías

- Node.js 20+
- Express
- PostgreSQL mediante `pg`
- Jest
- Supertest
- `pg-mem`
- Swagger UI
- OpenAPI 3
- Railway

## Estructura del proyecto

```text
.
├── Desarrollo/
│   ├── openapi/               # Especificación OpenAPI en YAML
│   ├── scripts/               # Ejecutores Node para migración y seed
│   ├── sql/                   # setup.sql y seed.sql
│   ├── src/
│   │   ├── controllers/       # Solicitudes y respuestas HTTP
│   │   ├── db/                # Pool de PostgreSQL
│   │   ├── middlewares/       # Errores y rutas no encontradas
│   │   ├── routes/            # Definición de endpoints
│   │   ├── services/          # Consultas SQL parametrizadas
│   │   ├── utils/             # Validaciones y errores HTTP
│   │   ├── app.js             # Configuración de Express
│   │   └── server.js          # Inicio del servidor
│   ├── tests/                 # Pruebas con Jest y Supertest
│   ├── .env.example           # Plantilla de variables de entorno
│   ├── package.json           # Dependencias y scripts
│   └── railway.json           # Configuración de Railway
├── Documentacion/
│   └── evidencias-ia/         # Capturas del uso de IA
└── README.md                  # Documentación general del proyecto
```

## Ejecutar localmente

### 1. Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL.
- Git.

### 2. Instalar dependencias

Desde la raíz del repositorio:

```bash
cd Desarrollo
npm install
```

### 3. Crear la base de datos

En PostgreSQL:

```sql
CREATE DATABASE blog_api;
```

### 4. Configurar variables de entorno

Copia `.env.example` como `.env` y ajusta la conexión:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:TU_CLAVE@localhost:5432/blog_api
NODE_ENV=development
```

El archivo `.env` está ignorado por Git y no debe subirse al repositorio.

### 5. Crear tablas, insertar datos e iniciar

```bash
npm run migrate
npm run seed
npm run dev
```

El script `sql/setup.sql` crea las tablas, claves foráneas e índices. El script `sql/seed.sql` inserta datos de ejemplo de manera idempotente.

Servicios locales:

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/openapi.json
- Health check: http://localhost:3000/health

## Pruebas

Desde `Desarrollo/`:

```bash
npm test
```

Las pruebas utilizan Jest, Supertest y PostgreSQL en memoria mediante `pg-mem`; no modifican la base de datos local.

Se verifican:

- Health check.
- Validaciones de entrada.
- Email único.
- CRUD de authors y posts.
- Relación entre authors y posts.
- Creación y consulta de comments.
- Eliminaciones relacionadas.
- Respuesta 404 para rutas inexistentes.

Resultado verificado: **2 suites y 14 pruebas aprobadas**.

Para generar el reporte de cobertura:

```bash
npm test -- --coverage
```

## Endpoints

### Sistema

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Verifica el estado de la API |

### Authors

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/authors` | Lista todos los authors |
| GET | `/authors/:id` | Obtiene un author |
| POST | `/authors` | Crea un author |
| PUT | `/authors/:id` | Actualiza un author |
| DELETE | `/authors/:id` | Elimina un author y sus datos relacionados |

### Posts

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/posts` | Lista todos los posts |
| GET | `/posts/:id` | Obtiene un post |
| GET | `/posts/author/:authorId` | Lista posts con detalle del author |
| POST | `/posts` | Crea un post |
| PUT | `/posts/:id` | Actualiza un post |
| DELETE | `/posts/:id` | Elimina un post y sus comments |

### Comments (extra credit)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/comments` | Lista todos los comments |
| GET | `/posts/:postId/comments` | Lista los comments de un post |
| POST | `/comments` | Crea un comment |

## Ejemplos JSON

### Crear un author

```json
{
  "name": "Ana Torres",
  "email": "ana@example.com",
  "bio": "Autora de tecnología"
}
```

### Crear un post

```json
{
  "author_id": 1,
  "title": "Mi primer post",
  "content": "Contenido del post",
  "published": true
}
```

### Crear un comment

```json
{
  "post_id": 1,
  "author_id": 1,
  "content": "Excelente publicación"
}
```

## Integridad referencial

- `posts.author_id` referencia `authors.id`.
- `comments.post_id` referencia `posts.id`.
- `comments.author_id` referencia `authors.id`.
- El email de cada author es único.
- Al eliminar un author, PostgreSQL elimina sus posts y comments relacionados mediante `ON DELETE CASCADE`.
- Al eliminar un post, PostgreSQL elimina también sus comments.
- Los índices de claves foráneas agilizan las búsquedas por author y post.

## OpenAPI y Swagger UI

La especificación se encuentra en `Desarrollo/openapi/openapi.yaml` y puede consultarse mediante Swagger UI.

- Swagger local: http://localhost:3000/api-docs
- OpenAPI JSON local: http://localhost:3000/openapi.json
- Swagger en producción: https://proyectom2josereategui-production.up.railway.app/api-docs

La URL del servidor OpenAPI es relativa (`/`), por lo que Swagger utiliza automáticamente el dominio local o el dominio de Railway desde el que se abre.

## Despliegue en Railway

1. Subir el repositorio a GitHub sin incluir `.env` ni `node_modules`.
2. Crear un proyecto en Railway.
3. Agregar un servicio PostgreSQL.
4. Agregar un servicio desde el repositorio de GitHub.
5. Establecer **Root Directory** como `/Desarrollo`.
6. Configurar `DATABASE_URL` con la referencia proporcionada por PostgreSQL.
7. Agregar `NODE_ENV=production`.
8. Mantener `npm start` como comando de inicio.
9. Ejecutar `npm run migrate` antes de iniciar la API.
10. Generar el dominio público desde **Settings > Networking**.
11. Verificar `/health` y `/api-docs` desde el dominio público.

### Variables utilizadas

| Variable | Uso |
|---|---|
| `DATABASE_URL` | URL interna de PostgreSQL utilizada por la API |
| `NODE_ENV` | Entorno de ejecución; en Railway se establece como `production` |
| `PORT` | Puerto proporcionado automáticamente por Railway |

La URL interna conecta servicios dentro de Railway. El dominio público permite que los usuarios accedan a la API desde Internet.

## Códigos HTTP

| Código | Significado |
|---|---|
| 200 | Consulta o actualización correcta |
| 201 | Recurso creado |
| 204 | Eliminación correcta |
| 400 | Datos inválidos, email duplicado o clave foránea inexistente |
| 404 | Recurso o ruta inexistente |
| 500 | Error inesperado del servidor |

## Registro del uso de IA

Se utilizó **ChatGPT/Codex de OpenAI** como herramienta de asistencia. A continuación se registran cuatro consultas representativas del trabajo realizado.

Las capturas de estas consultas se almacenan por separado en `Documentacion/`, numeradas del 1 al 4. No se insertan en este README.

### 1. Mejora de las validaciones

Se le envio el siguiente prompt a la IA: ¿Puedes revisar y mejorar las validaciones de entrada de la API REST para authors, posts y comments, asegurando IDs positivos, textos no vacíos, email válido y que `published` sea booleano, con respuestas HTTP 400 claras?

**Respuesta:**

> Sí. Conviene centralizar las reglas en `src/utils/validators.js` y reutilizarlas desde los controladores. Los IDs deben convertirse a número y comprobarse con `Number.isInteger(id) && id > 0`; los textos deben validarse después de aplicar `trim()`; el email debe comprobar su formato; y `published`, cuando esté presente, debe cumplir `typeof published === "boolean"`. Si algún dato no es válido, el controlador debe responder con código 400 y un mensaje específico. También deben añadirse pruebas para valores vacíos, IDs negativos, emails inválidos y tipos incorrectos.

### 2. Corrección del manejo de `published`

**Prompt:**

Se le envio el siguiente prompt a la IA: En `posts.service.js`, al actualizar un post el valor `published: false` no se conserva correctamente. ¿Cómo puedo corregirlo sin convertir `false` en `null`?

**Respuesta:**

> El problema ocurre si se usa `published || null`, porque `false` se considera un valor falso y termina reemplazado por `null`. Utiliza `published ?? null`, ya que el operador `??` conserva tanto `false` como `true` y solo devuelve `null` cuando el valor es `null` o `undefined`. En la consulta puede mantenerse `published = COALESCE($4, published)` y enviar `published ?? null` como cuarto parámetro. Así, `false` se guarda correctamente y, si el campo no se envía, se conserva el valor anterior.

### 3. Mejora de la especificación OpenAPI

**Prompt:**

Se le envio el siguiente prompt a la IA: ¿Puedes revisar la especificación `openapi.yaml` de la API y proponer mejoras para que documente correctamente las validaciones, los esquemas, las respuestas de error y el endpoint de salud?

**Respuesta:**

Sí. La especificación openapi.yaml debería incluir las siguientes mejoras:

Documentar /health dentro de una etiqueta System.
Definir los IDs como enteros con minimum: 1.
Documentar email utilizando format: email.
Agregar minLength: 1 a los textos obligatorios.
Declarar published como un valor booleano.
Indicar los campos obligatorios mediante required.
Crear un esquema reutilizable Error para las respuestas 400, 404 y 500.
Incluir ejemplos que coincidan con los cuerpos y respuestas reales de la API.

Por ejemplo, el esquema de error puede declararse así:

Error:
  type: object
  required:
    - error
  properties:
    error:
      type: string
      example: Datos inválidos

Finalmente, debe validarse la sintaxis del archivo YAML y comprobarse que cada ruta documentada coincida con las rutas implementadas en Express.

### 4. Corrección de Swagger en Railway

**Prompt:**

Se le envio el siguiente prompt a la IA: Swagger UI abre correctamente en Railway, pero al usar **Execute** intenta enviar la solicitud a `http://localhost:3000` y muestra `Failed to fetch`. ¿Cómo hago para que utilice automáticamente el dominio actual?

**Respuesta:**

> En `openapi.yaml`, reemplaza el servidor fijo de localhost por una URL relativa:
>
> ```yaml
> servers:
>   - url: /
>     description: Servidor actual
> ```
>
> De esta manera, Swagger resuelve las solicitudes usando el mismo dominio desde el que fue abierto: `localhost` durante el desarrollo y el dominio público cuando se ejecuta en Railway. Después del cambio, valida el YAML, sube el commit, espera el nuevo despliegue y recarga Swagger con `Ctrl + F5`.