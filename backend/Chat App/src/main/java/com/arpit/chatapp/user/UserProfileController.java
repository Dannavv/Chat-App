package com.arpit.chatapp.user;

import com.arpit.chatapp.user.dto.UserSummaryResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/users/me")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    // 🔹 GET PROFILE
    @GetMapping("/profile")
    public UserProfile getProfile(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return service.getProfile(userId);
    }

    // 🔹 UPDATE FULL PROFILE
    @PutMapping("/profile")
    public UserProfile updateProfile(
            HttpServletRequest request,
            @RequestBody UserProfile profile
    ) {
        String userId = (String) request.getAttribute("userId");

//        try {
//            ObjectMapper mapper = new ObjectMapper();
//            String json = mapper.writerWithDefaultPrettyPrinter()
//                    .writeValueAsString(profile);
//            System.out.println("🔹 UPDATE PROFILE REQUEST:\n" + json);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

//        System.out.println("here");

        return service.updateProfile(userId, profile);
    }

    // 🔹 UPDATE CURRENT WORKING ONLY
    @PutMapping("/profile/current-working")
    public UserProfile updateCurrentWorking(
            HttpServletRequest request,
            @RequestBody CurrentWorking currentWorking
    ) {
        String userId = (String) request.getAttribute("userId");
        return service.updateCurrentWorking(userId, currentWorking);
    }

    // 🔹 PRIVACY
    @GetMapping("/privacy")
    public UserPrivacy getPrivacy(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return service.getPrivacy(userId);
    }

    @PutMapping("/privacy")
    public UserPrivacy updatePrivacy(
            HttpServletRequest request,
            @RequestBody UserPrivacy privacy
    ) {
        String userId = (String) request.getAttribute("userId");
        return service.updatePrivacy(userId, privacy);
    }

    @GetMapping
    public List<UserSummaryResponse> getAllUsers(HttpServletRequest request) {
        // We need the ID of the person making the request to calculate "isFollowing"
        String currentUserId = (String) request.getAttribute("userId");
        return service.getAllUsersWithSummary(currentUserId);
    }

    // 🔹 VIEW OTHER PROFILE
    @GetMapping("/profile/{userId}")
    public UserProfile getUserProfile(@PathVariable String userId) {
        return service.getPublicProfile(userId);
    }
}
