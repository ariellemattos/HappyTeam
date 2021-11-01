const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Pegando username e a sala pela URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

//Entrar no sala
socket.emit('joinRoom', {username, room});

//Pegar sala e usuarios
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Mensagem para o Server
socket.on('message', message =>{
    console.log(message)
    outputMessage(message)

    // Descer a pagina 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Mensagem enviada
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    // Pegando mensagem enviada
    const msg = e.target.elements.msg.value;

    // Enviando mensagem para o server
    socket.emit('chatMessage', msg);

    //Limpar caixa de texto
    e.target.elements.msg.value = '';
    e.target.elements.msg.focous();
})


function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div);
}

// Adicionar nome da sala no DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Adicionar usuario no DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
