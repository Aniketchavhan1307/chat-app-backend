import React, { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import { baseURL } from '../config/AxiosHelper';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessages } from '../services/RoomService';
import { timeAgo } from '../config/Helper';



const ChatPage = () => {

    const {
        roomId,
        currentUser,
        connected,
        setConnected,
        setRoomId,
        setCurrentUser,
      } = useChatContext();

    //   console.log(roomId);
    //   console.log(currentUser);
    //   console.log(connected);

            const navigate = useNavigate();
                 useEffect(() => {
                     if (!connected) {
                         navigate("/");
                        }
                  }, [connected, roomId, currentUser]);



    const [messages, setMessages] = useState([]);
    const [inputs, setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

    
    const username = currentUser;

    // page init
    // messages should be fetched from the server

    useEffect(() => {
        async function loadMessages() {
          try {
            const messages = await getMessages(roomId);
            // console.log(messages);
            setMessages(messages);
          } catch (error) {
            toast.error("Failed to load messages");
  
          }
        }
        if (connected) {
          loadMessages();
        }
        // stomp Client
      }, []);


       //scroll down

      useEffect(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scroll({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, [messages]);


    // stompClient should be initialized
    // stompClient should subscribe to the chat room

    useEffect(() => {

        const connectWebSocket = () => {

            // sockJS socket
            const sock = new SockJS(`${baseURL}/chat`);

            const client = Stomp.over(sock);
            
            client.connect({}, () => {
                setStompClient(client);

                toast.success("Connected to the chat room");

                client.subscribe(`/topic/rooms/${roomId}`, (message) => {
                  console.log(message);

                    const newMessage = JSON.parse(message.body);

                      setMessages((prevMessages) => [...prevMessages, newMessage]);
                  

                  });
            });
        };

          if (connected) 
            {
              connectWebSocket();
            }

            

    }, [roomId]);

    // send messages handlers

    const sendMessage = async () => {
        if (stompClient && connected && inputs.trim()) {
          console.log(inputs);
    
          const message = {
            sender: currentUser,
            content: inputs,
            roomId: roomId,
            
          };
    
          stompClient.send(
            `/app/sendMessage/${roomId}`,
            {},
            JSON.stringify(message)
          );
          setInput("");
          
        }
    
      };


     

      function handleLogout() {
        stompClient.disconnect();
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate("/");
        toast.success("Logged out successfully !")
        
      }



  return (
    // you can remove this classname if error in format
    <div className="flex flex-col h-screen ">     
        {/* Header */}
         <header className='flex fixed w-full h-16 dark:border-gray-700 dark:bg-gray-900 shadow py-5 items-center  justify-around overflow-hidden'>
            {/* chat room Name container */}
            <div>
        <h1>Room : <span>{roomId}</span></h1>
            </div>

            {/* chat room User Name */}
            <div>
                <h2>Username : <span>{currentUser}</span></h2>
            </div>

            {/* button leaveRoom */}
            <div>
                <button onClick={handleLogout}
                className="dark:bg-red-500 bg-red-500 text-white px-4 py-2 rounded-full dark:hover:bg-red-800  ">
                  Leave Room
                  </button>
            </div>
         </header>

            {/* Chat Container */}
            <main  ref={chatBoxRef} className="flex-grow py-20 px-10 mx-auto h-screen w-2/3 dark:bg-slate-700 overflow-y-auto">
            
          
          {
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === username ? "justify-end" : "justify-start"}`}>
                      <div  className={`my-2 ${msg.sender === username ? "bg-green-400" : "bg-blue-400" }  p-2 rounded-lg max-w-xs`}
                      style={{
                                wordBreak: "break-word", // Ensure long words wrap onto the next line
                                whiteSpace: "normal",    // Allow text to wrap naturally
                              }}>
                      <div className="flex flex-row gap-2 ">
                      <img src="https://avatar.iran.liara.run/public" className='h-10 w-10 rounded-full object-cover' />
                      <div className="flex flex-col gap-2">

                        <p className="text-sm font-bold">{msg.sender}</p>
                        <p>{msg.content}</p>
                        <p className='text-xs '>{timeAgo(msg.time)}</p>


                        </div>

                      </div>
                        
                    </div>
                  </div>
                ))
            }
         
            
         
            </main>

         
            {/* input Message / Chat Container */}
            <div className="fixed bottom-0 w-full h-16 bg-gray-800">
                {/* Messages */}
            <div className=" h-full  w-2/3 mx-auto flex justify-between items-center gap-2">

        <input
        value={inputs}
        onChange={(e) => setInput(e.target.value) }
         type="text" 
         
         // sending messages by clicking on the enter button
         onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}

         className=" w-full h-full
         dark:bg-gray-900 dark:border-gray-700
          dark:text-white px-4 py-2  focus:outline-none focus:ring-2
         focus:ring-one rounded-full" 
        placeholder="Type your message here"/>  
        
        <div className="flex gap-2">
             {/* Send Button */}
         <button
         onClick={sendMessage}
          className="flex justify-center items-center text-size-25 dark:bg-blue-500 bg-blue-500 text-white px-4 py-2 rounded-full h-12 w-12
                        dark:hover:bg-blue-800">
            
            <MdSend/>
            </button>   

             {/* attachment Button */}
         <button className="flex justify-center items-center text-size-25 dark:bg-blue-500 bg-blue-500 text-white px-4 py-2 rounded-full h-12 w-12
                        dark:hover:bg-blue-800">
            
            <MdAttachFile/>
            </button>   
        </div>
         

            </div>
            </div>

    </div>
  )
}

export default ChatPage