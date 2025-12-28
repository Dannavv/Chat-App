package com.arpit.chatapp.user;

import com.arpit.chatapp.follower.Follower;
import com.arpit.chatapp.follower.FollowerRepository;
import com.arpit.chatapp.user.dto.UserSummaryResponse;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserProfileRepository profileRepo;
    private final UserPrivacyRepository privacyRepo;

    private final FollowerRepository followerRepo; // 🔹 Add this

    public UserProfileService(UserProfileRepository profileRepo,
                              UserPrivacyRepository privacyRepo,
                              FollowerRepository followerRepo) {
        this.profileRepo = profileRepo;
        this.privacyRepo = privacyRepo;
        this.followerRepo = followerRepo;
    }

    public List<UserSummaryResponse> getAllUsersWithSummary(String currentUserId) {
        // 1. Get the current logged-in user's "Following" list
        Follower myFollowerData = followerRepo.findById(currentUserId).orElse(null);

        // Optimize: Put following IDs in a Set for fast lookup (O(1))
        Set<String> followingIds = (myFollowerData != null)
                ? myFollowerData.getFollowing()
                : Collections.emptySet();

        // 2. Fetch all user profiles
        List<UserProfile> allProfiles = profileRepo.findAll();

        // 3. Map profiles to the DTO
        return allProfiles.stream()
                .filter(profile -> !profile.getUserId().equals(currentUserId)) // Optional: Remove self from list
                .map(profile -> {
                    boolean isFollowing = followingIds.contains(profile.getUserId());

                    return new UserSummaryResponse(
                            profile.getUserId(),
                            profile.getDisplayName(),
                            profile.getProfilePhoto(),
                            profile.getBio(),
                            profile.getCurrentWorking(),
                            isFollowing
                    );
                })
                .collect(Collectors.toList());
    }

    // 🔹 GET OR CREATE PROFILE
    public UserProfile getProfile(String userId) {
        return profileRepo.findById(userId)
                .orElseGet(() -> profileRepo.save(new UserProfile(userId)));
    }

    // 🔹 UPDATE FULL PROFILE
    public UserProfile updateProfile(String userId, UserProfile updated) {
        updated.setUserId(userId);
        return profileRepo.save(updated);
    }

    // 🔹 UPDATE ONLY CURRENT WORKING
    public UserProfile updateCurrentWorking(
            String userId,
            CurrentWorking currentWorking
    ) {
        UserProfile profile = getProfile(userId);
        profile.setCurrentWorking(currentWorking);
        return profileRepo.save(profile);
    }

    // 🔹 PRIVACY
    public UserPrivacy getPrivacy(String userId) {
        return privacyRepo.findById(userId)
                .orElseGet(() -> privacyRepo.save(new UserPrivacy(userId)));
    }

    public UserPrivacy updatePrivacy(String userId, UserPrivacy updated) {
        updated.setUserId(userId);
        return privacyRepo.save(updated);
    }

    public UserProfile getPublicProfile(String userId) {
        try {
            System.out.println("STEP 1: Fetch profile");

            UserProfile profile = profileRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("STEP 2: Profile fetched");

            UserPrivacy privacy = privacyRepo.findById(userId).orElse(null);

            System.out.println("STEP 3: Privacy fetched");

            return profile;

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 THIS WILL SHOW THE REAL ERROR
            throw e;
        }
    }


    // 🔹 HELPER: Filter data based on privacy settings
    private UserProfile filterProfileByPrivacy(UserProfile profile, UserPrivacy privacy) {
        // Create a copy or modify 'profile' directly if it's just for response
        // logic depends on your UserPrivacy fields (e.g., isEmailPublic, isBioPublic)

        // Example Logic:
        // if (!privacy.isLocationPublic()) {
        //     profile.setLocation(null);
        // }

        return profile;
    }
}
