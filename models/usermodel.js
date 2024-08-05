import mongoose from "mongoose"



const AuthorSchema = new mongoose.Schema({
    image:String,
    username:String,
    email : String,
    password: String,
    type:String,
    about:String,
    article:[mongoose.Types.ObjectId]
})


const authorModel=mongoose.model("AuthorModel", AuthorSchema);
export default authorModel