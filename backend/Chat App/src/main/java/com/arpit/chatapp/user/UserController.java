package com.arpit.chatapp.user;

import com.arpit.chatapp.user.dto.UserSummaryResponse; // 1. Import the new DTO
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserProfileService userProfileService; // 2. Inject Profile Service

    public UserController(UserService userService, UserProfileService userProfileService) {
        this.userService = userService;
        this.userProfileService = userProfileService;
    }

    /**
     * 🔹 GET /users
     * Returns list of users with Rich Data (Bio, Role, Follow status)
     */
    @GetMapping
    public List<UserSummaryResponse> getUsers(HttpServletRequest request) { // 3. Return correct DTO
        String userId = (String) request.getAttribute("userId");
        // 4. Use profileService instead of userService
        return userProfileService.getAllUsersWithSummary(userId);
    }

    /**
     * 🔹 GET /users/{userId}
     * Used for chat header or looking up specific user details
     */
    @GetMapping("/{userId}")
    public UserListResponse getUserById(
            @PathVariable String userId,
            HttpServletRequest request
    ) {
        String myUserId = (String) request.getAttribute("userId");
        return userService.getUserById(userId, myUserId);
    }

    /**
     * 🔹 GET /users/profile/{userId}
     * Public profile view
     */
    @GetMapping("/profile/{userId}")
    public UserProfile getPublicProfile(@PathVariable String userId) {
        return userProfileService.getPublicProfile(userId);
    }
}