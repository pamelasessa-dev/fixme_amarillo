# Tienda de Electrodomésticos - API (fixme)

API REST hecha con NestJS + Prisma + PostgreSQL, con autenticación JWT y un
CRUD para 3 tablas: usuarios, productos y pedidos.

> Este repositorio se usa como ejercicio de práctica: a propósito tiene
> errores regados en el código. Esta es la versión más difícil de la
> serie: casi todos son errores de **seguridad y arquitectura**. No
> alcanza con leer el código y probar los endpoints "a mano": para
> entender varios de estos bugs vas a tener que investigar un concepto
> concreto (manejo de secretos, JWT, control de acceso, constraints de
> base de datos, manejo de errores, condiciones de carrera). No hay
> comentarios que los delaten.

## Requisitos

- Node.js 20+
- PostgreSQL corriendo localmente (o accesible por red)

## Cómo levantar el proyecto

1. Las dependencias ya están instaladas (`node_modules` incluido). Si
   hiciera falta, `npm install`.

2. El archivo `.env` ya viene con credenciales de ejemplo para un
   PostgreSQL local. Ajústalas si tu base de datos usa otras:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/electrodomesticos_fixme?schema=public"
   JWT_SECRET="cambia-este-secreto"
   ```

3. Genera el cliente de Prisma y corre las migraciones:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. (Opcional) Siembra datos de ejemplo (usuario admin + un par de
   productos):

   ```bash
   npm run prisma:seed
   ```

   Usuario admin: `admin@tienda.com` / `Admin123!`

5. Levanta el servidor en modo desarrollo:

   ```bash
   npm run start:dev
   ```

   **Nota:** hay un error de compilación relacionado con el modelo de
   datos (`prisma/schema.prisma`). Vas a tener que resolverlo (y volver a
   generar el cliente de Prisma) antes de poder levantar el proyecto.

## Estructura del proyecto

```
src/
  prisma/         conexión a la base de datos (PrismaService/PrismaModule)
  auth/           registro, login y JWT (guards, decorators, dto)
  users/          usuarios
  productos/      electrodomésticos en catálogo
  pedidos/        pedidos que hace un usuario sobre un producto
  main.ts         arranque de la app (aquí se configura el ValidationPipe)
prisma/
  schema.prisma   modelo de datos (User, Producto, Pedido)
  seed.ts         datos de ejemplo
```

## Recursos

- `POST /auth/register`, `POST /auth/login`
- `GET /users/me` (requiere estar logueado)
- `GET /productos`, `GET /productos/:id` (público)
- `POST /productos`, `PATCH /productos/:id`, `DELETE /productos/:id`
  (requiere rol `ADMIN`)
- `POST /pedidos`, `GET /pedidos/mios` (requiere estar logueado)
- `GET /pedidos`, `PATCH /pedidos/:id` (requiere rol `ADMIN`; al confirmar
  un pedido se descuenta el stock del producto)

## Reto

Hay **10 bugs**, casi todos de seguridad o de diseño. Prueba los
endpoints con Postman, Insomnia, Thunder Client o el REST Client de tu
editor, pero esta vez además vas a tener que pensar como atacante: ¿qué
pasa si mando un campo que no debería mandar? ¿qué pasa si armo un token
yo mismo? ¿qué pasa si confirmo más pedidos de los que hay stock?

Tips (conceptos a investigar, sin decirte dónde está cada uno):

- Manejo de secretos: ¿de dónde debería salir el secreto para firmar y
  verificar un JWT?
- JWT: ¿cuál es la diferencia entre **verificar** un token y simplemente
  **leer/decodificar** su contenido? ¿Qué pasa si una API solo hace lo
  segundo?
- Control de acceso: para cada ruta que debería ser solo de `ADMIN`,
  confirma que de verdad lo sea. Probá también con datos de otro usuario.
- Qué datos expone cada endpoint: ¿alguna respuesta trae más información
  de la que debería (por ejemplo, algo que nunca debería salir del
  backend)?
- Registro de usuarios: ¿qué campos puede mandar el cliente al crear su
  cuenta? ¿Debería poder mandarlos todos?
- Constraints en la base de datos: el código de la aplicación valida
  cosas, pero ¿qué pasa si esa validación no alcanza y dos requests
  llegan casi al mismo tiempo? ¿Qué respaldo tiene la base de datos?
- Manejo de errores: cuando algo falla, ¿el error se reporta tal cual es,
  o se está "tragando" en algún lado y disfrazando de éxito?
- Reglas de negocio: cuando se confirma un pedido, ¿alguien verifica que
  de verdad haya stock suficiente antes de descontarlo?
