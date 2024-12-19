package com.chat.app.entities;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Document(collection = "rooms")					// saving data in database mongodb
public class Room
{
	@Id
	private String id;			// mongo db : unique identifier		
	private String roomId;
	
	
	private List<Message> messages = new ArrayList<>();
	
}
