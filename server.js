const express=  require("express");
const errorHandler=require("./middleware/errorHandler");
const sequelize=require("./config/databaseConnection");

const dotenv=require("dotenv").config();


const app=express();
const port=process.env.PORT||5000;

sequelize.authenticate().then(()=>{
  console.log("connected");
  
}).catch((error)=>{
  console.log("disconnected");
  console.log(error);
});

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);


// sequelize.sync().then(result=>{
// console.log("done")
// }).catch(error=>{
// console.log("error");
// })


app.listen(5000,()=>{
  console.log(port);
})