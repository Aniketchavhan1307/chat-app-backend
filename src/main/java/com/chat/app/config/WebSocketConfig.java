package com.chat.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@CrossOrigin("*")          //  @CrossOrigin("http://localhost:3000")
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer
{


	@Override
	public void configureMessageBroker(MessageBrokerRegistry config)
	{
		config.enableSimpleBroker("/topic");			// it enable in-memory message broker
		// /topic/messages
		
		config.setApplicationDestinationPrefixes("/app");
		// /app/chat
		// server-side : @MessagingMapping("/chat")
	}

	

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) 
	{
		// this is for connection establishment 
		
		registry.addEndpoint("/chat")
				.setAllowedOrigins("http://localhost:3000")
				.withSockJS();
		
	}
	
	// /chat endpoint per connection apka establish hoga
}
