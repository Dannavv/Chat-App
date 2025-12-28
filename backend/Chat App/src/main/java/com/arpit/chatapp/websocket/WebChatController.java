package com.arpit.chatapp.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebChatController {

    @MessageMapping("/hello")
    @SendTo("/topic/messages")
    public String handleMessage(String message) {
        return "Server receiveded: " + message;
    }
}
