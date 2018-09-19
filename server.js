var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var path = require('path');
app.use(express.static(__dirname+'/public/dist/public'));

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/basic_mongoose'), {useNewUrlParser: true}

var Schema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Title Can Not Be Empty"],
        minlength: [2, "Title Too Short"]
    },
    price: {
        type: Number, 
        required: [true, "Price Can Not Be Empty"],
        min: [10, "Price has to be at least 10 dollars"]
    },
    url: {
        type: String, 
        required: [true, "Url can not be empty"],
    }
    },{timestamps: true})

mongoose.model('product', Schema);
var Nav = mongoose.model('product')

app.get('/all', function(req, res){
    Nav.find({}, function(err, result){
        if(err){
            console.log("Error finding in server", {data: err})
        }
        else{
            res.json({status: true, data: result})
        }
    })
})

app.get('/getOne/:id', function(req, res){
    Nav.find({_id:req.params.id}, function(err, result){
        if(err){
            console.log("Error finding in server")
            res.json({status:false, data: err})
        }
        else{
            res.json({status: true, data: result})
        }
    })
})

app.post('/add', function(req, res){
    console.log("Displaying add req.body",req.body)
    Nav.create(req.body, function(err, result){
        if(err){
            console.log("Adding returned error", err);
            res.json({status: false, data: err.errors})
        }
        else {
            res.json({status: true, data: result})
        }
    })

})

app.put('/edit/:id', function(req,res){
    console.log("Displaying edit req.body",req.body)
    console.log("Displaying edit req.param.id",req.params.id)
    Nav.updateOne({_id: req.params.id}, {$set: {title: req.body.title, price: req.body.price, url: req.body.url}}, {runValidators: true, context:"query"}, function(err){
        console.log ("??")
        if(err){
            console.log("Update Error", err);
            res.json({status:false, data: err.errors})
        }
        else{
            console.log("Updated Successfully")
            res.json({status:true, data: "Update Success"})
        }
    })
})

app.delete('/delete/:id', function(req, res){
    console.log(req.params.id)
    Nav.deleteOne({_id:req.params.id}, function(err, result){
        if(err){
            console.log("Returned error", err);
            res.json({status: false, data: err})
        }
        else {
            res.json({status: true, data: result})
        }
    })
})

app.post('/post', function(req, res){
    console.log(req.body)
    Nav.create(req.body, function(err, nav){
        if(err){
            console.log("Returned error", err);
            res.json({message: "Error", error: err})
        }
        else {
            res.json({message: "Success", data: nav})
        }
    })

})

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
  });

app.listen(8000, function() {
    console.log("listening on port 8000");
})