var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });

//APP CONFIG
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title:String,
	author: String,
	imageUrl: String,
	post: String
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

//Home page
app.get("/", function(req, res){
res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req,res){
Blog.find({},function(err, blogItems){
	if(err){
	console.log(err)
	}else{
	res.render("index", {blogs:blogItems});
	}
})
})

//NEW
app.get("/blogs/new", function(req, res){
res.render("new");
})

//CREATE
app.post("/blogs", function(req, res){
/*
Blog.create({
	title:req.body.blogTitle,
        author: req.body.blogAuthor,
        imageUrl: req.body.blogImage,
        post: req.body.blogPost
	},function(err,blogItem){
*/
/* above can be replaced by creating each of the input values as properties of an object in name attribute of input field in views*/
/*sanitizing post inputs */
req.body.blog.post = req.sanitize(req.body.blog.post);
Blog.create(req.body.blog, function(err, blogItem){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
})
})

//SHOW
app.get("/blogs/:id", function(req, res){
Blog.findById(req.params.id, function(err, blogItem){
	if(err){
	console.log(err)
	}else{
	res.render("show", {blog:blogItem});
	}
})
})

//EDIT
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, blogItem){
		if(err){
		console.log(err)
		}else{
		res.render("edit",{blog:blogItem})
		}
})
})

//UPDATE
app.put("/blogs/:id", function(req, res){
/*
Blog.findOneAndUpdate({_id:req.params.id},{ $set:{
	title:req.body.revisedTitle,
        author: req.body.revisedAuthor,
        imageUrl: req.body.revisedImage,
        post: req.body.revisedPost
}}, {new:true}, function(err, blogItem){
*/
/*sanitizing inputs*/
req.body.revisedBlog.post = req.sanitize(req.body.revisedBlog.post);
Blog.findOneAndUpdate({_id:req.params.id},{ $set:req.body.revisedBlog}, {new:true}, function(err, blogItem){
	if(err){
	console.log(err);
	}else{
	console.log(blogItem);
	res.redirect("/blogs/"+req.params.id);
	}
})
})

//DELETE
app.delete("/blogs/:id", function(req,res){
Blog.findByIdAndRemove(req.params.id, function(err){
	if(err){
	console.log(err);
	}else{
	res.redirect("/blogs");
	}
})
})

app.listen(3000, function(){
console.log("The Server is up and running listening on port 3000")});
