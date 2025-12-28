package com.arpit.chatapp.chat;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/me")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // inside ChatController.java

    @PostMapping("/chats/{conversationId}/read")
    public void markAsRead(
            @PathVariable String conversationId,
            HttpServletRequest request
    ) {
        String userId = (String) request.getAttribute("userId"); // Or however you get current user
        System.out.println("for read" + userId);
        chatService.markMessagesAsRead(conversationId, userId);
    }

    // ✅ SEND MESSAGE
    @PostMapping("/messages")
    public SendMessageResponse sendMessage(
            HttpServletRequest request,
            @RequestBody SendMessageRequest body
    ) {
        String senderId = (String) request.getAttribute("myUserId");

//        System.out.println("SENDER ID = " + senderId);
//        System.out.println("RECEIVER ID = " + body.getReceiverId());
//        System.out.println("CONTENT = " + body.getContent());

        return chatService.sendMessage(
                senderId,
                body.getReceiverId(),
                body.getContent()
        );
    }


    // ✅ GET RECENT CHATS
    @GetMapping("/chats")
    public List<RecentChatResponse> getMyChats(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return chatService.getRecentChats(userId);
    }

    // ✅ GET ALL MESSAGES WITH A FRIEND

    @GetMapping("/messages/{friendUserId}")
    public List<MessageResponse> getMessagesWithFriend(
            @RequestParam String myUserId,
            @PathVariable String friendUserId
    ) {
        System.out.println("SENDER ID = " + myUserId);
        return chatService.getMessagesWithUser(myUserId, friendUserId);
    }


}
