import express from "express";
import bodyParser from "body-parser";
import {v4 as uuidv4 } from "uuid"; 
import { render } from "ejs";
import methodOverride from "method-override";
const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})); //This line of code is for handler information from user
//app.use(methodOverride("_method")); //This line of code is to enable method overriding
const posted = [];

app.get("/",(req,res) => {
    res.render("index.ejs" ,{
        posts: posted, // This posts for handle object in that array posted and we use posts to run through the loop for display in ejs ,, connect 1 --
    });
});

app.get("/create",(req,res) =>{
    res.render("create.ejs",{
      posts: posted,
    });
});

app.get("/update/:id",(req,res)=>{
  const postId = req.params.id;
  const post = posted.find(p => p.id == postId);
  if(post){
    res.render("update.ejs",{post: post});
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/submit",(req,res) =>{
      const idUniq = uuidv4();
      const newPost = {
        id: idUniq, // generate a unique ID for each post
        image: req.body["image"],
        title: req.body["title"] ,
        text:req.body["text"],
     };
     posted.push(newPost);
     console.log(posted);
     res.redirect("/"); 
});

app.post("/delete/:id", (req, res) => {
  const postId = req.params.id; // That line of code handle HTTP URL from ID and we take it for the logic
  const postIndex = posted.findIndex(p => p.id === postId); 
  if (postIndex !== -1) {
    posted.splice(postIndex, 1);
  }
  res.redirect("/"); // Redirect back to the index page
})

app.post("/update/:id",(req,res)=>{
   const postId = req.params.id;
   const postIndex = posted.findIndex(p => p.id === postId);
   if (postIndex !== -1) {
      const updatePost = {
        id: postId,
        image:req.body["image"],
        title: req.body["title"],
        text: req.body["text"],
      };
      posted.splice(postIndex,1,updatePost); // this line of code Is replace the old post with the updated one
   } else {
    res.status(404).send("Post not found");
   }
   res.redirect("/");
});

app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
});
