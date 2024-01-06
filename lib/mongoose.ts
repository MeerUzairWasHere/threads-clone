import mongoose from 'mongoose'
let isConnected = false

export const connectToBD = async()=>{
    mongoose.set("strictQuery",true)
    if(!process.env.MONGODB_URL) return console.log("MongoDB url not found!")
    if(isConnected)return console.log("Already conntected to MongoDB")

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log("Conntected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}