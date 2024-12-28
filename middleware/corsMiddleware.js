import cors from 'cors'

const corsOptions = {
    origin: ['http://localhost:1234', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

export default corsOptions