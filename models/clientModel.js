import { z } from 'zod'

export const clientSchema = z.object({
    razon_social: z.string(
        {
            required_error: "La razon social es obligatoria...",
            invalid_type_error: "La razon social debe de ser una cadena de texto"
        }
    ).min(5,
        {
            required_error: "La razon social es obligatoria...",
            invalid_type_error: "La razon social debe ser mayor a 5 caracteres"
        }
    ),
    nombre_comercial: z.string(
        {
            required_error: "El nombre comercial es obligatorio...",
            invalid_type_error: "El nombre comercial debe de ser una cadena de texto"
        }
    ).min(5,
        {
            required_error: "El nombre comercial es obligatorio...",
            invalid_type_error: "El nombre comercial debe ser mayor a 5 caracteres"
        }
    ),
    direccion_entrega: z.string(
        {
            required_error: "La direccion de entrega es obligatoria...",
            invalid_type_error: "La direccion debe de ser una cadena de texto"
        }
    ).min(5,
        {
            required_error: "La direccion de entrega es obligatoria...",
            invalid_type_error: "La direccion debe ser mayor a 5 caracteres" 
        }
    ),
    telefono_cliente: z.string(
        {
            required_error: "El numero de telefono es obligatorio.",
            invalid_type_error: "El numero de telefono debe ser de valor numerico" 
        }
    ).length(8,
        {
            required_error: "El numero de telefono es obligatorio.",
            invalid_type_error: "El numero de telefono debe de ser de 8 digitos..." 
        }
    ).trim(),
    email_cliente: z.string().email({message: 'El correo electronico no cumple con: usuario@dominio.com'}),
})

export const updateClientSchema = clientSchema