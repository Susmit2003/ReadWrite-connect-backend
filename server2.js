const express = require("express");
const https = require("https");
const bodyParser=require("body-parser");
const storage = require('node-persist')
const { default: mongoose } = require("mongoose");
const app = express();
const cores = require('cors');
const { timeStamp } = require("console");

app.use(cores());
app.use(express.static("public"))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
mongoose.connect("mongodb://localhost:27017/todolistDB")

storage.init();

app.use(express.json())



const AuthorSchema = new mongoose.Schema({
    image:String,
    email : String,
    password: String,
    type:String,
    about:String,
    article:[mongoose.Types.ObjectId]
})
const authorModel = mongoose.model("AuthorModel", AuthorSchema);
const ArticleSchema = new mongoose.Schema({
    image:String,
    title: String,
    overview: String,
    description:String,
    conclusion: String,
    type:String,
    time: String,

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authorModel'
    }
},{timeStamp:true})


const ArticleModel = mongoose.model("ArticleMdoel", ArticleSchema);
// const Item=model("Item",iteamsSchema)
app.get("/", function(req, res){
  res.sendFile(__dirname + "/log.html");
});
app.post("/signup",function(req,res){
    console.log("code",req.body);
    const email = req.body.email;
    const password = req.body.password;
    console.log(email)
    console.log(password)
    const author = new authorModel({
        email, password
    })
    author.save()
    .then((data) => {
        res.send(data);
    })
    .catch((err)=> {
        res.send(err)
    })
})

app.get('/article', (req, res) => {
    res.render('article.ejs')
})



app.post("/login", function(req,res){
    console.log("Hello")
    
    const email = req.body.email;
    const password = req.body.password;
    const type=req.body.userType;
    console.log(email)
    console.log(password)
    console.log(type)
    
    authorModel.findOne({email:email})
    .then((data) => {
        if(!data) return res.status(404).json({message: "user not found"})
        console.log(data)
        console.log(data)
        if(data.password === password) {
            storage.setItem("id", data._id)
            .then(() => {
        
                res.json({data,type});
            })
           
            
        }
    })
    .catch((err) => {
        console.log(err)
    })
   
    
})


app.post("/article",function(req,res){
    const image=req.body.image
   const title=req.body.title;
   const over=req.body.over;
   const des=req.body.des;
   const con=req.body.con;
    const id = req.body.id;
    const type=req.body.type;
    console.log(over);
    console.log(des);


   const article = new ArticleModel({
    image:image,
    title: title, 
    overview: over,
    description:des,
    conclusion: con,
    type:type,
    time: new Date().getTime(),
    author: id});
   article.save()
    .then((article_data) => {
        console.log('saved')
        res.status(202).json({data: article_data
        })
    })
    .catch((err) => {
        console.log("erro")
        res.json({error: err})
    })
   
    
})
app.put('/updateArticle/:id',(req,res)=>{

 const id = req.params.id;
 console.log(id)
 
 console.log(typeof(id))
    
const {image,title, over,des,con,type}=req.body;
ArticleModel.findByIdAndUpdate(id, {

    image:image,
    title: title, 
    overview: over,
    description:des,
    conclusion: con,
    type:type,
})
.then((data) => {
    res.status(202).send(data);
})
.catch((err) => {
    console.log(err)
    res.status(404).send(err)
})

})
app.get('/readallarticle',async (req,res)=>{
    ArticleModel.find()
    .then((All_article)=> {
       
         res.status(202).json({ data:All_article
        })
    })

    .catch(err=>console.log(err))
});

app.get('/readrecentarticle',async (req,res)=>{
 
       const data = await ArticleModel.find().sort({time:-1}).limit(8);
        console.log(data.length)
        return res.json({data:data})
       
});
app.get('/sportsarticle',async (req,res)=>{
    
       const data = await ArticleModel.find({"type":"spo"}).sort({timeStamp:-1}).limit(8)
        console.log(data.length)
        return res.json({data:data})
       
});

app.get('/polarticle',async (req,res)=>{

       const data = await ArticleModel.find({"type":"pol"}).sort({timeStamp:-1}).limit(8)
        console.log(data.length)
        return res.json({data:data})
      
});

app.get('/eduarticle',async (req,res)=>{
 
       const data = await ArticleModel.find({"type":"edu"}).sort({timeStamp:-1}).limit(8)
        console.log(data.length)
        return res.json({data:data})
    
});

app.get('/lastTwoArticles',async (req,res)=>{
 
    const data = await ArticleModel.find().sort().limit(2)
     console.log(data.length)
     return res.json({data:data})
 
});



app.get('/get_singlearticle/:id',async (req, res) => {
  const id =req.params.id;
    ArticleModel.find({"_id": id})
    .then((data) => {
        res.send(data) 

        
    })
    .catch(err => console.log(err))
})




app.get('/getArticleByAuthor/:id',(req,res)=>{
    console.log(req.params.id)
    const id=req.params.id;
    console.log('articles hit')
    ArticleModel.find({author:id})
    .then((data)=>{
        console.log(data)
        res.status(200).json(data);
    })
    .catch((err)=>{
        console.log(err)
        res.status(404).json(err);
    })
})

app.get('/allSportsArticles',async (req,res)=>{
    const data = await ArticleModel.find({"type":"spo"})
     console.log(data.length)
     return res.json({data:data})
});

app.get('/allpolarticle',async (req,res)=>{
       const data = await ArticleModel.find({"type":"pol"})
        console.log(data.length)
        return res.json({data:data})
});
app.get('/alleducational',async (req,res)=>{
    const data = await ArticleModel.find({"type":"edu"})
     console.log(data.length)
     return res.json({data:data})
});



app.listen(8000,()=>{
    console.log("server found")
})
