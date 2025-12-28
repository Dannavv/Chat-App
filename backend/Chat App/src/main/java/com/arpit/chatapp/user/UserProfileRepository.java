package com.arpit.chatapp.user;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserProfileRepository
        extends MongoRepository<UserProfile, String> {
}
