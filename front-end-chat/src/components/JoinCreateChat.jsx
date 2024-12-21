import React, { useState } from 'react'
import chatIcon from '../assets/chat.png';
import toast from 'react-hot-toast';
import { createRoomApi, joinRoomApi} from '../services/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';

const JoinCreateChat = () => {

    const [userDetail, setUserDetail] = useState({
        roomId : "",
        userName : "",
    });


    const {roomId, userName,connected, setRoomId, setCurrentUser, setConnected } = useChatContext();

    const navigate = useNavigate();

    function handleFormInputChange(event) {
        setUserDetail({
            ...userDetail,
            [event.target.name]: event.target.value,
        });
    }

    function validateForm() {
        if(userDetail.roomId === "" || userDetail.userName === "") 
        {
            toast.error("Invalid input !!"); 
            return false ; 
        }  
        return true;
        }
    


 async function joinChat()
    {
        if(validateForm())
        {
                try
                 {
                      // join the chat room
                    const room  = await joinRoomApi(userDetail.roomId );
                    
                    toast.success(userDetail.userName +" joined"); 

                        setCurrentUser(userDetail.userName);
                        setRoomId(room.roomId);
                            setConnected(true);

                            // forward to chat page
                            navigate('/chat');
                    
                } catch (error) 
                {
                    if(error.status == 400)
                        {
                            toast.error("Room does not exist !!");
                        }
                        else
                        {
                            toast.error("please Enter valid roomId !!");
                        }
                }
        }
    }

   async function createRoom()
    {
        if(validateForm())
            {
                console.log(userDetail);

                // call api to create a new room on backend
          
                try{
                        const response = await createRoomApi(userDetail.roomId);
                        console.log(response);
                        toast.success("Room created successfully !!");
                       
                       // join the chat room after creating it or join the existing room
                        setCurrentUser(userDetail.userName);
                        setRoomId(response.roomId);
                       setConnected(true);

                        // forward to chat page
                        navigate('/chat');
                }
                catch(error)
                {
                    console.log(error.message);
                    if(error.status == 400)
                    {
                        toast.error("Room already exists !!");
                    }
                    else
                    {
                        toast.error("Error creating room !!");
                    }

                }
            }
    }

    
  return (
    <div className="min-h-screen flex items-center justify-center">
   
    <div className="p-8 w-full flex flex-col gap-5 max-w-md rounded-lg dark:bg-gray-900 shadow-lg">
          
          <div >
            <img src={chatIcon} className='w-20 mx-auto'/>
          </div>
          
            <h1 className="text-2xl font-semibold text-center ">Join Room / Create Room</h1>
   
   {/* Name Div */}
   <div className="">

    <label htmlFor='name' className="block font-medium"> 
        Your Name 
        </label>
       
        <input onChange={handleFormInputChange}
        value={userDetail.userName}
        type='text' id='name' 
         name='userName'
        placeholder='Enter Your Name'
        className="w-full dark: bg-gray-600 border dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> 
       
        
           </div>

              {/* RoomId Div */}
   <div className="">

    <label htmlFor='roomId' className="block font-medium"> 
        
   Room ID / New Room ID
    </label>
   
    <input 
    onChange={handleFormInputChange}
    value={userDetail.roomId}

    onKeyDown={async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            await joinChat();
        }
    }}
    
    name='roomId'
    placeholder='Enter Room ID'
    type='text' id='roomId' 
    className="w-full dark: bg-gray-600 border dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/> 
    
       </div>

         {/* Button Div */}

         <div className="flex  flex-row gap-2 ">
            <button onClick={joinChat} 
           
            className="w-full bg-blue-500 hover:bg-blue-800 text-white py-2 rounded-lg">
                Join Room
                </button>
            <button onClick={createRoom} className="w-full bg-green-500 hover:bg-green-800 text-white px-3 py-2 rounded-lg">
                Create Room
                </button>

         </div>
   
    </div>
   
    </div>
  )
};

export default JoinCreateChat