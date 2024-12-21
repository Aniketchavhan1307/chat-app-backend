package com.chat.app.controllers;

import java.time.LocalDateTime;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.chat.app.entities.Message;
import com.chat.app.entities.Room;
import com.chat.app.playload.MessageRequest;
import com.chat.app.service.RoomService;

@Controller
@CrossOrigin("*")
public class ChatController 
{

	@Autowired
	private RoomService roomService;
	
	// for sending and receiving message
	
	@MessageMapping("/sendMessage/{roomId}")			// /app/sendMessage/roomid
	@SendTo("/topic/rooms/{roomId}")						// here subscribe 
	public Message sendMessage(
			@DestinationVariable String roomId,
				@RequestBody MessageRequest request
			)
	{
	Room room	= roomService.findByRoomId(request.getRoomId());
		
	Message message = new Message();
	message.setContent(request.getContent());
	message.setSender(request.getSender());
	
	message.setTime(LocalDateTime.now());
	
	if(room != null)
	{
		room.getMessages().add(message);
		
		roomService.saveRoom(room);
	}
	else
	{
		throw new RuntimeException("room not found...");
	}
	
	return message;
	}
	
	
	
	//=======================================================================================
	
	@MessageMapping("/typing/{roomId}")
	@SendTo("/topic/rooms/{roomId}")
	public String typing(@DestinationVariable String roomId, @RequestBody String userName) {
	    return userName + " is typing...";
	}

	
	
//	@MessageMapping("/sendTyping/{roomId}") // Endpoint for typing notifications
//	@SendTo("/topic/rooms/{roomId}")
//	public Message sendTypingStatus(
//	        @DestinationVariable String roomId,
//	        @RequestBody MessageRequest request
//	) {
//	    Room room = roomService.findByRoomId(roomId);
//
//	    // Create a new message object to send the typing status
//	    Message message = new Message();
//	    message.setSender(request.getSender());
//	    message.setContent("is typing...");  // Indicating that the user is typing
//	    message.setTime(LocalDateTime.now());
//	    message.setTyping(true);  // Set a flag to indicate typing status
//
//	    // Broadcast the typing status to other users in the room
//	    if (room != null) {
//	        room.getMessages().add(message);  // Optionally, you can add typing status to the messages list
//	        roomService.saveRoom(room);
//	    } else {
//	        throw new RuntimeException("room not found...");
//	    }
//
//	    return message;
//	}

}
