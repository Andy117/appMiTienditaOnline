import sequelize from "../config/dbConfig.js"
import { z } from 'zod'
import { measureSchema, updateMeasureSchema } from "../models/mesUnityModel.js"

export const getAllMeasurePagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 15
        const offset = (page - 1) * limit

        const [totalResults] = await sequelize.query(
            'SELECT COUNT(*) AS total FROM UnidadDeMedidaProductos'
        )

        const total = totalResults[0].total; 

        const [measure] = await sequelize.query(
            `SELECT * FROM UnidadDeMedidaProductos ORDER BY idUnidadMedida OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        )
        res.json({
            measure,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las marcas...', error})
    }
}

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

        const[existingMeasure] = await sequelize.query(
            'SELECT * FROM UnidadDeMedidaProductos WHERE nombre_unidad = :nombre_unidad',
            {
                replacements: {nombre_unidad: validatedData.nombre_unidad},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingMeasure){
            return res.status(400).json({
                message: 'La unidad de medida ingresada ya existe...',
                errors:{
                    nombre_unidad: existingMeasure.nombre_unidad === validatedData.nombre_unidad ? 'La unidad de medida ya existe...': undefined
                }
            })
        }

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

        const[existingMeasure] = await sequelize.query(
            'SELECT * FROM UnidadDeMedidaProductos WHERE nombre_unidad = :nombre_unidad AND idUnidadMedida != :id',
            {
                replacements: {nombre_unidad: validatedData.nombre_unidad,id},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingMeasure){
            return res.status(400).json({
                message: 'La unidad de medida ingresada ya existe...',
                errors:{
                    nombre_unidad: existingMeasure.nombre_unidad === validatedData.nombre_unidad ? 'La unidad de medida ya existe...': undefined
                }
            })
        }

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

export const activateMeasure = async (req, res) => {
    const { id } = req.params
    try {
        const[measure] = await sequelize.query(
            'SELECT * FROM UnidadDeMedidaProductos WHERE idUnidadMedida = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )

        if(!measure){
            return res.status(404).json({ message: 'La presentacion no existe o ya ha sido eliminada'})
        }

        await sequelize.query('EXEC sp_ActivarUnidadMedida @idUnidadMedidaProducto=:id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        res.json({ message: 'Unidad de medida activada con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al activar la unidad de medida...', error })
    }
}