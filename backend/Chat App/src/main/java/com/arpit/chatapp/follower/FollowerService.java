package com.arpit.chatapp.follower;

import org.springframework.stereotype.Service;

@Service
public class FollowerService {

    private final FollowerRepository repo;

    public FollowerService(FollowerRepository repo) {
        this.repo = repo;
    }

    private Follower getOrCreate(String userId) {
        return repo.findById(userId)
                .orElseGet(() -> repo.save(new Follower(userId)));
    }

    // ➕ Follow
    public void follow(String myId, String targetId) {

        if (myId.equals(targetId)) return;

        Follower me = getOrCreate(myId);
        Follower target = getOrCreate(targetId);

        me.getFollowing().add(targetId);
        target.getFollowers().add(myId);

        repo.save(me);
        repo.save(target);
    }

    // ➖ Unfollow
    public void unfollow(String myId, String targetId) {

        Follower me = getOrCreate(myId);
        Follower target = getOrCreate(targetId);

        me.getFollowing().remove(targetId);
        target.getFollowers().remove(myId);

        repo.save(me);
        repo.save(target);
    }

    public Follower get(String userId) {
        return getOrCreate(userId);
    }
}
