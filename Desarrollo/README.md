# API REST de Authors, Posts y Comments

Proyecto académico desarrollado con **Node.js, Express y PostgreSQL**. Incluye CRUD, validaciones, consultas SQL parametrizadas, pruebas con Jest/Supertest, documentación OpenAPI y configuración para Railway.

> La consigna menciona `posts.author_id (FK -> users.id)`, pero la entidad definida se llama `authors`. Por coherencia, la implementación usa `posts.author_id -> authors.id`.

## Tecnologías

- Node.js 20+
- Express
- PostgreSQL mediante `pg`
- Jest + Supertest + pg-mem
- Swagger UI / OpenAPI 3

## Estructura

```text
.
├── openapi/        # Especificación OpenAPI en YAML
├── scripts/        # Ejecutores Node para setup y seed
├── sql/            # setup.sql y seed.sql
├── src/
│   ├── controllers/    # Solicitudes y respuestas HTTP
│   ├── db/             # Pool de PostgreSQL
│   ├── middlewares/    # Errores y rutas no encontradas
│   ├── routes/         # Definición de endpoints
│   ├── services/       # Consultas SQL parametrizadas
│   ├── utils/          # Validaciones y errores HTTP
│   ├── app.js          # Configuración de Express
│   └── server.js       # Inicio del servidor
└── tests/          # Pruebas con Jest y Supertest
```

## Ejecutar localmente

### 1. Requisitos

Instala Node.js 20 o superior y PostgreSQL. Luego crea una base de datos:

```sql
CREATE DATABASE blog_api;
```

### 2. Configuración

```bash
cd Desarrollo
npm install
```

Copia `.env.example` como `.env` y ajusta la conexión:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:tu_clave@localhost:5432/blog_api
NODE_ENV=development
```

El archivo `.env` está ignorado por Git y no debe subirse al repositorio.

### 3. Crear tablas y ejecutar

```bash
npm run migrate
npm run seed
npm run dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`
- Health check: `http://localhost:3000/health`

## Pruebas

```bash
npm test
```

Las pruebas usan PostgreSQL en memoria; no modifican la base local.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/authors` | Lista authors |
| GET | `/authors/:id` | Obtiene un author |
| POST | `/authors` | Crea un author |
| PUT | `/authors/:id` | Actualiza un author |
| DELETE | `/authors/:id` | Elimina un author |
| GET | `/posts` | Lista posts |
| GET | `/posts/:id` | Obtiene un post |
| GET | `/posts/author/:authorId` | Posts con detalle del author |
| POST | `/posts` | Crea un post |
| PUT | `/posts/:id` | Actualiza un post |
| DELETE | `/posts/:id` | Elimina un post |
| GET | `/comments` | Lista comments (extra) |
| GET | `/posts/:postId/comments` | Comments de un post (extra) |
| POST | `/comments` | Crea un comment (extra) |

### Ejemplos JSON

Crear author:

```json
{
  "name": "Ana Torres",
  "email": "ana@example.com",
  "bio": "Autora de tecnología"
}
```

Crear post:

```json
{
  "author_id": 1,
  "title": "Mi primer post",
  "content": "Contenido del post",
  "published": true
}
```

Crear comment:

```json
{
  "post_id": 1,
  "author_id": 1,
  "content": "Excelente publicación"
}
```

## Integridad y eliminaciones

- El email de cada author es único.
- Al eliminar un author, PostgreSQL elimina sus posts y comments con `ON DELETE CASCADE`.
- Al eliminar un post, también elimina sus comments.
- Los índices de claves foráneas aceleran búsquedas por author y post.

## Despliegue en Railway

1. Sube el proyecto a un repositorio de GitHub, sin `.env` ni `node_modules`.
2. En Railway crea un proyecto nuevo y agrega un servicio **PostgreSQL**.
3. Agrega un servicio desde el repositorio de GitHub.
4. En la configuración del servicio establece **Root Directory** como `/Desarrollo`, porque allí se encuentran `package.json` y `railway.json`.
5. En variables del servicio verifica que exista `DATABASE_URL`. Railway suele proporcionarla al conectar PostgreSQL.
6. Agrega `NODE_ENV=production`. No es necesario fijar `PORT`; Railway la proporciona.
7. La configuración `railway.json` ejecuta `npm run migrate` antes del despliegue y `npm start` para iniciar.
8. Genera un dominio público desde **Settings > Networking**.
9. Verifica `/health` y luego abre `/api-docs` en el dominio público.

## Códigos HTTP

- `200`: consulta o actualización correcta
- `201`: recurso creado
- `204`: eliminación correcta
- `400`: datos inválidos, email duplicado o FK inexistente
- `404`: recurso o ruta inexistente
- `500`: error inesperado del servidor

