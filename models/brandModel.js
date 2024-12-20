import { z } from 'zod'

export const brandSchema = z.object({
    nombre_marca: z.string(
        {
            required_error: "Se debe de enviar el nombre de la marca...",
            invalid_type_error: "El nombre de la marca debe de ser una cadena de texto"
        }
    ).min(3).max(50)
})

export const updateBrandSchema = brandSchema