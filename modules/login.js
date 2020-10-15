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


module.exports.login = function(req,res)
{
    var username = req.body.username;
    var password = req.body.password;
    console.log('function called');
    
    if(username && password)
    {
        
        client.query('select * from adminlogin where username = ($1) and password = ($2)',[username,password],(err,results)=>
        {
            console.log(results);
            if(results.rows.length != 0)
            {
            if(results)
            { 
                req.session.loggedin = true;
                req.session.username = results.rows[0].username;
                  if(results.rows[0].category == 'toll')
                  {
                    res.redirect('/home/toll');
                }

                else if(results.rows[0].category == 'black')
                {
                  res.redirect('/home/black');
              }

              else if(results.rows[0].category == 'investigate')
              {
                res.redirect('/home/investigate');
            }
            else if(results.rows[0].category == 'admin')
            {

              res.redirect('/home/admin');
          }
                
                
            }
            else
            {
                res.redirect('/');
            }
        }
        else
        {
            res.redirect('/');
        }
            
        });
    }
    else 
    {
        res.redirect('/');
    }

}

module.exports.delete = function(req,res)
{
var username = req.params.name;
client.query('delete from adminlogin where username = ($1)',[username],(err)=>{

    if(!err)
    {
       
        console.log('deleted succesfully');
        res.redirect('/home/admin');
    }
    else
    {
        console.log('error in delete query');
    }
});
}



module.exports.edit = function(req,res)
{
    var username = req.params.name;
    client.query('select * from adminlogin where username = ($1)',[username],(err,results)=>{

        if(!err)
        {
            
            res.render('loginedit',{results:results.rows});
        }
        else
        {
            console.log('error in edit query');
            res.redirect('admin');

        }
    });
   
}


module.exports.finaledit = function(req,res)
{
    var fname = req.body.firstname;
    var lname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var mobile = req.body.mobile;
    var cat = req.body.category;
    var username = req.params.name;

    client.query('update adminlogin set firstname = ($1),lastname = ($2),email = ($3),password = ($4),mobilenumber = ($5),category = ($6) where username = ($7)',
    [fname,lname,email,password,mobile,cat,username],(err)=>
    {
        if(!err)
        {
            console.log('edited succesfully');
            res.redirect('/home/admin');
        }
        else
        {
            console.log('error in query');
            res.redirect('/home/admin');
            
        }
    });
}

module.exports.add = function(req,res)
{
    var fname = req.body.firstname;
    var lname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var mobile = req.body.mobile;
    var cat = req.body.category;
    var username = req.body.username;
    var toll = req.body.toll;

    client.query('insert into adminlogin(username,firstname,lastname,email,password,category,mobilenumber,toll_name) values($1, $2, $3, $4, $5, $6, $7, $8)',[username,fname,lname,email,password,cat,mobile,toll],(err)=>
    {
        if(!err)
        {
            console.log('added successfully');
            res.redirect('/home/admin');
            
           
        }
        else
        {
            console.log('error in query');
            console.log(err);
            res.redirect('/add');
        }
    });

}

module.exports.add_plaza = function(req,res)
{
    var name = req.body.plaza_name;
    var p1 = req.body.place1;
    var p2 = req.body.place2;
    client.query('insert into plaza (p_name,place1,place2) values($1, $2, $3)',[name,p1,p2],(err)=>
    {
        if(!err)
        {
            console.log('plaza inserted');
            res.redirect('/home/admin');
        }
        else
        {
            console.log(err);
        }

    });
}

module.exports.remove_plaza = function(req,res)
{
    var id = req.body.id;
    var name = req.body.name;
   
        client.query('delete from plaza where p_id = ($1) or p_name = ($2)',[id,name],(err)=>
        {
            if(!err)
            {
                console.log('plaza removed');
                res.redirect('/home/admin');
            }
            else 
            {
              console.log(err);
            }
        });
   
}
