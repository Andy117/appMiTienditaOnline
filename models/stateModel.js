import { z } from 'zod'

export const stateSchema = z.object({
    nombre_estado: z.string(
        {
            required_error: "El nombre del estado es obligatorio...",
            invalid_type_error: "El nombre del estado debe de ser una cadena de texto..."
        }
    ).min(3,
        {
            message: 'La longitud minima es de 3 caracteres...'
        }
    ).max(50,
        {
            message: 'La longitud maxima es de 50 caracteres...'
        }
    )
})

export const updateStateSchema = stateSchema