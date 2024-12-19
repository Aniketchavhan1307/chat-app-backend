package com.chat.app.playload;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MessageRequest
{
	private String content;
	private String sender;
	private String roomId;
	

}
