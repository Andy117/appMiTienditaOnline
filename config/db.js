import { Sequelize } from "sequelize"
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize (process.env.DB_NAME, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: process.env.DB_ENCRYPT === 'true',
            trustedConnection: true,
        }
    },
    logging: false,

})

sequelize.authenticate()
    .then(() => {
        console.log('Conexion a la base de datos realizada con exito')
    })
    .catch((error) => {
        console.error('Error al conectarse a la base de datos', error)
    })

export default sequelize
