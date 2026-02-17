import dotenv from "dotenv"
import { connectDB } from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log(`Error in application: ${error}`)
        throw error
    })
    const server = app.listen(PORT, () => {
        console.log(`Server is listening on: http://localhost:${PORT}`)
    })
    server.on("error", (error) => {
        console.error("❌ Server failed to start:", error);
        
        // Provide helpful error messages for common issues
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${process.env.PORT || 3001} is already in use`);
        } else if (error.code === 'EACCES') {
            console.error(`Port ${process.env.PORT || 3001} requires elevated privileges`);
        }
        
        process.exit(1); // Exit with failure
    })
})
.catch((error) => {
    console.log(`Error in application: ${error}`)
    process.exit(1)
})