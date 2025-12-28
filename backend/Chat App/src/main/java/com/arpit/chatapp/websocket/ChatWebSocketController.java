package com.arpit.chatapp.websocket;

import com.arpit.chatapp.chat.ChatService;
import com.arpit.chatapp.chat.SendMessageResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    public ChatWebSocketController(
            SimpMessagingTemplate messagingTemplate,
            ChatService chatService
    ) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    /**
     * Client sends to:
     * /app/chat.send
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message) {

        // 🔥 SAVE MESSAGE USING EXISTING CHAT SERVICE
        SendMessageResponse savedMessage = chatService.sendMessage(
                message.getSenderId(),
                message.getReceiverId(),
                message.getContent()
        );

        System.out.println(savedMessage);

        // 🔥 SEND TO RECEIVER (REAL-TIME)
        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getReceiverId(),
                savedMessage
        );

        // 🔥 SEND BACK TO SENDER
        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getSenderId(),
                savedMessage
        );
    }
}
