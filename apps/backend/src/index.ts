import { env } from "@saas/env"
import { app } from "./http/server"


app.listen({
     port: env.SERVER_PORT,
}).then(() => {
     console.log(`[HTTP] Server Running in Port -${env.SERVER_PORT}`)
})