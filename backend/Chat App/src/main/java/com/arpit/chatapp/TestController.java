package com.arpit.chatapp;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Backend root is working 🚀";
    }

    @CrossOrigin(
            origins = {
                    "http://localhost:5173",
                    "http://localhost:5500"
            },
            allowCredentials = "true"
    )
    @GetMapping("/health")
    public String health() {
        return "Backend is running 🚀";
    }
}
