import sequelize from "../config/dbConfig.js"
import { productSchema, updateProductSchema } from "../models/productModel.js";
import { z } from 'zod'
import multer from 'multer'
import path from 'path'
import sharp from "sharp";

const storage = multer.memoryStorage()
const upload = multer({ storage })

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 15; 
        const offset = (page - 1) * limit; 

        const [totalResults] = await sequelize.query(
            `SELECT COUNT(*) AS total 
             FROM Productos p
             INNER JOIN CategoriaProductos c ON p.CategoriaProductos_idCategoriaProductos = c.idCategoriaProductos
             INNER JOIN MarcaProductos m ON p.MarcaProductos_idMarcaProductos = m.idMarcaProductos
             INNER JOIN PresentacionProductos pr ON p.PresentacionProductos_idPresentacionProductos = pr.idPresentacionProductos
             INNER JOIN UnidadDeMedidaProductos u ON p.UnidadDeMedidaProductos_idUnidadMedida = u.idUnidadMedida
             WHERE p.estados_idEstados = 2 
               AND c.estados_idEstados = 2
               AND m.estados_idEstados = 2
               AND pr.estados_idEstados = 2
               AND u.estados_idEstados = 2`
        );
        const total = totalResults[0].total; 
        
        const [products] = await sequelize.query(
            `SELECT p.*, 
                    c.nombre_categoria, 
                    m.nombre_marca, 
                    pr.nombre_presentacion, 
                    u.nombre_unidad 
             FROM Productos p
             INNER JOIN CategoriaProductos c ON p.CategoriaProductos_idCategoriaProductos = c.idCategoriaProductos
             INNER JOIN MarcaProductos m ON p.MarcaProductos_idMarcaProductos = m.idMarcaProductos
             INNER JOIN PresentacionProductos pr ON p.PresentacionProductos_idPresentacionProductos = pr.idPresentacionProductos
             INNER JOIN UnidadDeMedidaProductos u ON p.UnidadDeMedidaProductos_idUnidadMedida = u.idUnidadMedida
             WHERE p.estados_idEstados = 2 
               AND c.estados_idEstados = 2
               AND m.estados_idEstados = 2
               AND pr.estados_idEstados = 2
               AND u.estados_idEstados = 2
             ORDER BY p.CategoriaProductos_idCategoriaProductos 
             OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        );

        const productsWithBase64Images = products.map(product => ({
            ...product,
            imagen_producto: product.imagen_producto ? Buffer.from(product.imagen_producto).toString('base64') : null
        }));

        res.json({
            products: productsWithBase64Images,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error en getAllProducts:', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
}

export const getAllProductsOperator = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 15; 
        const offset = (page - 1) * limit; 

        const [totalResults] = await sequelize.query(
            'SELECT COUNT(*) AS total FROM Productos'
        );
        const total = totalResults[0].total; 
        
        // Obtener productos
        const [products] = await sequelize.query(
            `SELECT * FROM Productos ORDER BY Productos.CategoriaProductos_idCategoriaProductos OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        );

        const productsWithBase64Images = products.map(product => ({
            ...product,
            imagen_producto: product.imagen_producto ? Buffer.from(product.imagen_producto).toString('base64') : null
        }));

        res.json({
            products: productsWithBase64Images,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error en getAllProducts:', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
}

export const getProductsById = async (req, res) => {
    const { id } = req.params
    try {
        const [products] = await sequelize.query('SELECT * FROM Productos WHERE idProductos=:id',
            {
                replacements: {id},
                type: sequelize.QueryTypes.SELECT
            }
        )
        if(!products){
            return res.status(400).json({ message: 'El producto con ese ID no existe o ya ha sido eliminado... '})
        }

        const imagenBase64 = products.imagen_producto
            ? Buffer.from(products.imagen_producto).toString('base64')
            : null

        res.json({...products, imagen_producto: imagenBase64})
    } catch (error) {
        res.status(500).json('Hubo un problema al obtener los datos solicitados del producto...')
        console.log(error)
    }
}

export const getAllProductsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 15
        const offset = (page - 1) * limit

        const [totalResults] = await sequelize.query(
            'SELECT COUNT(*) AS total FROM Productos'
        )

        const total = totalResults[0].total; 

        const [product] = await sequelize.query(
            `SELECT * FROM Productos ORDER BY idProductos OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
            {
                replacements: { offset, limit },
            }
        )
        res.json({
            product,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos...', error})
    }
}

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

        let imagenBuffer = req.file?.buffer

        if(imagenBuffer){
            imagenBuffer = await sharp(imagenBuffer)
            .resize ( 800, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({
                quality: 80,
                progressive: true
            })
            .toBuffer()
        }else{
            imagenBuffer = product.imagen_producto
        }

        await sequelize.query('EXEC sp_ActualizarProducto @idProducto=:id, @idCategoriaProducto=:idCategoriaProducto, @idMarcaProducto=:idMarcaProducto, @idPresentacionProducto=:idPresentacionProducto, @idUnidadDeMedidaProducto=:idUnidadDeMedidaProducto, @nombreProducto=:nombreProducto, @descripcionProducto=:descripcionProducto, @codigoProducto=:codigoProducto, @stockProducto=:stockProducto, @precioProducto=:precioProducto, @imagenProducto=:imagenProducto',
        {
            replacements: { id,
                ...validatedData,
                imagenProducto: imagenBuffer
                    }
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

export const activateProduct = async (req, res) => {
    const { id } = req.params
    try {
        const [product] = await sequelize.query(
            'SELECT * FROM Productos Where idProductos = :id',
            { replacements: { id }, type: sequelize.QueryTypes.SELECT }
        )

        if(!product){
            return res.status(404).json({ message: 'El producto no existe o ya ha sido eliminado...'})
        }

        await sequelize.query('EXEC sp_ActivarProducto @idProducto=:id', { replacements: { id }})
        res.json({ message: 'Producto activado exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al activar el producto...', error: error.message})
    }
}