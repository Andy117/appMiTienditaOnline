import express from "express"
import { login } from "../controllers/authController.js"

const routerLogin = express.Router()

routerLogin.post('/login', login)

export default routerLogin