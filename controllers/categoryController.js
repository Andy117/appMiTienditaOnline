import sequelize from "../config/dbConfig.js"
import { z } from 'zod'
import { categorySchema, updateCategorySchema } from "../models/categoryModel.js"

export const getAllCategories = async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM CategoriaProductos')
        res.json(results)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorias...', error})
    }
}

export const createCategory = async (req, res) => {
    try {
        const validatedData = categorySchema.parse(req.body)
        await sequelize.query('EXEC sp_AgregarCategoria @nombre_categoria=:nombre_categoria',
            {
                replacements: validatedData
            }
        )
        res.json({ message: 'Categoria creada con exito!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors})
        }
        res.status(500).json({ message: 'Error al crear categoria...', error})
    }
}

export const updateCategory = async (req, res) => {
    const { id } = req.params

    try {
        const[category] = await sequelize.query(
            'SELECT * FROM CategoriaProductos WHERE idCategoriaProductos = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!category){
            return res.status(404).json({ message: 'La categoria no existe o ya ha sido eliminada...'})
        }

        const validatedData = updateCategorySchema.parse(req.body)
        await sequelize.query('EXEC sp_ActualizarCategoria @idCategoriaProducto=:id, @nombre_categoria=:nombre_categoria',
            {
                replacements: {...validatedData, id}
            }
        )
        res.json({ message: 'Categoria actualizada con exito!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Error al actualizar la categoria...', error})
    }
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params

    try {
        const[category] = await sequelize.query(
            'SELECT * FROM CategoriaProductos WHERE idCategoriaProductos = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!category){
            return res.status(404).json({ message: 'La categoria no existe o ya ha sido eliminada...'})
        }

        await sequelize.query('EXEC sp_DesactivarCategoria @idCategoriaProducto=:id',
            {
                replacements: { id }
            }
        )
        res.json({ message: 'Categoria eliminada/desactivada exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar/desactivar la categoria...', error: error.message})

    }
}