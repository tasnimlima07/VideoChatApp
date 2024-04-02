const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send('server is running.');
});


io.on('connection', socket => {
    socket.emit('me', socket.io);
    // When someone attempts to join the room
    socket.on('disconnect', () => {
        socket.broadcast.emit('callended');
    });

    socket.on("calluser", ({ userToCall, singnalData, from, name}) => {
        io.to(userToCall).emit("calluser", {singnal: singnalData, from, name});
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callacepted", data.singnal);
    });
        
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
