import { z } from 'zod'
import sequelize from '../config/dbConfig.js'
import { stateSchema, updateStateSchema } from '../models/stateModel.js'

export const getAllStates = async (req, res) => {
    try {
        const[states] = await sequelize.query('SELECT * FROM Estados')
        res.json(states)
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener todos los estados...', error })
    }
}

export const createState = async (req, res) => {
    try {
        const validatedData = stateSchema.parse(req.body)

        const[existingState] = await sequelize.query(
            'SELECT * FROM  Estados WHERE nombreEstado = :nombreEstado',
            {
                replacements: { nombreEstado: validatedData.nombre_estado},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingState){
            return res.status(400).json({
                message: 'El nombre del estado ya existe...',
                errors:{
                    nombre_estado: existingState.nombreEstado === validatedData.nombre_estado ? 'El estado con ese nombre ya existe...': undefined
                }
            })
        }

        await sequelize.query('EXEC sp_AgregarEstado @nombre_estado=:nombre_estado',
            {
                replacements: validatedData
            }
        )
        res.json({ message: 'Estado creado exitosamente!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Hubo un problema al intentar crear el estado', error})
    }
}

export const updateState = async (req, res) => {
    const { id } = req.params
    try {
        const[states] = await sequelize.query(
            'SELECT * FROM Estados WHERE idEstados = :id',
            {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(!states){
            return res.status(400).json({ message: 'El estado con ese ID no existe o ya ha sido eliminado... '})
        }

        const validatedData = updateStateSchema.parse(req.body)

        const[existingState] = await sequelize.query(
            'SELECT * FROM  Estados WHERE (nombreEstado = :nombreEstado) AND idEstados != :id',
            {
                replacements: { nombreEstado: validatedData.nombre_estado, id},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingState){
            return res.status(500).json({
                message: 'El nombre del estado ya existe...',
                errors:{
                    nombre_estado: existingState.nombreEstado === validatedData.nombre_estado ? 'El estado con ese nombre ya existe...': undefined
                }
            })
        }

        await sequelize.query('EXEC sp_ActualizarEstado @id_estado=:id, @nombre_estado=:nombre_estado',
            {
                replacements: { ...validatedData, id }
            }
        )
        res.json({ message: 'Estado actualizado exitosamente!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Hubo un problema al intentar actualizar el estado', error})
    }
}

export const deleteState = async (req, res) => {
    const { id } = req.params
    try {
        const[states] = await sequelize.query(
            'SELECT * FROM Estados WHERE idEstados = :id',
            {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(!states){
            return res.status(400).json({ message: 'El estado con ese ID no existe o ya ha sido eliminado... '})
        }

        await sequelize.query('DELETE FROM Estados WHERE idEstados=:id',
            {replacements:{id}, type: sequelize.QueryTypes.SELECT}
        )

        res.json({ message: 'Estado eliminado exitosamente...'})
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al eliminar el estado...'})
    }
}