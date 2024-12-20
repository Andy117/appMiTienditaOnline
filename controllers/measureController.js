import sequelize from "../config/dbConfig.js"
import { z } from 'zod'
import { measureSchema, updateMeasureSchema } from "../models/mesUnityModel.js"

export const getAllMeasure = async (req, res) => {
    try {
        const[measure] = await sequelize.query('SELECT * FROM UnidadDeMedidaProductos')
        res.json(measure)
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener todas las unidades de medida registradas' })
    }
}

export const createMeasure = async (req, res) => {
    try {
        const validatedData = measureSchema.parse(req.body)
        await sequelize.query('EXEC sp_AgregarUnidadMedida @nombre_UnidadMedida=:nombre_unidad',
            {
                replacements: validatedData
            }
        )
        res.json({ message: 'Unidad de medida agregada con exito!!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Error al crear la presentacion de producto... ', error })
    }
}

export const updateMeasure = async (req, res) => {
    const { id } = req.params
    try {
        const[measure] = await sequelize.query(
            'SELECT * FROM UnidadDeMedidaProductos WHERE idUnidadMedida = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )

        if(!measure){
            return res.status(404).json({ message: 'La presentacion no existe o ya ha sido eliminada'})
        }

        const validatedData = updateMeasureSchema.parse(req.body)
        await sequelize.query('EXEC sp_ActualizarUnidadMedida @idUnidadMedida=:id, @nombre_UnidadMedida=:nombre_unidad',
            {
                replacements: { ...validatedData, id }
            }
        )
        res.json({ message: 'Presentacion de producto actualizada con exito!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Hubo un problema al actualizar la unidad de medida...', error})
    }
}

export const deleteMeasure = async (req, res) => {
    const { id } = req.params
    try {
        const[measure] = await sequelize.query(
            'SELECT * FROM UnidadDeMedidaProductos WHERE idUnidadMedida = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )

        if(!measure){
            return res.status(404).json({ message: 'La presentacion no existe o ya ha sido eliminada'})
        }

        await sequelize.query('EXEC sp_DesactivarUnidadMedida @idUnidadMedida=:id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        res.json({ message: 'Unidad de medida desactivada con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al desactivar la unidad de medida...', error })
    }
}