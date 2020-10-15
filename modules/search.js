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


module.exports.by_number = function(req,res)
{
    var number = req.body.number;
    client.query('select * from toll where number = ($1) order by cross_date,cross_time desc',[number],(err,results)=>
    {
        if(!err)
        {
            console.log('select toll operation done');
           toll_results = results.rows;
           client.query('select * from record where number = ($1)',[number],(err,result)=>
           {

            if(!err)
            {
                car_results = result.rows[0];
                 if(toll_results.length == 0)
                 {
                     res.render('result_number.ejs',{car_results:car_results,choice : 0});
                 }
                 else
                 {
                     res.render('result_number.ejs',{toll_results:toll_results,car_results:car_results,choice : 1});
                 }
            }
           });
        }
        else
        {
            console.log(err);
        }
    });

}


module.exports.by_name = function(req,res)
{
    var name = req.body.name;
    var address = req.body.address;
    client.query('select * from record where owner_name = ($1) and owner_address = ($2)',[name,address],(err,results)=>
    {
        if(!err)
        {
            console.log('retrieved');
            if(results.rows.length == 0 )
            {
                res.render('display_vehicles',{choice : 0});
            }
            else
            {
                res.render('display_vehicles',{choice : 1,results:results.rows});
            }

        }
        else
        {
            console.log('error in query');
        }
    });
}


module.exports.date_only = function(req,res)
{
    var id = req.body.toll_id;
    var date = req.body.date;
   
    client.query('select * from toll where toll_id = ($1) and cross_date = ($2)',[id,date],(err,results)=>
    {
        if(!err)
        { 
            if(results.rows.length == 0)
            {
                res.render('result_date_only',{choice : 0});
            }
            else
            {
                var place1 = results.rows[0].v_from;
                var place2 = results.rows[0].v_to; 
    
                client.query('select * from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3) order by cross_time',[id,date,place1],(err,result1)=>
                {  
                    if(!err)
                    {
                        client.query('select * from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3) order by cross_time',[id,date,place2],(err,result2)=>
                        {  

                            client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3) group by vehicle_type',[id,date,place1],(err,result1_1)=>
                        {  
                            
                            client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3) group by vehicle_type',[id,date,place2],(err,result2_1)=>
                            {  
                                
                                if(!err)
                                {
                                    res.render('result_date_only',{result1:result1.rows,result2:result2.rows,choice : 1,result1_1:result1_1.rows,result2_1:result2_1.rows});
                                }
    
                                
                               
                            });
                            
                           
                        });
                           
                        });
                    }
                });
            }

           

        }
        else
        {
            console.log(err);
        }
    });
}


module.exports.two_dates = function(req,res)
{
    var from_date = req.body.from_date;
    var to_date = req.body.to_date;
    var toll_id = req.body.toll_id;
    console.log(from_date);

    client.query('select * from toll where toll_id = ($1) and cross_date >= ($2) and cross_date <= ($3)',[toll_id,from_date,to_date],(err,results)=>
    {
        if(!err)
        { 
            console.log(results);
            if(results.rows.length == 0)
            {
                res.render('result_date_only',{choice : -1});
            }
            else
            {
                var place1 = results.rows[0].v_from;
                var place2 = results.rows[0].v_to;
    
                client.query('select * from toll where toll_id = ($1) and cross_date >= ($2) and cross_date <= ($3) and v_from = ($4) order by cross_time',[toll_id,from_date,to_date,place1],(err,result1)=>
                {
                    if(!err)
                    {
                        client.query('select * from toll where toll_id = ($1) and cross_date >=($2) and cross_date <= ($3) and v_from = ($4) order by cross_time',[toll_id,from_date,to_date,place2],(err,result2)=>
                        {
                            client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date >=($2) and cross_date <= ($3) and v_from = ($4) group by vehicle_type',[toll_id,from_date,to_date,place1],(err,result1_1)=>
                        {  
                            
                            client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date >=($2) and cross_date <= ($3) and v_from = ($4) group by vehicle_type',[toll_id,from_date,to_date,place2],(err,result2_1)=>
                            {  
                                
                                if(!err)
                                {
                                    res.render('result_date_only',{result1:result1.rows,result2:result2.rows,choice : 1,result1_1:result1_1.rows,result2_1:result2_1.rows});
                                }
    
                                
                               
                            });
                            
                           
                        });
                        });
                    }
                    else{
                        console.log(err);
                    }
                });

            }

           

        }
        else
        {
            console.log(err);
        }
    });
}

module.exports.date_with_time = function(req,res)
{
    var toll_id = req.body.toll_id;
    var date = req.body.date;
    var from_time = req.body.from_time;
    var to_time = req.body.to_time;
    client.query('select * from toll where toll_id = ($1) and cross_date = ($2) and cross_time >= ($3) and cross_time <= ($4)',[toll_id,date,from_time,to_time],(err,results)=>
    {
        if(!err)
        { 
            if(results.rows.length == 0)
            {
                res.render('result_date_only',{choice : -2});
            }
            else
            {
                var place1 = results.rows[0].v_from;
                var place2 = results.rows[0].v_to;
    
                client.query('select * from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3) and cross_time >= ($4) and cross_time <= ($5) order by cross_time',[toll_id,date,place1,from_time,to_time],(err,result1)=>
                {
                    if(!err)
                    {
                        client.query('select * from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3) and cross_time >= ($4) and cross_time <= ($5) order by cross_time',[toll_id,date,place2,from_time,to_time],(err,result2)=>
                        {
                            client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3 )and cross_time >= ($4) and cross_time <= ($5) group by vehicle_type',[toll_id,date,place1,from_time,to_time],(err,result1_1)=>
                            {  
                                
                                client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date = ($2) and v_from = ($3 )and cross_time >= ($4) and cross_time <= ($5) group by vehicle_type',[toll_id,date,place2,from_time,to_time],(err,result2_1)=>
                                {  
                                    
                                    if(!err)
                                    {
                                        res.render('result_date_only',{result1:result1.rows,result2:result2.rows,choice : 1,result1_1:result1_1.rows,result2_1:result2_1.rows});
                                    }
        
                                    
                                   
                                });
                                
                               
                            });
                        });
                    }
                });
            }

           

        }
        else
        {
            console.log(err);
        }
    });
    


}




module.exports.two_dates_with_time = function(req,res)
{
    var toll_id = req.body.toll_id;
    var from_date = req.body.from_date;
    var to_date = req.body.to_date;
    var from_time = req.body.from_time;
    var to_time = req.body.to_time;
    client.query('select * from toll where toll_id = ($1) and cross_date >= ($2) and cross_date <= ($3) and cross_time >= ($4) and cross_time <= ($5)',[toll_id,from_date,to_date,from_time,to_time],(err,results)=>
    {
        if(!err)
        { 
            if(results.rows.length == 0)
            {
                res.render('result_date_only',{choice : -2});
            }
            else
            {
                var place1 = results.rows[0].v_from;
                var place2 = results.rows[0].v_to;
    
                client.query('select * from toll where toll_id = ($1) and cross_date >= ($2) and cross_date <= ($3) and v_from = ($4) and cross_time >= ($5) and cross_time <= ($6) order by cross_time',[toll_id,from_date,to_date,place1,from_time,to_time],(err,result1)=>
                {
                    if(!err)
                    {
                        client.query('select * from toll where toll_id = ($1) and cross_date >= ($2) and cross_date <= ($3) and v_from = ($4) and cross_time >= ($5) and cross_time <= ($6) order by cross_time',[toll_id,from_date,to_date,place2,from_time,to_time],(err,result2)=>
                        {
                            client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date >= ($2) and cross_date <= ($3) and v_from = ($4 )and cross_time >= ($5) and cross_time <= ($6) group by vehicle_type',[toll_id,from_date,to_date,place1,from_time,to_time],(err,result1_1)=>
                            {  
                                
                                client.query('select vehicle_type,count(*) from toll where toll_id = ($1) and cross_date >= ($2) and cross_date <= ($3) and v_from = ($4 )and cross_time >= ($5) and cross_time <= ($6) group by vehicle_type',[toll_id,from_date,to_date,place2,from_time,to_time],(err,result2_1)=>
                                {  
                                    
                                    if(!err)
                                    {
                                        res.render('result_date_only',{result1:result1.rows,result2:result2.rows,choice : 1,result1_1:result1_1.rows,result2_1:result2_1.rows});
                                    }
        
                                    
                                   
                                });
                                
                               
                            });
                        });
                    }
                });
            }

           

        }
        else
        {
            console.log(err);
        }
    });
    


}



module.exports.city_date = function(req,res)
{
    var name = req.body.name;
    var date = req.body.date;
    var n = 0;
    client.query('select v_from,count(*) from toll where v_to = ($1) and cross_date = ($2) group by v_from',[name,date],(err,result1)=>
    {    
        if(result1.rows.length == 0)
        {
            n = 1;
        }
        console.log(result1.rows);
        console.log(result1.rows.length);
    
        client.query('select v_to,count(*) from toll where v_from = ($1) and cross_date = ($2) group by v_to',[name,date],(err,result2)=>
        {  
           
            console.log(result2.rows);
            if(result2.rows.length == 0)
            {
                if(n==1)
                {
                    res.render('result_city',{choice :0,name:name,date:date})
                }
                else
                {
                    res.render('result_city',{choice :1,result1:result1.rows,name:name,date:date});
                }
                
            }
            else
            {
                if(n == 1)
                {
                    res.render('result_city',{choice :2,result2:result2.rows,name:name,date:date});   
                }
                else
                {
                    res.render('result_city',{choice :3,result1:result1.rows,result2:result2.rows,name:name,date:date});

                }
                
            }

        });
        
    });
}

module.exports.entire_amount = function(req,res)
{
 var date = req.body.date;
 
 client.query('select sum(fee) from toll where cross_date = ($1)',[date],(err,results)=>
 {   console.log(results);
     if(results.rows.length == 0)
     {
        res.render('display_fee.ejs',{choice:0});
     }
     else
     {
         res.render('display_fee.ejs',{results:results.rows,choice:1,date:date});
     }
     if(err)
     {
         console.log('hiii');
     }
 });
}
module.exports.toll_amount = function(req,res)
{
    var date = req.body.date;
    var toll_id = req.body.toll_id;
    client.query('select sum(fee) from toll where cross_date = ($1) and toll_id = ($2)',[date,toll_id],(err,results)=>
    {

        if(results.rows.length == 0)
        {
           res.render('display_fee.ejs',{choice:0});
        }
        else
        {
            res.render('display_fee.ejs',{results:results.rows,choice:2,date:date,id:toll_id});
        }


    });
}
module.exports.toll_amount_dates = function(req,res)
{
    var from_date = req.body.from_date;
    var to_date = req.body.to_date;
    var toll_id = req.body.toll_id;
    client.query('select sum(fee) from toll where  cross_date >= ($1) and cross_date <= ($2) and toll_id = ($3)',[from_date,to_date,toll_id],(err,results)=>
    {


        if(results.rows.length == 0)
        {
           res.render('display_fee.ejs',{choice:0});
        }
        else
        {
            res.render('display_fee.ejs',{results:results.rows,choice:3,from_date:from_date,to_date:to_date,id:toll_id});
        }
    });
    
}