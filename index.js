var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on("join", function(name){
        people[socket.id] = name;
        socket.emit("update", "You have connected to the server.");
        io.emit("update", name + " has joined the server.")
        io.emit("update-people", people);
    });
  
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit("update", people[socket.id] + " has left the server.");
        delete people[socket.id];
        io.emit("update-people", people);
    });
    socket.on('send', function(msg){
        io.emit('chat', people[socket.id], msg);
    });
    /*socket.on('user login', function(login){
        people[socket.id] = login;
        io.emit('user login', login);
    });*/
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

