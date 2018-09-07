const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//init nexmo
const nexmo = new Nexmo({
    apiKey: '58ae63b3',
    apiSecret: '5dOissD83HzUJ709'
} , {debug: true});

//init app
const app = express();

//template engine setup
app.set('view engine' , 'html');
app.engine('html' , ejs.renderFile);

//public folder setup
app.use(express.static(__dirname + '/public'));

//body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//index route
app.get('/' , (req , res) => {
   res.render('index');
});

//catch form submit
app.post('/' , (req , res)=>{
   //res.send(req.body);
   //console.log(req.body);
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        '201285311771' , number , text , {type: 'unicode'},
        (err , responseData) => {
            if(err){
                console.log(err);
            }else{
                console.dir(responseData);
                //get data from response
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }

                //emit to the client
                io.emit('smsStatus' , data);
            }
        }
    );
});

//define port
const port = 3000;

//start server
const server = app.listen(port , () => console.log(`server start on port ${port}`));

//connect to socket.io
const io = socketio(server);
io.on('connection' , (socket) => {
    console.log('connected');
 io.on('disconnect' , (socket) => {
    console.log('disconnected');
 });
});





























