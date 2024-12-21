package com.chat.app.entities;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Message 
{
	private String content;
	private String sender;
	private LocalDateTime time;
	private boolean typing;
	
	public Message(String content, String sender) {
		super();
		this.content = content;
		this.sender = sender;
		this.time = LocalDateTime.now();
	}
	
	
}
