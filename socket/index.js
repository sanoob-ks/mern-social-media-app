const { Server } = require("socket.io");

const io = new Server(8000, {
    cors:{
        origin:"http://localhost:3000"
    }
});

let users=[]

const addUser = (userId,socketId) =>{
    !users.some((user)=> user.userId === userId) &&
    users.push({userId,socketId})
}

 const removeUser = (socketId)=>{
    users = users.filter(user=>user.socketId !== socketId)
 }

 const getUser = (receiverId) =>{
    return users.find(user=>user.userId===receiverId) 
 }

io.on("connection", (socket) => {
    //when connect
  console.log("A user connected");
    //take socketId and userId from user after connection
    socket.on("addUser",userId=>{
        addUser(userId,socket.id)
        //send users array to all client
        io.emit("getUsers",users)
    })

    //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user = getUser(receiverId)
        if(user){
            io.to(user.socketId).emit("getMessage",{
                senderId,
                text,
            })
        }else{
            console.log("User not in online")
        }
    })

    //when disconnect
    socket.on("disconnect",()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers",users)
    })

});

