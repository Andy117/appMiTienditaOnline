export const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if(!req.user) return res.status(401).json({ message: 'Acceso denegado, usuario no autenticado...'})

        const userRole = req.user.rol_id

        if(userRole !== requiredRole){
            return res.status(403).json({ message: 'Acceso denegado, no tienes permiso para acceder a esta ruta...'})

        }
        next()
    }
}