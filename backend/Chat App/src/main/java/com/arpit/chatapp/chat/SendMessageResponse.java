package com.arpit.chatapp.chat;

public class SendMessageResponse {

    private String messageId;
    private String conversationId;
    private String senderId;
    private String receiverId;
    private String content;
    private String timestamp;

    public SendMessageResponse(
            String messageId,
            String conversationId,
            String senderId,
            String receiverId,
            String content,
            String timestamp
    ) {
        this.messageId = messageId;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getMessageId() {
        return messageId;
    }

    public String getConversationId() {
        return conversationId;
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
