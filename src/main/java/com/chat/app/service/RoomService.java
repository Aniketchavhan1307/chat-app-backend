package com.chat.app.service;

import com.chat.app.entities.Room;

public interface RoomService 
{

	 Room findByRoomId(String id);
	 
	 Room saveRoom(Room room);
}
