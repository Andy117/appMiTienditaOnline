import { z } from 'zod'

export const orderSchema = z.object({
    usuarios_idUsuarios: z.number({
        required_error: 'El ID del usuario es obligatorio...',
        invalid_type_error: 'El ID del usuario debe de ser un numero entero...'
    }).int().positive({message: 'el ID del usuario debe de ser un numero positivo'}),
    nombreCompleto: z.string({
        required_error: 'El nombre del usuario es obligatorio...',
        invalid_type_error: 'El nombre del usuario debe de ser una cadena de texto...',
    }).min(1, { message: 'El nombre completo no puede estar vacio...'}),
    direccionOrden: z.string({
        required_error: 'La direccion es obligatoria...',
        invalid_type_error: 'La direccion debe de ser una cadena de texto...'
    }).min(1, { message: 'La direccion no puede estar vacia...'}),
    telefonoOrden: z.string({
        required_error: 'El telefono es obligatorio...',
        invalid_type_error: 'El numero de telefono debe de ser una cadena de texto'
    }).length(8,{ message: 'El numero de telefono debe de contener 8 digitos'}),
    correoElectronicoOrden: z.string({
        required_error: 'El correo electronico es obligatorio...',
        invalid_type_error: 'El correo electronico debe ser una cadena de texto...'
    }).email({ message: 'El correo electronico debe de cumplir con el formato usuario@dominio.com' }),
    fechaEntregaOrden: z.string({
        required_error: 'La fecha de entrega es obligatoria...',
        invalid_type_error: 'La fecha de entrega debe ser una cadena en formato YYYY-MM-DD'
    }).date(),
    totalOrden: z.number({
        required_error: 'El total de la orden es obligatorio...',
        invalid_type_error: 'El total de la orden debe de esr un numero...',
    }).positive({message: 'el total de la orden debe de esr mayor a 0...'}),
    DetallesJSON: z.array(z.object({
        idProducto: z.number({
            required_error: 'El ID del producto es obligatorio...',
            invalid_type_error: 'El ID debe de ser un numero'
        }).int().positive({message: 'El ID debe de ser mayor a 0...'}),
        cantidad: z.number({
            required_error: 'La cantidad de productos es obligatoria...',
            invalid_type_error: 'La cantidad debe de ser un numero...'
        }).int().positive({message: 'La cantidad debe de ser un numero mayor a 0...'}),
        precio: z.number({
            required_error: 'El precio del producto es obligatorio...',
            invalid_type_error: 'El precio del producto debe de ser un numero...'
        }).positive({message: 'El precio debe de ser mayor a 0'})
    })).min(1, {message: 'Debe haber al menos un detalle en la orden...'}),
}).superRefine((data, ctx) => {
    const currentDate = new Date()
    const deliveryDate = new Date(data.fechaEntregaOrden)

    //Validating the date we have to deliver the order !< current date
    if(deliveryDate < currentDate){
        ctx.addIssue({
            path: ['fechaEntregaOrden'],
            message: 'La fecha de entrega no puede ser anterior a la fecha actual...',
        })
    }

    //Validating the totalOrden matches subTotals of the products
    const totalCalculado = data.DetallesJSON.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
    if(totalCalculado !== data.totalOrden){
        ctx.addIssue({
            path: ['totalOrden'],
            message: `El totalOrden (${data.totalOrden}) no coincide con la suma de los productos (${totalCalculado.toFixed(2)}))`
        })
    }
})

export const updateOrderStatusSchema = z.object({
    estados_idEstados: z.union([
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
        z.literal(8),
        z.literal(9),
    ], {
        required_error: "El ID del estado es obligatorio... puede elegir entre: 3 = Pendiente, 4 = Aprobado, 5 = Rechazado, 6 = En proceso, 7 = Enviado, 8 = Entregado, 9 = Cancelado",
        invalid_type_error: "El ID del estado no es válido, puede elegir entre: 3 = Pendiente, 4 = Aprobado, 5 = Rechazado, 6 = En proceso, 7 = Enviado, 8 = Entregado, 9 = Cancelado",
    })
})

export const updateOrderSchema = z.object({
    nombreCompleto: z.string({
        required_error: 'El nombre del usuario es obligatorio...',
        invalid_type_error: 'El nombre del usuario debe de ser una cadena de texto...',
    }).min(1, { message: 'El nombre completo no puede estar vacio...'}),
    direccionOrden: z.string({
        required_error: 'La direccion es obligatoria...',
        invalid_type_error: 'La direccion debe de ser una cadena de texto...'
    }).min(1, { message: 'La direccion no puede estar vacia...'}),
    telefonoOrden: z.string({
        required_error: 'El telefono es obligatorio...',
        invalid_type_error: 'El numero de telefono debe de ser una cadena de texto'
    }).length(8,{ message: 'El numero de telefono debe de contener 8 digitos'}),
    correoElectronicoOrden: z.string({
        required_error: 'El correo electronico es obligatorio...',
        invalid_type_error: 'El correo electronico debe ser una cadena de texto...'
    }).email({ message: 'El correo electronico debe de cumplir con el formato usuario@dominio.com' })
})

