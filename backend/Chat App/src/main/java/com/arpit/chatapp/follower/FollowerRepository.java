package com.arpit.chatapp.follower;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface FollowerRepository
        extends MongoRepository<Follower, String> {
}
