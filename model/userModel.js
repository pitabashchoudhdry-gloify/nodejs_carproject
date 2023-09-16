const { DataTypes } = require("sequelize");
const sequelize =require("../config/databaseConnection");

const user = sequelize.define('User', {
    
    user_id:{
       type:DataTypes.STRING,
       allowNull:false,
       primaryKey:true,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    ,
    user_email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    
    user_password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
   
  }, {
    tableName:"users"
  });

  // .sync().then(result=>{
  //   console.log("done ");
  //   }).catch(error=>{
  //   console.log("error");
  //   })
  module.exports=user;