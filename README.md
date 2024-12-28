# appMiTienditaOnline
El reto de la segunda semana consistió en la instalación de NodeJS, Express, POSTMAN para poder desarrollar una API-REST enlazada a la base de datos que habiamos creado en semanas anteriores.

## Tecnologias utilizadas
Se utilizó Node.js para el backend, Express como framework para la creación de la API REST, Sequelize como ORM, y SQL Server como sistema de base de datos.

## Funcionamiento del proyecto
Para hacer que el proyecto comience a funcionar basta con escribir en la linea de comandos:
```
npm run dev
```
Esto hará que el servidor comience a ejecutarse en el puerto 1234, en caso este esté ocupado, se ejecutará en el puerto 3000

## Contenido de mi archivo .env
No es buena práctica el compartir las variables de entorno, sin embargo, en esta ocasión serán compartidas dichas variables.
```
### Configuración para la BD
DB_NAME = GDA00109-OT-AndersonVelasquez
DB_USER= andyvelau1
DB_PASS= 1234567890
DB_HOST= localhost

### Configuración para el servidor con express
PORT = 1234

### Configuración de los JWTs
JWT_SECRET = esto_es_muy_seguro
JWT_EXPIRES_IN = 24h

```

## Caracteristicas del proyecto
Los endpoints que se crearon fueron los siguientes:
- CRUD de Categorias de productos
- CRUD de Marcas de productos
- CRUD de Unidad de Medida de los productos
- CRUD de la Presentación de los productos
- CRUD de los Productos
- CRUD de los Estados
- CRUD de los Clientes
- CRUD de los Usuarios
- CRUD de Orden/Detalles.

## Seguridad
Autenticación mediante JSON Web Tokens (JWT)
Encriptación de contraseña para los usuarios.
Gestión de roles y permisos (Operadores y Clientes)

### DOCUMENTACIÓN DE LA API
La API fué testeada utilizando POSTMAN, la documentación completa la pueden encontrar [AQUÍ](https://documenter.getpostman.com/view/35529959/2sAYJ3FMhh)

De antemano, gracias por la oportunidad y el tiempo que se toman revisando nuestros proyectos 🙏

`## Autor: Anderson Josué Velásquez Usén (GDA00109-OT)`
