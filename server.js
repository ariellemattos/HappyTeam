const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const express = require('express');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Pasta 
app.use(express.static(path.join(__dirname, 'public')));

const  botName = "Happy Teams";

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room)

        // Mensagem de boas vindas
        socket.emit('message', formatMessage(botName, "Bem vindo ao Happy Teams"));

        //Broadcast quando um usuario conectar 
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} entrou no chat`));
      
         // Informações de usuarios e sala
         io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });   
    });

    // Listen ChatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
  
    // Rodar quando um usuario desconectar
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} deixou o chat`));
            
            // Informações de usuarios e sala
            io.to(user.room).emit('roomUser', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
 
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))