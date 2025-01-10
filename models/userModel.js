import { z } from 'zod'

export const userSchema = z.object({
    nombre_completo: z.string({message: 'El nombre debe de ser una cadena de texto'}),
    correo_electronico: z.string({
        required_error: 'El correo electronico es obligatorio...',
        invalid_type_error: 'El correo electronico debe de ser una cadena de texto...'
    }).email({
        required_error: 'El correo electronico es obligatorio',
        invalid_type_error:' El correo electronico debe de cumplir con el formato usuario@dominio.com'
    }),
    contrasenia: z.string({
        required_error: 'La contrasenia es obligatoria...',
        invalid_type_error: 'La contrasenia debe de ser una cadena de texto...'
    }).min(8, {
        message: 'La contrasenia debe de tener almenos 8 caracteres...'
    }),
    telefono: z.string({
        required_error: 'El numero de telefono es obligatorio...',
        invalid_type_error: 'El numero de telefono debe de ser una cadena de texto'
    }).length(8, {
        invalid_type_error: 'El numero de telefono debe de contener 8 digitos...'
    }).trim(),
    fecha_nacimiento: z.string({
        required_error: 'La fecha de nacimiento es obligatoria...',
        invalid_type_error: 'Error en el tipo de datos enviados se especha formato Fecha'
    }).max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Debes tener almenos 18 años para registrarte').transform((value) => (value ? new Date(value) : null))
})

export const updateUserSchema = userSchema.partial({
    fecha_nacimiento: true
})

export const updatePasswordSchema = z.object({
    contrasenia: z.string({
        required_error: 'La contrasenia es obligatoria...',
        invalid_type_error: 'La contrasenia debe de ser una cadena de texto...'
    }).min(8, {
        message: 'La contrasenia debe de tener almenos 8 caracteres...'
    })
})