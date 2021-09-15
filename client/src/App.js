import './App.css';
import io from 'socket.io-client';
import {useState} from "react";
import Chat from './Chat';
//https://closed-chat-app.netlify.app

// let socket;
// const socket = io.connect(https://closed-chat-app.herokuapp.com/)
const ENDPOINT = 'https://closed-chat-app.herokuapp.com/';
const socket = io(ENDPOINT)


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  
  
  const joinRoom = () => {
    if (username!=="" && room!=="") {
      socket.emit("join_room",room);
      setShowChat(true);
      
    }
  };
  return (
    <div className="App">
      {!showChat ?(
      <div className="joinChatContainer">
      <h3>Welcome to Private Chat</h3>
      <input type="text" placeholder="Your Username" onChange={(event)=>{
        setUsername(event.target.value);
      }}
      />
      <input type="password" placeholder="Enter Code" onChange={(event)=>{
        setRoom(event.target.value);
      }}/>
      <button onClick = {joinRoom}>Join Chat Room</button>
      </div>
      )
      :(
      <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
