import express from 'express'
import sequelize from './config/db.js'

const app = express ()
const PORT = process.env.PORT ?? 3002

async function testDatabaseConnection() {
    try{
        await sequelize.authenticate()
        console.log('Conexion a la base de datos exitosa!!!')
    }catch(error){
        console.error('Hubo un error al conectarse a la DB', error)
    }
}

testDatabaseConnection()

app.get('/', (req, res) =>{
    res.send('Servidor funcionando y conectado a la base de datos')
})

app.listen(PORT, () =>{
    console.log('Server is running on port http://localhost:'+ PORT)
})