const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://Vichheka:QBNNAOUuTCfFZinw@cluster0.lqsvzki.mongodb.net/todolistDB');

const itemsSchema ={
    name: String
};
const listSchema = {
  name: String,
  items: [itemsSchema]
};
const Item = mongoose.model("Shop", itemsSchema);
const List = mongoose.model("List", listSchema);
app.get("/", function(req, res){
  Item.find()
  .then(function (foundList) {
      res.render("list", {listTitle: "Today", newListItem: foundList});  
  })
  .catch(function (err) {
    console.log(err);
  });
});
app.post("/", function(req, res){
    let itemName = req.body.newItem;
    let listName = req.body.list;
    console.log(itemName);
    const item = new Item({
      name: itemName
    });

    if(listName === "Today"){
      item.save();
      res.redirect("/");
    }else{
      List.findOne({name: listName})
      .then((foundList) =>{
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      })
    }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.lisName;
  console.log(listName);

  if(listName === "Today"){
  Item.findByIdAndRemove(checkedItemId)
  .then((removedDocument) => {
    // Handle success
    console.log('Document removed:', removedDocument);
    res.redirect("/");
  })
  }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
    .then((Itemshow) =>{
      res.redirect("/" + listName);  
    })
  }
});


app.get("/:customListName", function(req, res) {

  const customListName = _.capitalize(req.params.customListName);


  List.findOne({name: customListName})
  .then((foundList) => {
    if (!foundList){
      //Create a new list
      const list = new List({
        name: customListName,
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      //Show an existing list
      res.render("list", {listTitle: foundList.name, newListItem: foundList.items});
    }
  })
  .catch((error) => {
    console.error('w', error);
  })
});
app.listen(3000, function(){
    console.log("Sever started on port 3000");
});