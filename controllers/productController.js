import sequelize from "../config/dbConfig.js"

export const getAllProducts = async (req, res) => {
    try{
        const [results] = await sequelize.query('SELECT * FROM Productos')
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos', error})
    }
}

export const createProduct = async (req, res) => {
    const { idCategoriaProducto, idMarcaProducto, idPresentacionProducto, idUnidadDeMedidaProducto, nombreProducto, descripcionProducto, codigoProducto, stockProducto, precioProducto, imagenProducto } = req.body
    try {
        await sequelize.query('EXEC sp_AgregarProducto @idCategoriaProducto=:idCategoriaProducto, @idMarcaProducto=:idMarcaProducto, @idPresentacionProducto=:idPresentacionProducto, @idUnidadDeMedidaProducto=:idUnidadDeMedidaProducto, @nombreProducto=:nombreProducto, @descripcionProducto=:descripcionProducto, @codigoProducto=:codigoProducto, @stockProducto=:stockProducto, @precioProducto=:precioProducto, @imagenProducto=:imagenProducto',
            {
                replacements: { idCategoriaProducto,
                                idMarcaProducto,
                                idPresentacionProducto,
                                idUnidadDeMedidaProducto,
                                nombreProducto,
                                descripcionProducto,
                                codigoProducto,
                                stockProducto,
                                precioProducto,
                                imagenProducto
                }
            })
            res.json({ message: 'Producto creado con exito!! '})
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto...', error})
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params
    const { idProducto, idCategoriaProducto, idMarcaProducto, idPresentacionProducto, idUnidadDeMedidaProducto, nombreProducto, descripcionProducto, codigoProducto, stockProducto, precioProducto, imagenProducto } = req.body

    try {
        await sequelize.query(`EXEC sp_ActualizarProducto
                                @idProducto:id 
                                @idCategoriaProducto=:idCategoriaProducto, 
                                @idMarcaProducto=:idMarcaProducto, 
                                @idPresentacionProducto=:idPresentacionProducto, 
                                @idUnidadDeMedidaProducto=:idUnidadDeMedidaProducto, 
                                @nombreProducto=:nombreProducto, 
                                @descripcionProducto=:descripcionProducto
                                @codigoProducto=:codigoProducto, 
                                @stockProducto=:stockProducto, 
                                @precioProducto=:precioProducto, 
                                @imagenProducto=:imagenProducto`,
        {
            replacements: {
                id,
                idCategoriaProducto,
                idPresentacionProducto,
                idMarcaProducto,
                nombreProducto,
                idUnidadDeMedidaProducto,
                codigoProducto,
                descripcionProducto,
                precioProducto,
                stockProducto,
                imagenProducto
            }
        })
        res.json({ message: 'Producto actualizado con exito!!!'})
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto...', error})
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        await sequelize.query('DELETE FROM Products WHERE idProductos = :id', { replacements: { id }})
        res.json({ message: 'Producto eliminado exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto...', error})
    }
}