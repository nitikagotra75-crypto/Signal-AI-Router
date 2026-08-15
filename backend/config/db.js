import mongoose from "mongoose";
import { env }  from "./env.js";

mongoose.set("strictQuery" , true);

export async function connectDB(){
try{
    await mongoose.connect(env.MONGODB_URI);
    console.log("[db] MongoDB connectd");

}catch(error){
    console.error("[db] MongoDB connection falied:" , error.message);
    process.exit(1);
}

mongoose.connection.on("disconnected" , () => {
    console.warn("[db] MongoDB disconnected");
});

mongoose.connection.on("error" , (error) => {
    console.error("[db] MongoDB error:" , error.message);
});


process.on("SIGINT" , async() => {
    await mongoose.connection.close();
    console.log("[db] MongoDB connection closed(SIGINT)");
    process.exit(0);
});
}