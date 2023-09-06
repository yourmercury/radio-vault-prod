import mongoose from "mongoose";

export default async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        return true;
    }catch(error){
        return false
    }
}
