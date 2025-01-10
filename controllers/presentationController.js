import sequelize from "../config/dbConfig.js"
import { z } from 'zod'
import { presentationSchema, updatePresentationSchema } from "../models/presentationModel.js"

export const getAllPresentationPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 15
        const offset = (page - 1) * limit

        const [totalResults] = await sequelize.query(
            'SELECT COUNT(*) AS total FROM PresentacionProductos'
        )

        const total = totalResults[0].total; 

        const [presentation] = await sequelize.query(
            `SELECT * FROM PresentacionProductos ORDER BY idPresentacionProductos OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        )
        res.json({
            presentation,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las marcas...', error})
    }
}


export const getAllPresentations = async (req, res) => {
    try {
        const[presentations] = await sequelize.query('SELECT * FROM PresentacionProductos')
        res.json(presentations)
    } catch (error) {
        res.statuts(500).json({ message: 'Hubo un error al obtener las presentaciones...', error})
    }
}

export const createPresentation = async (req, res) => {
    try {
        const validatedData = presentationSchema.parse(req.body)

        const[existingPresentation] = await sequelize.query(
            'SELECT * FROM PresentacionProductos WHERE nombre_presentacion = :nombre_presentacion',
            {
                replacements: {nombre_presentacion: validatedData.nombre_presentacion},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingPresentation){
            return res.status(400).json({
                message: 'La presentacion ingresada ya existe...',
                errors:{
                    nombre_presentacion: existingPresentation.nombre_presentacion === validatedData.nombre_presentacion ? 'La presentacion ya existe...': undefined
                }
            })
        }

        await sequelize.query('EXEC sp_AgregarPresentacion @nombre_presentacion=:nombre_presentacion',
            {
                replacements: validatedData
            }
        )
        res.json({ message: 'Presentacion de productos creada con exito!'})
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors})
        }
        res.statuts(500).json({ message: 'Error al crear la presentacion...', error })
    }
}

export const updatePresentation = async (req, res) => {
    const { id } = req.params

    try {
        const[presentation] = await sequelize.query(
            'SELECT * FROM PresentacionProductos WHERE idPresentacionProductos = :id',
            {replacements:{ id }, type: sequelize.QueryTypes.SELECT}
        )

        if(!presentation){
            return res.status(404).json({ message: 'La presentacion no existe o ya ha sido eliminada...'})
        }

        const validatedData = updatePresentationSchema.parse(req.body)

        const[existingPresentation] = await sequelize.query(
            'SELECT * FROM PresentacionProductos WHERE nombre_presentacion = :nombre_presentacion AND idPresentacionProductos != :id',
            {
                replacements: {nombre_presentacion: validatedData.nombre_presentacion, id},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingPresentation){
            return res.status(400).json({
                message: 'La presentacion ingresada ya existe...',
                errors:{
                    nombre_presentacion: existingPresentation.nombre_presentacion === validatedData.nombre_presentacion ? 'La presentacion ya existe...': undefined
                }
            })
        }

        await sequelize.query('EXEC sp_ActualizarPresentacion @idPresentacion=:id, @nombre_presentacion=:nombre_presentacion',
            {
                replacements: { ...validatedData, id }
            }
        )
        res.json({ message: 'Presentacion actualizada con exito!!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Hubo un problema al actualizar la Presentacion', error })
    }
}

export const deletePresentation = async(req, res) =>{
    const { id } = req.params
    try {
        const[presentation] = await sequelize.query(
            'SELECT * FROM PresentacionProductos WHERE idPresentacionProductos = :id',
            {replacements:{ id }, type: sequelize.QueryTypes.SELECT}
        )

        if(!presentation){
            return res.status(404).json({ message: 'La presentacion no existe o ya ha sido eliminada...'})
        }
        await sequelize.query('EXEC sp_DesactivarPresentacion @idPresentacion=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )
        res.json({ message: 'Presentacion desactivada/eliminada con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al desactivar/eliminar la presentacion... ', error })
    }
}

export const activatePresentation = async(req, res) =>{
    const { id } = req.params
    try {
        const[presentation] = await sequelize.query(
            'SELECT * FROM PresentacionProductos WHERE idPresentacionProductos = :id',
            {replacements:{ id }, type: sequelize.QueryTypes.SELECT}
        )

        if(!presentation){
            return res.status(404).json({ message: 'La presentacion no existe o ya ha sido eliminada...'})
        }
        await sequelize.query('EXEC sp_ActivarPresentacion @idPresentacionProducto=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )
        res.json({ message: 'Presentacion activada con exito!!!' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al activar la presentacion... ', error })
    }
}