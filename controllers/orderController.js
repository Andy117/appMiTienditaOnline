import { z } from 'zod'
import sequelize from '../config/dbConfig.js'
import { orderSchema, updateOrderSchema, updateOrderStatusSchema } from '../models/orderModel.js'

export const getAllOrdersWithDetails = async (req, res) => {
    try {
        const [results] = await sequelize.query('EXEC sp_ObtenerTodasLasOrdenes');

        const ordersMap = new Map();

        results.forEach(row => {
            const {
                OrdenID,
                nombre_completo,
                direccion,
                telefono,
                correo_electronico,
                fecha_entrega,
                total_orden,
                DetalleID,
                ProductoID,
                ProductoNombre,
                ProductoDescripcion,
                ProductoPrecio,
                cantidad,
                subtotal,
                idEstados,
                Estado_De_La_Orden
            } = row;

            if (!ordersMap.has(OrdenID)) {
                ordersMap.set(OrdenID, {
                    OrdenID,
                    idEstados,
                    Estado_De_La_Orden,
                    nombre_completo,
                    direccion,
                    telefono,
                    correo_electronico,
                    fecha_entrega,
                    total_orden,
                    DetallesOrden: []
                });
            }

            ordersMap.get(OrdenID).DetallesOrden.push({
                DetalleID,
                ProductoID,
                ProductoNombre,
                ProductoDescripcion,
                ProductoPrecio,
                cantidad,
                subtotal
            });
        });

        const orders = Array.from(ordersMap.values());

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error('Error al obtener las ordenes con sus detalles:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las órdenes con sus detalles.',
            error: error.message,
        });
    }
};

export const getAllOrdersWithDetailsUsingID = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await sequelize.query('EXEC sp_ObtenerOrdenPorID @idOrden=:id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        );

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'La Orden no existe o ya ha sido eliminada...' });
        }

        const ordersMap = new Map();

        results.forEach(row => {
            const {
                OrdenID,
                nombre_completo,
                direccion,
                telefono,
                correo_electronico,
                fecha_entrega,
                total_orden,
                DetalleID,
                ProductoID,
                ProductoNombre,
                ProductoDescripcion,
                ProductoPrecio,
                cantidad,
                subtotal,
                EstadoID,
                Estado_De_La_Orden
            } = row;

            // Verifica si la orden ya existe en el mapa
            if (!ordersMap.has(OrdenID)) {
                ordersMap.set(OrdenID, {
                    OrdenID,
                    EstadoID,
                    Estado_De_La_Orden,
                    nombre_completo,
                    direccion,
                    telefono,
                    correo_electronico,
                    fecha_entrega,
                    total_orden,
                    DetallesOrden: [] // Inicializa el array de detalles
                });
            }

            // Agrega el detalle a la orden correspondiente
            ordersMap.get(OrdenID).DetallesOrden.push({
                DetalleID,
                ProductoID,
                ProductoNombre,
                ProductoDescripcion,
                ProductoPrecio,
                cantidad,
                subtotal
            });
        });

        const orders = Array.from(ordersMap.values());

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error('Error al obtener las ordenes con sus detalles:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las órdenes con sus detalles.',
            error: error.message,
        });
    }
};


export const createOrder = async (req, res) => {
    try {
        const validatedData = orderSchema.parse(req.body)
        const detallesJSON = JSON.stringify(validatedData.DetallesJSON)

        await sequelize.query(
            'EXEC sp_CrearOrdenConDetalles @usuarios_idUsuario=:usuarios_idUsuarios, @nombreCompleto=:nombreCompleto, @direccionOrden=:direccionOrden, @telefonoOrden=:telefonoOrden, @correoElectronicoOrden=:correoElectronicoOrden, @fechaEntregaOrden=:fechaEntregaOrden, @totalOrden=:totalOrden, @DetallesJSON=:DetallesJSON',
            {
                replacements: {
                    usuarios_idUsuarios: validatedData.usuarios_idUsuarios,
                    nombreCompleto: validatedData.nombreCompleto,
                    direccionOrden: validatedData.direccionOrden,
                    telefonoOrden: validatedData.telefonoOrden,
                    correoElectronicoOrden: validatedData.correoElectronicoOrden,
                    fechaEntregaOrden: validatedData.fechaEntregaOrden,
                    totalOrden: validatedData.totalOrden,
                    DetallesJSON: detallesJSON
                }
            }
        )

        res.json({ message: 'Orden creada con exito!!! '})
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }
        res.status(500).json({ message: 'Hubo un error al crear la orden...', error})
    }
}

export const updateOrder = async(req, res) => {
    const { id } = req.params
    try {
        const[order] = await sequelize.query(
            'SELECT * FROM Orden WHERE idOrden = :id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )

        if(!order){
            return res.status(404).json({ message: 'La orden con ese ID no existe o ya ha sido eliminada' })
        }

        const validatedData = updateOrderSchema.parse(req.body)
        
        await sequelize.query(
            'EXEC sp_ActualizarOrden @idOrden=:id, @nombreCompleto=:nombreCompleto, @direccionOrden=:direccionOrden, @telefonoOrden=:telefonoOrden, @correoElectronicoOrden=:correoElectronicoOrden',
            {
                replacements:{
                    ...validatedData,
                    id
                }
            }
        )
        res.json({ message: 'Datos de la orden actualizados con exito!!!!'})
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors})
        }
        res.status(500).json({ message: 'Hubo un problema al actualizar los datos de la orden: ', error})
    }
}

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params
    try {
        const[order] = await sequelize.query(
            'SELECT * FROM Orden WHERE idOrden = :id',
            {
                replacements: { id }, type: sequelize.QueryTypes.SELECT
            }
        )

        if(!order){
            return res.status(404).json({ message: 'La orden con ese ID no existe o ya ha sido eliminada' })
        }

        const validatedData = updateOrderStatusSchema.parse(req.body)

        await sequelize.query(
            'EXEC sp_ActualizarEstadoOrden @idOrden=:id, @estados_idEstados=:estados_idEstados',
            {
                replacements: {
                    ...validatedData, id
                }
            }
        )

        res.json({ message: 'Estado de la orden actualizado con exito!!!' })
    } catch (error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({ errors: error.errors })
        }

        res.status(500).json({ message: 'Hubo un problema al actualizar el estado de la orden...', error })
    }
}