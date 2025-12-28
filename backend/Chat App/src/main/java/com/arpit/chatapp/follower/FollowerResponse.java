package com.arpit.chatapp.follower;

public class FollowerResponse {

    public String userId;
    public String displayName;
    public String email;
    public String profilePhoto;

    public FollowerResponse(
            String userId,
            String displayName,
            String email,
            String profilePhoto
    ) {
        this.userId = userId;
        this.displayName = displayName;
        this.email = email;
        this.profilePhoto = profilePhoto;
    }
}
