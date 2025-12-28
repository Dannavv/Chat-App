package com.arpit.chatapp.dashboard;

public class DashboardResponse {

    public String userId;
    public String displayName;
    public String email;
    public String profilePhoto;
    public String bio;

    public long totalChats;
    public long totalMessages;
    public long totalFollowers;
    public long totalFollowing;
    public long unreadChats;
    public long unreadMessages;

    // ✅ DEFAULT CONSTRUCTOR (IMPORTANT FOR JACKSON)
    public DashboardResponse() {
        this.userId = "";
        this.displayName = "";
        this.email = "";
        this.profilePhoto = "";
        this.bio = "";
        this.totalChats = 0;
        this.totalMessages = 0;
        this.totalFollowers = 0;
        this.totalFollowing = 0;
        this.unreadChats = 0;
        this.unreadMessages = 0;
    }

    // ✅ SAFE CONSTRUCTOR
    public DashboardResponse(
            String userId,
            String displayName,
            String email,
            String profilePhoto,
            String bio,
            long totalChats,
            long totalMessages,
            long totalFollowers,
            long totalFollowing,
            long unreadChats,
            long unreadMessages
    ) {
        this.userId = safe(userId);
        this.displayName = safe(displayName);
        this.email = safe(email);
        this.profilePhoto = safe(profilePhoto);
        this.bio = safe(bio);
        this.totalChats = totalChats;
        this.totalMessages = totalMessages;
        this.totalFollowers = totalFollowers;
        this.totalFollowing = totalFollowing;
        this.unreadChats = unreadChats;
        this.unreadMessages = unreadMessages;
    }

    // ✅ NULL GUARD
    private String safe(String value) {
        return value == null ? "" : value;
    }
}
