import { z } from 'zod'
import sequelize from '../config/dbConfig.js'
import bcrypt from 'bcrypt'
import { updatePasswordSchema, updateUserSchema, userSchema } from '../models/userModel.js'

const SALT_ROUNDS = 10

export const getAllUsers = async (req, res) => {
    try {
        const[users] = await sequelize.query('SELECT * FROM Usuarios')
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener todos los usuarios... ', error})
    }
}

export const getAllUsersPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 15
        const offset = (page - 1) * limit

        const [totalResults] = await sequelize.query(
            'SELECT COUNT(*) AS total FROM Usuarios'
        )

        const total = totalResults[0].total; 

        const [user] = await sequelize.query(
            `SELECT * FROM Usuarios ORDER BY idUsuarios OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        )
        res.json({
            user,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las marcas...', error})
    }
}

export const createUser = async (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body)
        const hashedPassword = await bcrypt.hash(validatedData.contrasenia, SALT_ROUNDS);
        validatedData.contrasenia = hashedPassword

        const[existingUser] = await sequelize.query(
            'SELECT * FROM Usuarios Where correo_electronico = :email OR telefono = :telefono',
            { replacements: { email: validatedData.correo_electronico, telefono: validatedData.telefono}, type: sequelize.QueryTypes.SELECT }
        )

        if(existingUser){
            return res.status(400).json({
                message: 'El correo electronico o el telefono ya estan en uso...',
                errors: {
                    correo_electronico: existingUser.correo_electronico === validatedData.correo_electronico ? 'Ya existe un usuario con el correo electronico ingresado...': undefined,
                    telefono: existingUser.telefono === validatedData.telefono ? 'Ya existe un usuario con el numero de telefono ingresado...': undefined
                }
            })
        }

        await sequelize.query(
            'EXEC sp_AgregarUsuario @nombre_completo=:nombre_completo, @correo_electronico=:correo_electronico, @contrasenia=:contrasenia, @telefono=:telefono, @fecha_nacimiento=:fecha_nacimiento',
            {
                replacements: {...validatedData}
            }
        )
        res.json({ message: 'Usuario agregado con exito!!!'})

    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors})
        }
        res.status(500).json({ message: 'Error al crear el usuario... ', error: error.message})
    }
}

export const updateUser = async (req,res) => {
    const { id } = req.params
    try {
        const[user] = await sequelize.query(
            'SELECT * FROM Usuarios WHERE idUsuarios = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!user){
            return res.status(404).json({ message: 'El usuario no existe o ya ha sido eliminado...'})
        }

        const validatedData = updateUserSchema.parse(req.body)

        if(validatedData.contrasenia){
            validatedData.contrasenia = await bcrypt.hash(validatedData.contrasenia, SALT_ROUNDS)
        }

        const[existingUser] = await sequelize.query(
            'SELECT * FROM Usuarios Where (correo_electronico = :correo_electronico OR telefono = :telefono) AND idUsuarios != :id',
            { 
                replacements: { correo_electronico: validatedData.correo_electronico, telefono: validatedData.telefono, id}, 
                type: sequelize.QueryTypes.SELECT 
            }
        )

        if(existingUser){
            return res.status(400).json({
                message: 'El correo electronico o el telefono ya estan en uso...',
                errors: {
                    correo_electronico: existingUser.correo_electronico === validatedData.correo_electronico ? 'Ya existe un usuario con el correo electronico ingresado...': undefined,
                    telefono: existingUser.telefono === validatedData.telefono ? 'Ya existe un usuario con el numero de telefono ingresado...': undefined
                }
            })
        }

        await sequelize.query(
            'EXEC sp_ActualizarUsuario @idUsuarios=:id, @nombre_completo=:nombre_completo, @correo_electronico=:correo_electronico, @telefono=:telefono',
            {
                replacements: {...validatedData, id}
            }
        )
        res.json({ message: 'Usuario actualizado con exito!!!'})

    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }

        res.status(500).json({ message: 'Hubo un problema al actualizar los datos del usuario...', error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const[user] = await sequelize.query(
            'SELECT * FROM Usuarios WHERE idUsuarios = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!user){
            return res.status(404).json({ message: 'El usuario no existe o ya ha sido eliminado...'})
        }

        await sequelize.query(
            'EXEC sp_DesactivarUsuario @idUsuario=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )
        res.json({ message: 'Usuario desactivado/eliminado con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al eliminar/desactivar al usuario', error })
    }
}

export const activateUser = async (req, res) => {
    const { id } = req.params
    try {
        const[user] = await sequelize.query(
            'SELECT * FROM Usuarios WHERE idUsuarios = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!user){
            return res.status(404).json({ message: 'El usuario no existe o ya ha sido eliminado...'})
        }

        await sequelize.query(
            'EXEC sp_ActivarUsuario @idUsuarios=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )
        res.json({ message: 'Usuario activado con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al activar al usuario', error })
    }
}

export const changeToAdmin = async (req, res) => {
    const { id } = req.params
    try {
        const[user] = await sequelize.query(
            'SELECT * FROM Usuarios WHERE idUsuarios = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!user){
            return res.status(404).json({ message: 'El usuario no existe o ya ha sido eliminado...'})
        }

        await sequelize.query(
            'EXEC sp_CambiarAOperador @idUsuario=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )
        res.json({ message: 'Se cambio el rol a Administrador con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al cambiar el rol del usuario', error })
    }
}

export const changeToClient = async (req, res) => {
    const { id } = req.params
    try {
        const[user] = await sequelize.query(
            'SELECT * FROM Usuarios WHERE idUsuarios = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!user){
            return res.status(404).json({ message: 'El usuario no existe o ya ha sido eliminado...'})
        }

        await sequelize.query(
            'EXEC sp_CambiarACliente @idUsuario=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )
        res.json({ message: 'Se cambio el rol a Cliente con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al cambiar el rol del usuario', error })
    }
}

export const changePassword = async (req, res) => {
    const { id } = req.params
    try {
        const[user] = await sequelize.query(
            'SELECT * FROM Usuarios WHERE idUsuarios = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!user){
            return res.status(404).json({ message: 'El usuario no existe o ya ha sido eliminado...'})
        }

        const validatedData = updatePasswordSchema.parse(req.body)

        if(validatedData.contrasenia){
            validatedData.contrasenia = await bcrypt.hash(validatedData.contrasenia, SALT_ROUNDS)
        }

        await sequelize.query('EXEC sp_CambiarContraseniaUsuario @idUsuario=:id, @nuevaContrasenia=:contrasenia',
            {replacements: {...validatedData, id}, type: sequelize.QueryTypes.SELECT}
        )

        res.json({ message: 'Contraseña actualizada con exito!!'})
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({errors: error.errors})
        }
        res.status(500).json({message: 'Hubo un problema al actualizar la contraseña...', error})
    }
}