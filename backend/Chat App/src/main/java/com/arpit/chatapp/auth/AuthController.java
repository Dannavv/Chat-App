package com.arpit.chatapp.auth;

import com.arpit.chatapp.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;
    private final JwtUtil jwtUtil;

    public AuthController(
            AuthService authService,
            GoogleAuthService googleAuthService,
            JwtUtil jwtUtil
    ) {
        this.authService = authService;
        this.googleAuthService = googleAuthService;
        this.jwtUtil = jwtUtil;
    }

    // 🔹 REGISTER
    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest req) {
        return authService.register(
                req.getEmail(),
                req.getPassword(),
                req.getName()
        );
    }

    // 🔐 LOGIN (Email + Password)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {

        User user = authService.login(
                req.getEmail(),
                req.getPassword()
        );

        String token = jwtUtil.generateToken(user.getId());

        return Map.of(
                "token", token,
                "userId", user.getId(),
                "email", user.getEmail()
        );
    }

    // 🔐 GOOGLE LOGIN
    @PostMapping("/google")
    public Map<String, Object> googleLogin(
            @RequestBody Map<String, String> body
    ) throws Exception {

        String idToken = body.get("token");

        GoogleIdToken.Payload payload =
                googleAuthService.verify(idToken);

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = authService.loginOrCreateGoogleUser(
                email,
                name
        );

        String token = jwtUtil.generateToken(user.getId());

        return Map.of(
                "token", token,
                "userId", user.getId(),
                "email", user.getEmail()
        );
    }
}
