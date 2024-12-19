package com.chat.app.controllers;

import java.time.LocalDateTime;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import com.chat.app.entities.Message;
import com.chat.app.entities.Room;
import com.chat.app.playload.MessageRequest;
import com.chat.app.service.RoomService;

@Controller
public class ChatController 
{

	@Autowired
	private RoomService roomService;
	
	// for sending and receiving message
	
	@MessageMapping("/sendMessage/{roomId}")			// /app/sendMessage/roomid
	@SendTo("/topic/room/{roomId}")						// here subscribe 
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
}
