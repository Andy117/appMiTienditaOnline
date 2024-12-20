import express from 'express'
import sequelize from './config/dbConfig.js'
import 'dotenv/config'
import productRoutes from './routes/productRoutes.js'
import routerLogin from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

//defining my routes
app.use('/api', routerLogin)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

//testing my db connection
sequelize.authenticate()
    .then(() => console.log('Conexion a BD exitosa!!'))
    .catch(err => console.error('Error al conectar a la BD ', err))

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))