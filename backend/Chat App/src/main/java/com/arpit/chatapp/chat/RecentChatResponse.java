package com.arpit.chatapp.chat;

public class RecentChatResponse {

    public String conversationId;

    public String friendId;
    public String displayName;
    public String profilePhoto;

    public String lastMessage;
    public String lastUpdated;

    public int unreadCount;

    public RecentChatResponse(
            String conversationId,
            String friendId,
            String displayName,
            String profilePhoto,
            String lastMessage,
            String lastUpdated,
            int unreadCount
    ) {
        this.conversationId = conversationId;
        this.friendId = friendId;
        this.displayName = displayName;
        this.profilePhoto = profilePhoto;
        this.lastMessage = lastMessage;
        this.lastUpdated = lastUpdated;
        this.unreadCount = unreadCount;
    }
}
