package com.arpit.chatapp.chat;

public class MessageResponse {

    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private String timestamp;

    public MessageResponse(
            String id,
            String senderId,
            String receiverId,
            String content,
            String timestamp
    ) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public String getSenderId() {
        return senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public String getContent() {
        return content;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
