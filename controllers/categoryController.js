import sequelize from "../config/dbConfig.js"
import { z } from 'zod'
import { categorySchema, updateCategorySchema } from "../models/categoryModel.js"

export const getAllCategoriesPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 15
        const offset = (page - 1) * limit

        const [totalResults] = await sequelize.query(
            'SELECT COUNT(*) AS total FROM CategoriaProductos'
        )

        const total = totalResults[0].total; 

        const [categories] = await sequelize.query(
            `SELECT * FROM CategoriaProductos ORDER BY idCategoriaProductos OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        )
        res.json({
            categories,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las categorias...', error})
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const [categories] = await sequelize.query('SELECT * FROM CategoriaProductos')
        res.json(categories)
    } catch (error) {
        res.statuts(500).json({ message: 'Hubo un error al obtener las categorias...', error})
    }
}

export const createCategory = async (req, res) => {
    try {
        const validatedData = categorySchema.parse(req.body)

        const[existingCategory] = await sequelize.query(
            'SELECT * FROM CategoriaProductos WHERE nombre_categoria = :nombre_categoria',
            {
                replacements: {nombre_categoria: validatedData.nombre_categoria},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingCategory){
            return res.status(400).json({
                message: 'La categoria ingresada ya existe...',
                errors:{
                    nombre_categoria: existingCategory.nombre_categoria === validatedData.nombre_categoria ? 'La categoria ya existe...': undefined
                }
            })
        }

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

        const[existingCategory] = await sequelize.query(
            'SELECT * FROM CategoriaProductos WHERE nombre_categoria = :nombre_categoria AND idCategoriaProductos != :id',
            {
                replacements: {nombre_categoria: validatedData.nombre_categoria, id},
                type: sequelize.QueryTypes.SELECT
            }
        )

        if(existingCategory){
            return res.status(400).json({
                message: 'La categoria ingresada ya existe...',
                errors:{
                    nombre_categoria: existingCategory.nombre_categoria === validatedData.nombre_categoria ? 'La categoria ya existe...': undefined
                }
            })
        }

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
        res.status(500).json({ message: 'Error al eliminar/desactivar la categoria...', error})

    }
}

export const activateCategory = async (req, res) => {
    const { id } = req.params

    try {
        const[category] = await sequelize.query(
            'SELECT * FROM CategoriaProductos WHERE idCategoriaProductos = :id',
            {replacements: { id }, type: sequelize.QueryTypes.SELECT}
        )
        
        if(!category){
            return res.status(404).json({ message: 'La categoria no existe o ya ha sido eliminada...'})
        }

        await sequelize.query('EXEC sp_ActivarCategoria @idCategoriaProducto=:id',
            {
                replacements: { id }
            }
        )
        res.json({ message: 'Categoria Activada exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al Activar la categoria...', error})

    }
}