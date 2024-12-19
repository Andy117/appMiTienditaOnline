import { z } from 'zod'

export const productSchema = z.object({
    idCategoriaProducto: z.number().int().positive(),
    idMarcaProducto: z.number().int().positive(),
    idPresentacionProducto: z.number().int().positive(),
    idUnidadDeMedidaProducto: z.number().int().positive(),
    nombreProducto: z.string({message: 'El nombre debe de ser un texto'}).min(3,{message: 'El nombre debe contener almenos 3 caracteres'}),
    descripcionProducto: z.string({message: 'La descripcion debe de ser un texto'}).min(10, {message: '10 caracteres minimo para la descripcion'}).max(300, {message:'300 caracteres maximos para la descripcion'}),
    codigoProducto: z.string(),
    stockProducto: z.number({message: 'El stock debe de ser un numero'}).int().positive().nonnegative({message:'El stock no puede ser negativo'}),
    precioProducto: z.number({message: 'El precio debe de ser un numero'}).positive({message: 'el precio debe de ser un numero positivo'}),
    imagenProducto: z.nullable()
})

export const updateProductSchema = productSchema.partial()