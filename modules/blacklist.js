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
    var crime = req.body.crime;
    var date = req.body.date;
    client.query('insert into blacklist values($1, $2, $3)',[number,crime,date],(err)=>
    {
        if(!err)
        {
            console.log('blacklisted successfully');
            client.query('select * from record where number = ($1)',[number],(err,results)=>
            {
                var name = results.rows[0].owner_name;
                var address = results.rows[0].owner_address;
                client.query('select * from record where owner_name = ($1) and owner_address = ($2) and number != ($3)',[name,address,number],(err,results)=>
                {
                    if(!err)
                    {
                        if(results.rows.length == 0)
                        {
                            res.render('blackhome',{choice : 0});
                        }
                        else 
                        {
                            res.render('blackhome',{ choice: 1 ,results:results.rows,number:number});
                        }
                    }

                }); 




            });


            
        }

        else
        {
            console.log('error in insert query');

        }
    });

}


module.exports.add_all = function(req,res)
{
    var number = req.params.id;
    var name = req.params.name;
    var address = req.params.address;

    client.query('select * from record where owner_name = ($1) and owner_address = ($2) and number != ($3)',[name,address,number],(err,results)=>
    {
        if(!err)
        {
            var results = results.rows;
            var crime = 'N/A'
            var date = new Date();
            results.forEach(function(items)
            {
                client.query('insert into blacklist values($1, $2, $3)',[items.number,crime,date],(err)=>
                {
                    if(!err)
                    {
                        console.log('all entries blacklisted');
                          

                    }
                    else
                    {
                        console.log(err);
                    }
                    
                });

            });
            res.redirect('/home/black');
        }
    });
 


}

module.exports.remove = function(req,res)
{
    var number = req.body.number;
    client.query('delete from blacklist where number = ($1)',[number],(err)=>
    {
        if(!err)
        {
            console.log('removed from blacklist successfully');
            client.query('select * from record where number = ($1)',[number],(err,results)=>
            {
                var name = results.rows[0].owner_name;
                var address = results.rows[0].owner_address;
                client.query('select * from record where owner_name = ($1) and owner_address = ($2) and number != ($3)',[name,address,number],(err,results)=>
                {
                    if(!err)
                    {
                        if(results.rows.length == 0)
                        {
                            res.render('blackhome',{choice : -6 });
                        }
                        else 
                        {
                            res.render('blackhome',{ choice: 7 ,results:results.rows,number:number});
                        }
                    }

                }); 




            });


            
        }

        else
        {
            console.log('error in remove query');

        }
    });

}

module.exports.remove_all = function(req,res)
{
    var number = req.params.id;
    var name = req.params.name;
    var address = req.params.address;

    client.query('select * from record where owner_name = ($1) and owner_address = ($2) and number != ($3)',[name,address,number],(err,results)=>
    {
        if(!err)
        {
            var results = results.rows;
            results.forEach(function(items)
            {
                client.query('delete from blacklist where number = ($1)',[items.number],(err)=>
                {
                    if(!err)
                    {
                        console.log('all entries removed from blacklist');
                          

                    }
                    else
                    {
                        console.log(err);
                    }
                    
                });

            });
            res.redirect('/home/black');
        }
    });
 


}