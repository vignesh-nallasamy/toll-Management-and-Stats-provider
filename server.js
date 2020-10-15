var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var session = require('express-session');
var path = require('path');
var client = require('./modules/connect');
var enter = require('./modules/login');
var record = require('./modules/record');
var blacklist = require('./modules/blacklist');
var toll = require('./modules/toll');
var search = require('./modules/search');

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.listen(5000,(err)=>
{
    if(!err)
    {
        console.log('server running');
    }
});
app.get('/',(req,res)=>
{
    res.render('index');
});

app.post('/login',enter.login);
app.get('/home/toll',(req,res)=>
{
    
 if (req.session.loggedin) {
        
    res.render('tollhome');

}

else 
{ 
res.redirect('/');
}

});
app.get('/home/investigate',(req,res)=>
{
    if (req.session.loggedin) {
        
        res.render('investhome');
    
    }
    
    else 
    { 
    res.redirect
    }
});

app.get('/home/black',(req,res)=>
{
    if (req.session.loggedin) {
        
        res.render('blackhome',{choice :-1 });
    
    }
    
    else 
    { 
    res.redirect
    }
});
app.get('/home/admin',(req,res)=>
{
    if (req.session.loggedin) {
        client.query('select * from adminlogin where username != ($1) ',[req.session.username],(err,results)=>
        {
            if(!err)
            {
            
            
                
                res.render('admin',{name:req.session.username,results:results.rows,number:1});
            }
            else
            {
                console.log('error in query');
            }

        });
        
        
    
    }

    
    else 
    { 
    res.redirect('/');
    }
});

app.get('/delete/:name',enter.delete);

app.get('/edit/:name',enter.edit);

app.post('/finaledit/:name',enter.finaledit);

app.get('/add',(req,res)=>{
    if(req.session.loggedin)
{
    res.render('addmember.ejs');
}
   
else
{
    res.redirect('/');
}
    
    

});
app.post('/addnow',enter.add);
app.get('/logout',(req,res)=>
{
    res.redirect('/');
});

app.get('/edit_index',(req,res)=>
{

    res.render('edit_index');
});

app.get('/add_vehicle',(req,res)=>
{
    
    res.render('add_vehicle',{choice : -5});
});
app.post('/add_record',record.add);
app.get('/rto',(req,res)=>
{
if(req.session.loggedin)
{
    res.render('vehicle_record');
}
else
{
    res.redirect('/');
}
});
app.post('/vehicle_send_page',record.edit_initial);
app.post('/vehicle_info_get',record.edit_final);
app.get('/blacklist_add',(req,res)=>
{
if(req.session.loggedin)
{
    res.render('blackhome',{choice : -2});
}
else
{
    res.redirect('/');
}
});
app.post('/fun_blacklist_add',blacklist.add);
app.get('/fun_blacklist_add_all/:name/:address/:id',blacklist.add_all);

app.get('/blacklist_remove',(req,res)=>
{
if(req.session.loggedin)
{
    res.render('blackhome',{choice : -5});
}
else
{
    res.redirect('/');
}
});

app.post('/fun_blacklist_remove',blacklist.remove);
app.get('/fun_blacklist_remove_all/:name/:address/:id',blacklist.remove_all);

app.get('/add_plaza',(req,res)=>
{
  res.render('plaza_add',{choice : "add"});
});
app.post('/fun_add_plaza',enter.add_plaza);

app.get('/remove_plaza',(req,res)=>
{
  res.render('plaza_add',{choice : "del"});
});
app.post('/fun_remove_plaza',enter.remove_plaza);



app.post('/fun_to_show_toll',toll.show_toll);
app.post('/enter_toll/:id',toll.enter_toll);
app.get('/vandi',(req,res)=>
{
res.render('vandi.ejs');
});
app.post('/search_by_number',search.by_number);
app.post('/search_by_name',search.by_name);



app.get('/stats',(req,res)=>
{
res.render('stats.ejs');
});

app.post('/date_only',search.date_only);
app.post('/two_dates',search.two_dates);
app.post('/date_with_time',search.date_with_time);
app.post('/two_dates_with_time',search.two_dates_with_time);
app.post('/city_date',search.city_date);


app.get('/fee',(req,res)=>
{
res.render('fee.ejs');
});

app.post('/entire_amount',search.entire_amount);
app.post('/toll_amount',search.toll_amount);
app.post('/toll_amount_dates',search.toll_amount_dates);



