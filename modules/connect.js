var {Client} = require('pg'); 



client = new Client({
    user : 'postgres',
    host : 'localhost',
    database : 'toll',
    password : 'qwerty22',
    port : 5432
});
client.connect((err)=>{
    if(!err)
    {
        console.log('database connected');
    }
});

module.exports = client;