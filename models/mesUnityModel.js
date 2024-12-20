import { z } from 'zod'

export const measureSchema = z.object({
    nombre_unidad: z.string(
        {
            required_error: "Se debe de enviar el nombre de la unidad de medida...",
            invalid_type_error: "El nombre de la unidad de medida debe de ser una cadena de texto"
        }
    ).min(3).max(50)
})

export const updateMeasureSchema = measureSchema