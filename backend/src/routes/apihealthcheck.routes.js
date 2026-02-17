import {Router} from "express"
import { apiHealthCheck } from "../controllers/apihealthcheck.controller.js"

const healthRouter = Router()

healthRouter.route("/").get(apiHealthCheck)

export { healthRouter }