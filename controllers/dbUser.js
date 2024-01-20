const path = require('path');
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const model=require('../models/model');
const { table } = require('console');


exports.getTable=async(req,res)=>{
  const tableName=req.body.table;
  console.log("this is to test wether i am on the right track=",tableName)
  const {cols,data}=await model.getTable(tableName);
  res.json({ success: true, columns: cols, data: data });
}
exports.createTable = (req, res) => { 
  res.sendFile(path.join(__dirname, '../views/index.html')); 
};



exports.deleteData=async(req,res)=>{
  const {id,table}=req.body;
  await model.deleteData(table, id);
}





exports.getAllTables=async(req,res)=>{
  
  const tables=await model.getAllTables();

  res.send(tables)
 
}

exports.addTable = async (req, res) => {
  const data = req.body.userData;
  console.log("table cols=",data)
  const tableName = data['table-name'];
  console.log("table to crate=",tableName)
  
  try {
    const tableName = data['table-name'];
    delete data['table-name']; // Remove the table name from the fields
    
   
    const result=await model.createTable(tableName,data);

    console.log("check whether table created or not ",result)

    if(result!='')
    {
      res.send(result)
    }
    else{
      res.status(500).send({error:result.error})
    }
  
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
};






exports.getData=async(req,res)=>{
  const tableName = req.params.tb;

  try {
    const tableData = await model.getTable(tableName);
    
    
    res.send({ columns: tableData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching columns' });
  }
 }
 exports.insertData = async (req, res) => {
  try {
    const { table, formData } = req.body;
    const vals = formData;
    console.log("table =", table, "data =", vals);

    const insertedData = await model.insertData(table, vals);

    res.send(insertedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};





