const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const getDate = require(__dirname + "/date.js");
const ejs = require("ejs");
const _ = require("lodash");
const { urlencoded } = require("body-parser");
mongoose.connect("mongodb://localhost:27017/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
// let tasks=["buy food","cook food","eat food"];
// let workLists=[];
let date = getDate.getDate();
const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "new item1",
});
const item2 = new Item({
  name: "new item2",
});
const item3 = new Item({
  name: "new item3",
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          }
          // else{
          //     console.log("added successfully!");
          // }
        });
        res.redirect("/");
      } else {
        // console.log("already added");

        res.render("index", { listTitle: "Today", newTasks: foundItems });
      }
    }
  });
});
app.get("/:listName", function (req, res) {
  const listName = _.capitalize(req.params.listName);
  List.findOne({ name: listName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + listName);
      } else {
        res.render("index", { listTitle: listName, newTasks: foundList.items });
      }
    }
  });
});

app.post("/", function (req, res) {
  const taskName = req.body.task;
  const listName = req.body.list;
  const item = new Item({
    name: taskName,
  });
  if (listName == "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

  // if(req.body.list==="work"){
  //     workLists.push(taskName);
  //     res.redirect("/work");
  // }else{
  //     tasks.push(taskName);
  //     res.redirect("/");
  // }
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listHeading;
  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId, function (err) {
      if (!err) {
        // console.log("deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});
// app.post("/work",function(req,res){
//     let item = req.body.task;
//     workLists.push(item);
//     res.redirect("/work");
// })

app.listen(process.env.PORT || 3000, function () {
  console.log("running on port");
});
//cement:2500(480per bosta)
//bali:1 gari 200 foot
//vai
//cement
//khaled vai 12000 ar
