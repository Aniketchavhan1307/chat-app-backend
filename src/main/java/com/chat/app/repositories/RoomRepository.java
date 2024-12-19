package com.chat.app.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.chat.app.entities.Room;

@Repository
public interface RoomRepository extends MongoRepository<Room, String>
{
	// get room using room id
	
	Room findByRoomId(String roomId);

}
