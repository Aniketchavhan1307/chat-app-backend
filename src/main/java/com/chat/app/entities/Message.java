package com.chat.app.entities;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Message 
{
	private String sender;
	private String content;
	
	private LocalDateTime time;

	
	public Message(String sender, String content) {
		super();
		this.sender = sender;
		this.content = content;
		
		this.time = LocalDateTime.now();
	}
	
	
}
