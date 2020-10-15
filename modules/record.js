var express = require('express');
var app = express();
var client = require('./connect');
var bodyParser = require('body-parser');
var session = require('express-session');




app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

module.exports.add = function(req,res)
{
   var number = req.body.number;
   var model  = req.body.model;
   var name = req.body.name;
   var  address = req.body.address;
   var  mobile = req.body.mobile;
   var  date = req.body.date;
client.query('insert into record(number,model,reg_date,owner_name,owner_address,owner_number) values($1, $2, $3, $4, $5, $6)',[number,model,date,name,address,mobile],(err)=>
{
if(!err)
{
    console.log('added successfully');
    res.render('add_vehicle.ejs',{choice : 0});
}
else
{
    console.log(err);
    res.render('add_vehicle.ejs',{choice : 1});
}
});
}

module.exports.edit_initial = function(req,res)
{
    var number = req.body.number;
    client.query('select * from record where number = ($1)',[number],(err,results)=>
    {
       if(!err)
       {
           console.log("retrieved");
           res.render('edit_main',{results:results.rows});
       }
       else
       {
           console.log(err);
           res.redirect('/edit_index');
       }
    });
} 
module.exports.edit_final = function(req,res)
{
    var number = req.body.number;
    var model = req.body.model;
    var date = req.body.date;
    var name = req.body.name;
    var address = req.body.address;
    var mobile = req.body.mobile;
     client.query('update record set model = ($1),reg_date = ($2),owner_name = ($3),owner_address = ($4),owner_number = ($5) where number = ($6)',
     [model,date,name,address,mobile,number],(err)=>
     {
         if(!err)
         {
             console.log('edited ');
             res.redirect('/edit_index');
         }
         else
         {
             console.log(err);
             res.redirect('/edit index');
         }

     });

}