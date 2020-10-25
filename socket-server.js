var socketio = require('socket.io')
var ot = require('ot')

var roomList =  {};

module.exports = function(server){
    var str = "This is a Markdown heading \n\n" + 'var i = i + i';

    var io = socketio(server);
    io.on('connection', function (socket) {
        socket.on('joinRoom', function(data){

            if(!roomList[data.room]){
                var socketIOserver = new ot.EditorSocketIOServer(str,[], data.room, function(socket,cb){
                var self = this;
                console.log(this)
                Task.findByIdAndUpdate(data.room, {content:self.document},function(err,task){
                    if(err) return cb(false)
                    cb(true)
                    console.log(task)
                })
                })
                roomList[data.room] =  socketIOserver;
            }

            roomList[data.room].addClient(socket);
            roomList[data.room].setName(socket,data.username)
            console.log("roomlist",roomList)
            socket.room = data.room
            socket.join(data.room);
            console.log(roomList[data.room])
            console.log(roomList[data.room].setName(socket,data.username))
            
            
          
        })
        socket.on('chatMessage',function(data){
            io.to(socket.room).emit('chatMessage', data);
        });

        socket.on('disconnect', function(){
            socket.leave(socket.room)
           
        })
        
    })
}




// module.exports = function(server){
//     var io = socketio(server);
//     io.on('connection', function (socket) {
//         socket.on('joinRoom', function(data){
//             socket.room = data.room
//             socket.join(data.room);
//         })
//         socket.on('chatMessage',function(data){
//             io.emit('chatMessage', data);
//         })
        
//     })
// }