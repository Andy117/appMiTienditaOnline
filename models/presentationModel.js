import { z } from 'zod'

export const presentationSchema = z.object({
    nombre_presentacion: z.string(
        {
            required_error: "Se debe de enviar el nombre de la presentacion...",
            invalid_type_error: "El nombre de la presentacion debe de ser una cadena de texto"
        }
    ).min(3).max(50)
})

export const updatePresentationSchema = presentationSchema