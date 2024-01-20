const express=require('express');
const bodyParser=require('body-parser');
const path=require('path')
const dbUser=require('./routes/dbUser')
const app=express();
app.use(express.static(path.join(__dirname,'public')));
// Parse incoming request bodies with JSON payloads
app.use(bodyParser.json());

// Parse incoming request bodies with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

app.use(dbUser);

app.listen(3000,()=>{
    console.log("server started at port 3000");
})
