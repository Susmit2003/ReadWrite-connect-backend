import mongoose from "mongoose";
import { type } from "os";

const ArticleSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true
    },

    overview: String,
    description:String,
    conclusion: String,
    type:String,
    time: String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AuthorModel'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AuthorModel'
        }
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthorModel'
    
    },
    authorName:String,
    videoUrl: String,


},{timeStamp:true})


const ArticleModel = mongoose.model("ArticleMdoel", ArticleSchema);

export default ArticleModel