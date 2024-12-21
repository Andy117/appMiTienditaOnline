import { z } from 'zod'
import sequelize from '../config/dbConfig.js'
import { clientSchema, updateClientSchema } from '../models/clientModel.js'

export const getAllClients = async (req, res) => {
    try {
        const[clients] = await sequelize.query('SELECT * FROM Clientes')
        res.json(clients)
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener todos los clientes...', error })
    }
}

export const createClient = async (req, res) => {
    try {
        const validatedData = clientSchema.parse(req.body)

        const[existingClient] = await sequelize.query(
            'SELECT * FROM Clientes Where email_cliente = :email OR telefono_cliente = :telefono',
            { replacements: { email: validatedData.email_cliente, telefono: validatedData.telefono_cliente}, type: sequelize.QueryTypes.SELECT }
        )

        if(existingClient){
            return res.status(400).json({
                message: 'El correo electronico o el telefono ya estan en uso...',
                errors: {
                    email_cliente: existingClient.email_cliente === validatedData.email_cliente ? 'Ya existe un cliente con el correo electronico ingresado...': undefined,
                    telefono_cliente: existingClient.telefono_cliente === validatedData.telefono_cliente ? 'Ya existe un cliente con el numero de telefono ingresado...': undefined
                }
            })
        }

        await sequelize.query('EXEC sp_AgregarCliente @razon_social=:razon_social, @nombre_comercial=:nombre_comercial, @direccion_entrega=:direccion_entrega, @telefono_cliente=:telefono_cliente, @email_cliente=:email_cliente',
            {
                replacements: validatedData
            }
        )
        res.json({ message: 'Cliente creado con exito!!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Error al crear el cliente...', error })
    }
}

export const updateClient = async (req, res) => {
    const { id } = req.params

    try {
        const[client] = await sequelize.query(
            'SELECT * FROM Clientes WHERE idClientes = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!client){
            return res.status(404).json({ message: 'El cliente no existe o ya ha sido eliminada...'})
        }

        const validatedData = updateClientSchema.parse(req.body)

        const [existingClient] = await sequelize.query(
            'SELECT * FROM Clientes WHERE (email_cliente = :email OR telefono_cliente = :telefono) AND idClientes != :id',
            {
                replacements: { email: validatedData.email_cliente, telefono: validatedData.telefono_cliente, id},
                type: sequelize.QueryTypes.SELECT
            }
        )
        
        if(existingClient){
            return res.status(400).json({
                message: 'El correo electronico o el telefono ya esta en uso...',
                errors:{
                    email_cliente: existingClient.email_cliente === validatedData.email_cliente ? 'El correo ya esta registrado por otro cliente...': undefined,
                    telefono_cliente: existingClient.telefono_cliente === validatedData.telefono_cliente ? 'El telefono ya esta registrado por otro cliente...': undefined
                }
            })
        }

        await sequelize.query('EXEC sp_ActualizarCliente @idCliente=:id, @razon_social=:razon_social, @nombre_comercial=:nombre_comercial, @direccion_entrega=:direccion_entrega, @telefono_cliente=:telefono_cliente, @email_cliente=:email_cliente',
            {
                replacements: { ...validatedData, id }
            }
        ) 
        res.json({ message: 'Cliente actualizado con exito!!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Hubo un problema al actualizar al cliente...', error })
    }
}

export const deleteClient = async (req, res) => {
    const { id } = req.params
    try {
        const[client] = await sequelize.query(
            'SELECT * FROM Clientes WHERE idClientes = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!client){
            return res.status(404).json({ message: 'El cliente no existe o ya ha sido eliminada...'})
        }

        await sequelize.query('EXEC sp_DesactivarCliente @idCliente=:id',
            {replacements: {id}, type: sequelize.QueryTypes.SELECT}
        )
        res.json({ message: 'Cliente eliminado/desactivado exitosamente!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al eliminar/desactivar al cliente... ', error })
    }
}