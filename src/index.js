const express = require("express");
require("./db/mongoose");
const User = require("./models/user");

const app = express();
app.use(express.json());


app.post("/users",(req,res)=>{
  const user = new User(req.body)

  user.save().then(result=>{
    res.status(201).json(result)
  }).catch(error => res.status(400).json(error))
})



app.listen(5000, () => {
  console.log("server started at port 5000");
});
