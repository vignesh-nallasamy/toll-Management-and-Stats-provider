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


module.exports.show_toll = function(req,res)
{
var id = req.body.id;
client.query('select * from plaza where p_id = ($1)',[id],(err,results)=>
{
    if(!err)
    {
        console.log('successs');
        res.render('toll_portal',{results:results.rows,choice:1});
        
    }
    else
    {
        console.log('error in this query');
    }
});




}

module.exports.enter_toll = function(req,res)
{
    var plaza_id = req.params.id; // special purpose

    var number = req.body.number;
    var v_from = req.body.v_from;
    var v_to = req.body.v_to;
    var type = req.body.type;
    var fee = req.body.fee;

    client.query('select * from blacklist where number = ($1)',[number],(err,results)=>
    {
        if(!err)
        {
            if(results.rows.length == 0)
            {

    client.query('insert into toll (toll_id,number,v_from,v_to,cross_date,vehicle_type,fee,cross_time) values($1, $2, $3, $4,current_date, $5, $6,localtime(0))',[plaza_id,number,v_from,v_to,type,fee],
    (err)=>
    {
        if(!err)
        {
            console.log('toll inserted');
            client.query('select * from plaza where p_id = ($1)',[plaza_id],(err,results)=>
{
    if(!err)
    {
        console.log('successs');
        res.render('toll_portal',{results:results.rows,choice:1});
        
    }
    else
    {
        console.log('error in this query');
    }
});

        }

        else 
        {
            console.log('error in toll insertion query');
            console.log(err);
            client.query('select * from plaza where p_id = ($1)',[plaza_id],(err,results)=>
{
    if(!err)
    {
        console.log('successs');
        res.render('toll_portal',{results:results.rows,choice:3});
        
    }
    else
    {
        console.log('error in this query');
    }
});
            
        }
    });

            }
            else
            {
                console.log('its a blacklisted vehicle');
                client.query('select * from plaza where p_id = ($1)',[plaza_id],(err,results)=>
{
    if(!err)
    {
        console.log('successs');
        res.render('toll_portal',{results:results.rows,choice:2});
        
    }
    else
    {
        console.log('error in this query');
    }
});

            }
        }
        else
        {
            console.log('error in blacklist query');
        }
    });
    

}