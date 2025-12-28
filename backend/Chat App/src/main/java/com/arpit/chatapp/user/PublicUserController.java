package com.arpit.chatapp.user;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usersprofile")
public class PublicUserController {

    private final UserProfileService service;

    public PublicUserController(UserProfileService service) {
        this.service = service;

    }

    // 🔹 VIEW OTHER USER'S PROFILE
    // Route: GET /users/profile/{userId}
    @GetMapping("/profile/{userId}")
    public UserProfile getUserProfile(@PathVariable String userId) {

        System.out.println("for public user details " + userId);
        return service.getPublicProfile(userId);
    }
}