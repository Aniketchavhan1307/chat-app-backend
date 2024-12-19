package com.chat.app.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chat.app.entities.Room;
import com.chat.app.repositories.RoomRepository;
import com.chat.app.service.RoomService;

@Service
public class RoomServiceImp implements RoomService
{
	@Autowired
	private RoomRepository roomRepo;
	
	public Room saveRoom(Room room)
	{
		return roomRepo.save(room);
	}
	
	

	public Room findByRoomId(String id)
	{
		return roomRepo.findByRoomId(id);
	}
	
}
