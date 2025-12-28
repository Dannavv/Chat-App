package com.arpit.chatapp.follower;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document(collection = "followers")
public class Follower {

    @Id
    private String userId;

    private Set<String> followers;
    private Set<String> following;



    public Follower(String userId) {
        this.userId = userId;
        this.followers = new HashSet<>();
        this.following = new HashSet<>();
    }

    public String getUserId() {
        return userId;
    }

    public Set<String> getFollowers() {
        if (followers == null) followers = new HashSet<>();
        return followers;
    }

    public Set<String> getFollowing() {
        if (following == null) following = new HashSet<>();
        return following;
    }


    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setFollowers(Set<String> followers) {
        this.followers = (followers != null) ? followers : new HashSet<>();
    }

    public void setFollowing(Set<String> following) {
        this.following = (following != null) ? following : new HashSet<>();
    }


}
