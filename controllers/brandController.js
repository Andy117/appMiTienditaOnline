import sequelize from "../config/dbConfig.js"
import { z } from 'zod'
import { brandSchema, updateBrandSchema } from "../models/brandModel.js"

export const getAllBrands = async (req, res) => {
    try {
        const[brands] = await sequelize.query('SELECT * FROM MarcaProductos')
        res.json(brands)
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener las marcas...', error})
    }
}

export const createBrand = async (req, res) => {
    try {
        const validatedData = brandSchema.parse(req.body)
        await sequelize.query('EXEC sp_AgregarMarca @nombre_marca=:nombre_marca',
            {
                replacements: validatedData
            }
        )
        res.json({ message: 'Marca de productos creada con exito!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors})
        }
        res.status(500).json({ message: 'Error al crear la categoria...', error })
    }
}

export const updateBrand = async (req, res) => {
    const { id } = req.params

    try {
        const[brand] = await sequelize.query(
            'SELECT * FROM MarcaProductos WHERE idMarcaProductos = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!brand){
            return res.status(404).json({ message: 'La categoria no existe o ya ha sido eliminada...'})
        }

        const validatedData = updateBrandSchema.parse(req.body)
        await sequelize.query('EXEC sp_ActualizarMarca @idMarca=:id,@nombre_marca=:nombre_marca',
            {
                replacements: { ...validatedData, id }
            }
        )
        res.json({ message: "Marca de producto actualizada con exito!!" })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Hubo un problema al actualizar la Marca...', error})
    }
}

export const deleteBrand = async (req, res) => {
    const { id } = req.params

    try {
        const[brand] = await sequelize.query(
            'SELECT * FROM MarcaProductos WHERE idMarcaProductos = :id',
            {replacements: { id } , type: sequelize.QueryTypes.SELECT}
        )
        
        if(!brand){
            return res.status(404).json({ message: 'La categoria no existe o ya ha sido eliminada...'})
        }
        
        await sequelize.query('EXEC sp_DesactivarMarca @idMarca=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )
        res.json({ message: 'Marca eliminada/desactivada con exito!!'})
    } catch (error) {
        res.status(500).json({ message: 'Hubo un problema al eliminar/desactivar la Marca', error})
        //console.log(error)
    }
}