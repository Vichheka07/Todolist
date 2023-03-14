const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items= [];
let workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('publgiic'));
app.set('view engine', 'ejs');

app.get("/", function(req, res){

    var today = new Date();
    var options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    let day=today.toLocaleDateString("en-US", options);
    res.render("list", {listTitle: day, newListItem: items});
    
});
app.post("/", function(req, res){
    let item = req.body.newItem;
    if(req.body.list === "push"){
        items.push(item);
        res.redirect("/");
    }else if(req.body.list === "work"){
        res.redirect("/work");
    } else {
        items.pop();
        res.redirect("/");
    }
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItem: workItems});
});

app.listen(3000, function(){
    console.log("Sever started on port 3000");
});
