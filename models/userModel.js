import { z } from 'zod'

export const userSchema = z.object({
    rol_idRol: z.number().int({
        required_error: "El rol es obligatorio...",
        invalid_type_error: "El rol debe ser 1:Operador, 2:Cliente",
    }).min(1, { message: 'El rol debe ser 1:Operador, 2:Cliente'}).max(2, { message: 'El rol debe ser 1:Operador, 2:Cliente'}),
    Clientes_idClientes: z.number({message:'El id Cliente debe de ser un numero'}).int().positive({message: 'Solo se permiten valores positivos...'}),
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
    fecha_nacimiento: z.string().date({
        required_error: 'La fecha de nacimiento es obligatoria...',
        invalid_type_error: 'La fecha de nacimiento debe de ingresarse en formato fecha YYYY-MM-DD'
    }).max(new Date('2005-01-01'),{
        invalid_type_error: 'La fecha de nacimiento maxima aceptada es: 2005-01-01'
    }).min(new Date('1900-01-01'),{
        invalid_type_error: 'La fecha mas antigua aceptada es: 1900-01-01'
    })
})

export const updateUserSchema = userSchema.partial({
    Clientes_idClientes: true,
    fecha_nacimiento: true
})