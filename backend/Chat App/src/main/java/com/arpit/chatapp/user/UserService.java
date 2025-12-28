package com.arpit.chatapp.user;

import com.arpit.chatapp.auth.User;
import com.arpit.chatapp.auth.UserRepository;
import com.arpit.chatapp.follower.Follower;
import com.arpit.chatapp.follower.FollowerRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final FollowerRepository followerRepo;

    public UserService(
            UserRepository userRepo,
            UserProfileRepository profileRepo,
            FollowerRepository followerRepo
    ) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.followerRepo = followerRepo;
    }

    /**
     * GET ALL USERS EXCEPT ME
     */
    public List<UserListResponse> getAllUsersExcept(String currentUserId) {

        Follower me = followerRepo.findById(currentUserId).orElse(null);

        Set<String> myFollowers =
                me != null ? me.getFollowers() : Collections.emptySet();

        Set<String> myFollowing =
                me != null ? me.getFollowing() : Collections.emptySet();

        return userRepo.findAll().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(u -> mapToUserListResponse(u, myFollowers, myFollowing))
                .toList();
    }

    /**
     * ✅ GET SINGLE USER BY ID
     */
    public UserListResponse getUserById(String targetUserId, String myUserId) {

        User user = userRepo.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile =
                profileRepo.findById(targetUserId).orElse(null);

        Follower me = followerRepo.findById(myUserId).orElse(null);

        boolean isFollowing =
                me != null && me.getFollowing().contains(targetUserId);

        boolean isFollower =
                me != null && me.getFollowers().contains(targetUserId);

        return new UserListResponse(
                user.getId(),
                profile != null ? profile.getDisplayName() : user.getName(),
                user.getEmail(),
                profile != null ? profile.getProfilePhoto() : null,
                isFollowing,
                isFollower
        );
    }

    /**
     * 🔹 Shared mapper
     */
    private UserListResponse mapToUserListResponse(
            User user,
            Set<String> myFollowers,
            Set<String> myFollowing
    ) {
        UserProfile profile =
                profileRepo.findById(user.getId()).orElse(null);

        return new UserListResponse(
                user.getId(),
                profile != null ? profile.getDisplayName() : user.getName(),
                user.getEmail(),
                profile != null ? profile.getProfilePhoto() : null,
                myFollowing.contains(user.getId()),
                myFollowers.contains(user.getId())
        );
    }
}
