package com.arpit.chatapp.user.dto;

import com.arpit.chatapp.user.CurrentWorking;

public class UserSummaryResponse {
    private String userId;
    private String displayName;
    private String profilePhoto;
    private String bio;
    private CurrentWorking currentWorking;
    private boolean isFollowing;

    // Constructor
    public UserSummaryResponse(String userId, String displayName, String profilePhoto,
                               String bio, CurrentWorking currentWorking, boolean isFollowing) {
        this.userId = userId;
        this.displayName = displayName;
        this.profilePhoto = profilePhoto;
        this.bio = bio;
        this.currentWorking = currentWorking;
        this.isFollowing = isFollowing;
    }

    // Getters
    public String getUserId() { return userId; }
    public String getDisplayName() { return displayName; }
    public String getProfilePhoto() { return profilePhoto; }
    public String getBio() { return bio; }
    public CurrentWorking getCurrentWorking() { return currentWorking; }
    public boolean getIsFollowing() { return isFollowing; }
}