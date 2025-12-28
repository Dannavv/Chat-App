package com.arpit.chatapp.follower;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/users/me")
public class FollowerController {

    private final FollowerService service;

    public FollowerController(FollowerService service) {
        this.service = service;
    }

    @PostMapping("/follow/{targetId}")
    public void follow(HttpServletRequest req, @PathVariable String targetId) {
        String myId = (String) req.getAttribute("userId");
        service.follow(myId, targetId);
    }

    @DeleteMapping("/unfollow/{targetId}")
    public void unfollow(HttpServletRequest req, @PathVariable String targetId) {
        String myId = (String) req.getAttribute("userId");
        service.unfollow(myId, targetId);
    }

    @GetMapping("/followers")
    public Object followers(HttpServletRequest req) {
        String myId = (String) req.getAttribute("userId");
        return service.get(myId).getFollowers();
    }

    @GetMapping("/following")
    public Object following(HttpServletRequest req) {
        String myId = (String) req.getAttribute("userId");
        return service.get(myId).getFollowing();
    }
}
