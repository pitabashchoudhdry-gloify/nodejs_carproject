const { DataTypes } = require("sequelize");
const sequelize =require("../config/databaseConnection");


const adminUser = sequelize.define('AdminUser', {
    
    id:{
       type:DataTypes.STRING,
       allowNull:false,
       primaryKey:true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    ,
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    active:{
        type:DataTypes.INTEGER,
        allowNull:true,
    }
   
  }, {
    tableName:"adminuser"
  });

  // .sync().then(result=>{
  //   console.log("done ");
  //   }).catch(error=>{
  //   console.log("error");
  //   })
  module.exports=adminUser;