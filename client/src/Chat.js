import React, { useEffect, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import emoji from "react-emoji";

function Chat({socket, username, room}){
    const [currentMessage,setCurrentMessage] = useState("");
    const [messageList,setMessageList] = useState([]);
    
    const sendMessage = async () => {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        if (currentMessage!=="") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: strTime,

            };
        
            await socket.emit("send_message", messageData)
            setMessageList((list)=>[...list,messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(()=>{
        socket.on("receive_message",(data)=>{
            setMessageList((list)=>[...list,data]);
        });
    },[socket]);
    return(
        <div className="chat-window">
            <div className="chat-header">
                <p>Room:{room}</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent)=>{
                    return( 
                    <div className="message"
                        id={username===messageContent.author ? "you" : "other" }
                    >
                        <div>
                            <div className="message-content">
                                <p>{emoji.emojify(messageContent.message)}</p>
                            </div>
                            <div className="message-meta">
                                {/* <p id="time">{messageContent.time}</p> */}
                                <small id="time">{messageContent.time}</small>
                                <small id="author">{messageContent.author===username ? "Me" : messageContent.author}</small>
                                {/* <p id="author">{messageContent.author===username ? "Me" : messageContent.author}</p> */}
                            </div>
                        </div>
                    </div>
                    );
                })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text" value={currentMessage} placeholder="Chat" onChange={(event)=>{
        setCurrentMessage(event.target.value);
      }}
        onKeyPress={(event)=>{event.key==="Enter" && sendMessage();
    }}
      />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat