import express from 'express'
import ArticleModel from '../models/articlemodel.js'
import CommentModel from '../models/commentModel.js';
import authorModel from '../models/usermodel.js';
import upload  from '../multer/index.js';

const router = express.Router()



router.post("/article",upload.single('article_image'),function(req,res){


    const image=req.body.image
   const title=req.body.title;
   const over=req.body.over;
   const des=req.body.des;
   const con=req.body.con;
   const videoUrl = req.body.videoUrl;
    const id = req.body.id;
    const type=req.body.type;
    const like=req.body.like;
    const authorName=req.body.authorName;



   const article = new ArticleModel({
    image:image,
    title: title, 
    overview: over,
    description:des,
    conclusion: con,
    type:type,
    videoUrl: videoUrl,
    like:like,
    authorName:authorName,
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
router.put('/updateArticle/:id',(req,res)=>{

 const id = req.params.id;

    
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
    res.status(404).send(err)
})

})
router.get('/readallarticle',async (req,res)=>{

    ArticleModel.find()
    .then((All_article)=> {
       
         res.status(202).json({ data:All_article
        })
    })

    .catch(err=>console.log(err))
});

router.get('/readrecentarticle',async (req,res)=>{
 
       const data = await ArticleModel.find().sort({time:-1}).limit(8);
    
        return res.json({data:data})
       
});
router.get('/sportsarticle',async (req,res)=>{
    
       const data = await ArticleModel.find({"type":"spo"}).populate('author').sort({time:-1}).limit(8)
    
        return res.json({data:data})
       
});
router.get('/sportsarticleRight',async (req,res)=>{
    
    const data = await ArticleModel.find({"type":"spo"}).sort({time:-1}).limit(1)

     return res.json({single:data})
    
});

router.get('/polarticle',async (req,res)=>{

       const data = await ArticleModel.find({"type":"pol"}).sort({time:-1}).limit(8)
        console.log(data.length)
        return res.json({data:data})
      
});

router.get('/eduarticle',async (req,res)=>{
 
       const data = await ArticleModel.find({"type":"edu"}).sort({time:-1}).limit(8)
        console.log(data.length)
        return res.json({data:data})
    
});

router.get('/lastTwoArticles',async (req,res)=>{
 
    const data = await ArticleModel.find().sort().limit(20)
    console.log(data.length)
    return res.json({data:data})
 
});



router.get('/get_singlearticle/:id',async (req, res) => {
  const id =req.params.id;
    ArticleModel.find({"_id": id})
    .then((data) => {
        res.send(data) 

        
    })
    .catch(err => console.log(err))
})

// app.patch('/addlike/:id',async (req, res) => {
//     console.log("&*&*&")
//     const id =req.params.id;
    
//     console.log(id)

//     ArticleModel.findByIdAndUpdate(id, {like:like+1})
//       .then((data) => {
//           res.send(data) 
  
          
//       })
//       .catch(err => console.log(err))
//   })

router.patch('/addlike/:id', async (req, res) => {
    const article_id = req.params.id;

    const {userId} = req.body;

    console.log(req.body)
    
    console.log(userId + "ok")

    try {
        const like=await ArticleModel.findByIdAndUpdate(article_id, {$addToSet: {likes: userId}})

        res.status(201).json({like});
    } catch (error) {
        res.status(500).json({error})
    }
});












router.patch('/adddislike/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const article = await ArticleModel.findById(id);
        if (!article) return res.status(404).json({ error: "Article not found" });

        article.dislike = (article.dislike || 0) + 1;
        const updatedArticle = await article.save();

        res.status(200).json(updatedArticle);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});








router.get('/getArticleByAuthor/:id',(req,res)=>{
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

router.get('/getAllArticleByAuthorForUser/:id',(req,res)=>{
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


router.get('/allSportsArticles',async (req,res)=>{
    const data = await ArticleModel.find({"type":"spo"})
     console.log(data.length)
     return res.json({data:data})
});

router.get('/allpolarticle',async (req,res)=>{
       const data = await ArticleModel.find({"type":"pol"})
        console.log(data.length)
        return res.json({data:data})
});
router.get('/alleducational',async (req,res)=>{
    const data = await ArticleModel.find({"type":"edu"})
     console.log(data.length)
     return res.json({data:data})
});

// router.post('/addComment', async (req, res) => {
//     const { articleId, userId, comment} = req.body;
//     console.log(articleId);
//     console.log(comment);
  
//     try {
//       const user = await authorModel.findById(userId);
//       if (!user) {
//         return res.status(404).send('User not found');
//       }
  
//       const newComment = new CommentModel({
//         articleId,
//         userId,
//         userName: authorModel.name, // Assuming the User model has a 'name' field
//         comment
//       });
  
//       const savedComment = await newComment.save();
//       res.status(201).json({ comment: savedComment });
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       res.status(500).send('Server Error');
//     }
//   });
router.post('/addComment', async (req, res) => {
    const { articleId, userId, text,username } = req.body;
   
    
  
    try {
      const newComment = new CommentModel({
        articleId,
        userId,
        text,
        username,
        createdAt: new Date(),
      });
  
      await newComment.save();
  
      // Fetch the full comment with the user's name if necessary
      const savedComment = await CommentModel.findById(newComment._id)
  
      res.status(201).json({ comment: savedComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Get Comments for an Article
  router.get('/getComments/:articleId', async (req, res) => {
    const  articleId  = req.params.articleId;

    
  
    try {
        
      const comments = await CommentModel.find({ articleId }).sort({ createdAt: -1 });
      res.status(200).json({ comments });
    } catch (error) {
      console.error("Error retrieving comments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });







export default router