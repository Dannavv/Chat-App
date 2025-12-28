package com.arpit.chatapp.user;

public class UserListResponse {

    public String userId;
    public String displayName;
    public String email;
    public String profilePhoto;

    public boolean isFollowing;
    public boolean isFollower;

    public UserListResponse(
            String userId,
            String displayName,
            String email,
            String profilePhoto,
            boolean isFollowing,
            boolean isFollower
    ) {
        this.userId = userId;
        this.displayName = displayName;
        this.email = email;
        this.profilePhoto = profilePhoto;
        this.isFollowing = isFollowing;
        this.isFollower = isFollower;
    }
}
