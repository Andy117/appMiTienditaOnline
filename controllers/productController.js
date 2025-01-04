import sequelize from "../config/dbConfig.js"
import { productSchema, updateProductSchema } from "../models/productModel.js";
import { z } from 'zod'
import multer from 'multer'
import path from 'path'

const storage = multer.memoryStorage()
const upload = multer({ storage })

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 15; 
        const offset = (page - 1) * limit; 

        const [totalResults] = await sequelize.query(
            'SELECT COUNT(*) AS total FROM Productos WHERE estados_idEstados <> 1'
        );
        const total = totalResults[0].total; 
        const [products] = await sequelize.query(
            `SELECT * FROM Productos WHERE estados_idEstados <> 1 ORDER BY idProductos OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        );

        res.json({
            products,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
};


export const createProduct = async (req, res) => {
    try {
        const validatedData = productSchema.parse(req.body)

        const imagenBuffer = req.file?.buffer || null

        await sequelize.query('EXEC sp_AgregarProducto @idCategoriaProducto=:idCategoriaProducto, @idMarcaProducto=:idMarcaProducto, @idPresentacionProducto=:idPresentacionProducto, @idUnidadDeMedidaProducto=:idUnidadDeMedidaProducto, @nombreProducto=:nombreProducto, @descripcionProducto=:descripcionProducto, @codigoProducto=:codigoProducto, @stockProducto=:stockProducto, @precioProducto=:precioProducto, @imagenProducto=:imagenProducto',
            {
                replacements: { ...validatedData, imagenProducto: imagenBuffer},
                type: sequelize.QueryTypes.RAW
            })
            res.json({ message: 'Producto creado con exito!! '})
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors})
        }
        res.status(500).json({ message: 'Error al crear producto...', error: error.message})
        console.log(error)
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params

    try {
        const [product] = await sequelize.query(
            'SELECT * FROM Productos Where idProductos = :id',
            { replacements: { id }, type: sequelize.QueryTypes.SELECT }
        )

        if(!product){
            return res.status(404).json({ message: 'El producto no existe o ya ha sido eliminado...'})
        }

        const validatedData = updateProductSchema.parse(req.body)
        await sequelize.query('EXEC sp_ActualizarProducto @idProducto=:id, @idCategoriaProducto=:idCategoriaProducto, @idMarcaProducto=:idMarcaProducto, @idPresentacionProducto=:idPresentacionProducto, @idUnidadDeMedidaProducto=:idUnidadDeMedidaProducto, @nombreProducto=:nombreProducto, @descripcionProducto=:descripcionProducto, @codigoProducto=:codigoProducto, @stockProducto=:stockProducto, @precioProducto=:precioProducto, @imagenProducto=:imagenProducto',
        {
            replacements: { id,
                ...validatedData}
        }
    )

        res.json({ message: 'Producto actualizado con exito!!!'})
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        console.error('error de actualizacion: ',error)
        res.status(500).json({ message: 'Error al actualizar producto...', error: error.message})
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const [product] = await sequelize.query(
            'SELECT * FROM Productos Where idProductos = :id',
            { replacements: { id }, type: sequelize.QueryTypes.SELECT }
        )

        if(!product){
            return res.status(404).json({ message: 'El producto no existe o ya ha sido eliminado...'})
        }

        await sequelize.query('EXEC sp_DesactivarProducto @idProducto=:id', { replacements: { id }})
        res.json({ message: 'Producto eliminado/desactivado exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar/desactivar el producto...', error: error.message})
    }
}