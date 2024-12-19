package com.chat.app.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chat.app.entities.Message;
import com.chat.app.entities.Room;
import com.chat.app.service.RoomService;

@RestController
@RequestMapping("api/v1/rooms")
public class RoomController 
{
	@Autowired
	private RoomService roomService;

	// create room
	
	@PostMapping
	public ResponseEntity<?> createRoom(@RequestBody String roomId)
	{
		if (roomService.findByRoomId(roomId) != null) 
		{
			//if present room is already create 
			
			return ResponseEntity.badRequest().body("Room already exists !");
		}
		
		
		// create room
		Room room = new Room();
		
		
		room.setRoomId(roomId);
		
		Room savedRoom = roomService.saveRoom(room);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(room);
	}
	
	
	
	// find room  : if someone want's to join the room
	
	@GetMapping("/{roomId}")
	public ResponseEntity<?> joinRoom(@PathVariable String roomId)
	{
		 Room room = roomService.findByRoomId(roomId);
		 
		 if (room == null)
		 {
			 return ResponseEntity.badRequest().body("Room not found..");
		}
		 
		 return  ResponseEntity.ok().body(room);
		
	}
	
	
	// get messages of room
	
	@GetMapping("/{roomId}/messages")
	public ResponseEntity<List<Message>> getMessage(
						@PathVariable String roomId,
						@RequestParam(value = "page", defaultValue = "0", required = false) int page,
						@RequestParam(value = "size", defaultValue = "20", required = false) int size
						
			)
	{
		Room room = roomService.findByRoomId(roomId);
		
		 if (room == null)
		 {
			 return ResponseEntity.badRequest().build();
		}
		
		 // get message :
		 //pagination
		 
		 
	List<Message> messages	= room.getMessages();
	
	int start = Math.max(0, messages.size() - (page + 1) * size);

	int end = Math.min(messages.size(), start + size);

	List<Message> paginatedMessages = messages.subList(start, end);

	return ResponseEntity.ok().body(paginatedMessages);

	}
}
