package com.arpit.chatapp.user;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserPrivacyRepository
        extends MongoRepository<UserPrivacy, String> {
}
