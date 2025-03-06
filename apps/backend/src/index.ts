import { app } from "./http/server"



app.listen({
     port: 3333,
}).then(() => {
     console.log(`[HTTP] Server Running in Port -3333`)
})