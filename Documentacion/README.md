# Documentación del proyecto

## 1. Descripción

API REST desarrollada con Node.js, Express y PostgreSQL para administrar authors y posts. Un author puede crear varios posts. Como funcionalidad adicional se implementó la entidad comments, relacionada tanto con posts como con authors.

La aplicación incluye validaciones, consultas SQL parametrizadas, respuestas HTTP consistentes, pruebas automatizadas con Supertest, documentación OpenAPI y configuración para Railway.

## 2. Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL.
- Git.

## 3. Ejecución local

Desde la raíz del repositorio:

```bash
cd Desarrollo
npm install
```

Crear la base de datos `blog_api` en PostgreSQL y copiar `.env.example` como `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:TU_CLAVE@localhost:5432/blog_api
NODE_ENV=development
```

Crear las tablas, insertar datos de prueba e iniciar el servidor:

```bash
npm run migrate
npm run seed
npm run dev
```

El script `sql/setup.sql` crea las tablas, claves foráneas e índices. El script `sql/seed.sql` inserta authors, un post y un comment de ejemplo de manera idempotente.

## 4. Pruebas

```bash
cd Desarrollo
npm test
```

Las pruebas usan Jest, Supertest y PostgreSQL en memoria. Verifican health check, validaciones, email único, CRUD de authors y posts, relación author–post, comments, eliminaciones y respuestas 404.

Para generar el reporte de cobertura:

```bash
npm test -- --coverage
```

## 5. OpenAPI y Swagger UI

Con el servidor en ejecución:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`
- Archivo fuente: `Desarrollo/openapi/openapi.yaml`

## 6. Despliegue en Railway

1. Subir este repositorio a GitHub sin incluir `.env` ni `node_modules`.
2. Crear un proyecto en Railway.
3. Agregar un servicio PostgreSQL.
4. Agregar un servicio desde el repositorio de GitHub.
5. Configurar **Root Directory** con el valor `/Desarrollo`.
6. Confirmar que `DATABASE_URL` esté disponible en el servicio de la API.
7. Agregar `NODE_ENV=production`.
8. Railway ejecutará `npm run migrate` antes del despliegue mediante `railway.json`.
9. Generar el dominio público en **Settings > Networking**.
10. Verificar las rutas `/health` y `/api-docs` desde la URL pública.

### Variables utilizadas

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Internal URL de PostgreSQL utilizada por la API |
| `NODE_ENV` | Debe establecerse como `production` en Railway |
| `PORT` | Railway la proporciona automáticamente |

La **Internal URL** conecta servicios dentro de Railway. La **Public URL** es el dominio generado para que los usuarios puedan acceder a la API desde Internet.

## 7. Integridad referencial

- `posts.author_id` referencia `authors.id`.
- `comments.post_id` referencia `posts.id`.
- `comments.author_id` referencia `authors.id`.
- Al eliminar un author se eliminan sus posts y comments relacionados.
- Al eliminar un post se eliminan sus comments.

La consigna menciona `users.id` en una línea, pero la entidad definida se llama `authors`; por esa razón la implementación utiliza correctamente `authors.id`.

## 8. Registro del uso de IA

Se utilizó ChatGPT como herramienta de apoyo durante el desarrollo del proyecto para:

- Proponer una estructura inicial de carpetas y capas.
- Revisar consultas SQL parametrizadas y relaciones entre tablas.
- Sugerir casos de prueba con Jest y Supertest.
- Apoyar la redacción de la especificación OpenAPI y la documentación.
- Detectar y corregir incompatibilidades encontradas al ejecutar las pruebas.

El código fue comprobado ejecutando las pruebas automatizadas, revisando las respuestas HTTP y verificando que no se incluyeran credenciales en el repositorio. La herramienta de IA no tuvo acceso a credenciales de PostgreSQL, GitHub ni Railway.
