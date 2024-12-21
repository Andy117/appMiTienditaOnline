import { z } from 'zod'

export const categorySchema = z.object({
    nombre_categoria: z.string({message: 'La categoria debe de ser una cadena de texto'}).min(3).max(50)
})

export const updateCategorySchema = categorySchema