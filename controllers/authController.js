import jwt from 'jsonwebtoken'
import sequelize from '../config/dbConfig.js' 

export const login = async (req, res) => {
    const { email, password } = req.body
    try{
        const [results] = await sequelize.query('SELECT * FROM Usuarios WHERE correo_electronico = :email', { replacements: { email }})
        const user = results[0]

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado... '})
        if(user.contrasenia !== password) return res.status(401).json({ message: 'Contraseña incorrecta...' })
        
        
        const token = jwt.sign( {id: user.idUsuarios}, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    }catch(error){
        res.status(500).json({ message: 'Error en la autenticacion',error })
    }
}