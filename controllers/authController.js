import jwt from 'jsonwebtoken'
import sequelize from '../config/dbConfig.js'
import bcrypt from 'bcrypt' 

export const login = async (req, res) => {
    const { email, password } = req.body
    try{
        const [results] = await sequelize.query('SELECT * FROM Usuarios WHERE correo_electronico = :email', { replacements: { email }})
        const user = results[0]

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado... '})

        const isPasswordValid = await bcrypt.compare(password, user.contrasenia)

        if(!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta...' })
        
        
        const token = jwt.sign( 
            {
                id: user.idUsuarios,
                rol_id: user.rol_idRol
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' })
        res.json({ Message: 'Datos ingresados correctamente :)',token })
    }catch(error){
        res.status(500).json({ message: 'Error en la autenticacion',error })
    }
}