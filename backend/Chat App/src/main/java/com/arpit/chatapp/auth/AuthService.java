package com.arpit.chatapp.auth;

import com.arpit.chatapp.exception.BadRequestException;
import com.arpit.chatapp.exception.UnauthorizedException;
import com.arpit.chatapp.user.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final UserPrivacyRepository privacyRepo;
    private final BCryptPasswordEncoder encoder;

    public AuthService(
            UserRepository userRepo,
            UserProfileRepository profileRepo,
            UserPrivacyRepository privacyRepo,
            BCryptPasswordEncoder encoder
    ) {
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.privacyRepo = privacyRepo;
        this.encoder = encoder;
    }

    // 🔐 EMAIL + PASSWORD LOGIN
    public User login(String email, String password) {

        if (email == null || password == null) {
            throw new BadRequestException("Email and password are required");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Email not registered"));

        if ("GOOGLE".equals(user.getProvider())) {
            throw new UnauthorizedException("Use Google login");
        }

        if (!encoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Incorrect password");
        }

        return user;
    }

    // 📝 LOCAL REGISTRATION
    public User register(String email, String password, String name) {

        if (email == null || password == null || name == null) {
            throw new BadRequestException("All fields are required");
        }

        if (userRepo.findByEmail(email).isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User(email, encoder.encode(password), name);
        user.setProvider("LOCAL");

        user = userRepo.save(user);

        ensureProfileAndPrivacy(user, name);

        return user;
    }

    // 🔐 GOOGLE LOGIN / SIGNUP
    public User loginOrCreateGoogleUser(String email, String name) {

        return userRepo.findByEmail(email)
                .map(user -> {
                    if ("LOCAL".equals(user.getProvider())) {
                        throw new BadRequestException(
                                "Email registered with password login"
                        );
                    }
                    ensureProfileAndPrivacy(user, name);
                    return user;
                })
                .orElseGet(() -> {

                    User user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setProvider("GOOGLE");
                    user.setPassword(null);

                    user = userRepo.save(user);

                    ensureProfileAndPrivacy(user, name);

                    return user;
                });
    }

    // 🔧 SAFE CREATION (idempotent)
    private void ensureProfileAndPrivacy(User user, String name) {

        // ===== USER PROFILE =====
        profileRepo.findById(user.getId())
                .orElseGet(() -> {

                    UserProfile profile = new UserProfile(user.getId());

                    // BASIC INFO
                    profile.setDisplayName(name != null ? name : "New User");
                    profile.setBio("");
                    profile.setProfilePhoto("");
                    profile.setLocation("");

                    // CURRENT WORK
                    profile.setCurrentWorking(new CurrentWorking());

                    // LISTS (NEVER NULL)
                    profile.setExperiences(new ArrayList<>());
                    profile.setEducation(new ArrayList<>());
                    profile.setSkills(new ArrayList<>());
                    profile.setProjects(new ArrayList<>());
                    profile.setCertifications(new ArrayList<>());
                    profile.setAchievements(new ArrayList<>());

                    // OBJECTS (NEVER NULL)
                    profile.setSocialLinks(new SocialLinks());

                    return profileRepo.save(profile);
                });

        // ===== USER PRIVACY =====
        privacyRepo.findById(user.getId())
                .orElseGet(() -> {

                    UserPrivacy privacy = new UserPrivacy(user.getId());

                    privacy.setShowEmail(false);
                    privacy.setShowLocation(false);
                    privacy.setAllowMessages(true);

                    return privacyRepo.save(privacy);
                });
    }

}
