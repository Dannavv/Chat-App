package com.arpit.chatapp.dashboard;

import com.arpit.chatapp.auth.User;
import com.arpit.chatapp.auth.UserRepository;
import com.arpit.chatapp.chat.MessageRepository;
import com.arpit.chatapp.follower.Follower;
import com.arpit.chatapp.follower.FollowerRepository;
import com.arpit.chatapp.user.UserProfile;
import com.arpit.chatapp.user.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;


@Service
public class DashboardService {

    private final UserProfileRepository profileRepo;
    private final UserRepository userRepo;
    private final FollowerRepository followerRepo;
    private final MessageRepository messageRepo;

    public DashboardService(
            UserProfileRepository profileRepo,
            UserRepository userRepo,
            FollowerRepository followerRepo,
            MessageRepository messageRepo
    ) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
        this.followerRepo = followerRepo;
        this.messageRepo = messageRepo;
    }

    public DashboardResponse getDashboard(String userId) {

        System.out.println("🧠 Building dashboard for userId = " + userId);

        // ================= USER (SAFE) =================
        User user = userRepo.findById(userId)
                .orElseGet(() -> {
                    System.out.println("⚠️ User not found, using empty user");
                    User u = new User();
                    u.setId(userId);
                    u.setName("");
                    u.setEmail("");
                    return u;
                });

        // ================= COUNTS (SAFE) =================
        long unreadMsgs = safeCount(() ->
                messageRepo.countUnreadMessages(userId));

        long unreadChats = safeCount(() ->
                messageRepo.countUnreadConversations(userId));

        long totalChats = safeCount(() ->
                messageRepo.countRepliedConversations(userId));

        long totalMessages = safeCount(() ->
                messageRepo.countBySenderIdOrReceiverId(userId, userId));

        // ================= PROFILE (AUTO CREATE) =================
        UserProfile profile = profileRepo.findById(userId)
                .orElseGet(() -> {
                    System.out.println("🆕 Creating profile for user");
                    UserProfile p = new UserProfile(userId);
                    p.setDisplayName(
                            user.getName() != null ? user.getName() : ""
                    );
                    p.setBio("");
                    p.setProfilePhoto("");
                    return profileRepo.save(p);
                });

        // ================= FOLLOWER (AUTO CREATE) =================
        Follower follower = followerRepo.findById(userId)
                .orElseGet(() -> {
                    System.out.println("🆕 Creating follower doc");
                    return followerRepo.save(new Follower(userId));
                });

        // ================= RESPONSE =================
        return new DashboardResponse(
                userId,
                safe(profile.getDisplayName()),
                safe(user.getEmail()),
                safe(profile.getProfilePhoto()),
                safe(profile.getBio()),
                totalChats,
                totalMessages,
                follower.getFollowers() != null ? follower.getFollowers().size() : 0,
                follower.getFollowing() != null ? follower.getFollowing().size() : 0,
                unreadChats,
                unreadMsgs
        );
    }

    // ---------- HELPERS ----------

    private long safeCount(CountSupplier supplier) {
        try {
            Long v = supplier.get();
            return v != null ? v : 0L;
        } catch (Exception e) {
            System.out.println("⚠️ Count query failed");
            e.printStackTrace();
            return 0L;
        }
    }

    private String safe(String v) {
        return v == null ? "" : v;
    }

    @FunctionalInterface
    interface CountSupplier {
        Long get();
    }
}

