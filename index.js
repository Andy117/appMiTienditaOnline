import express from 'express'
import sequelize from './config/dbConfig.js'
import 'dotenv/config'
import productRoutes from './routes/productRoutes.js'
import routerLogin from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import presentationRoutes from './routes/presentationRoutes.js'
import measureRoutes from './routes/measureRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

//defining my routes
app.use('/api', routerLogin)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/presentations', presentationRoutes)
app.use('/api/measures', measureRoutes)

//testing my db connection
sequelize.authenticate()
    .then(() => console.log('Conexion a BD exitosa!!'))
    .catch(err => console.error('Error al conectar a la BD ', err))

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))