import mongoose from "mongoose"

const connectDB = async () => {
    const connection_instance = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`Connection Name: ${connection_instance.connection.name}`)
    console.log(`Connection Host: ${connection_instance.connection.host}`)
}

export { connectDB }