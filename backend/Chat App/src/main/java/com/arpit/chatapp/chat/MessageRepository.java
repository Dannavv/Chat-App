package com.arpit.chatapp.chat;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    // 1. Fetch messages between two users
    @Query("""
        {
          $or: [
            { senderId: ?0, receiverId: ?1 },
            { senderId: ?1, receiverId: ?0 }
          ]
        }
    """)
    List<Message> findMessagesBetweenUsers(String userA, String userB);

    // 2. Count conversations where BOTH users have sent at least one message
    @Aggregation(pipeline = {
            "{ $match: { $or: [ { senderId: ?0 }, { receiverId: ?0 } ] } }",
            "{ $group: { _id: '$conversationId', senders: { $addToSet: '$senderId' } } }",
            "{ $match: { senders: { $size: 2 } } }",
            "{ $count: 'count' }"
    })
    Long countRepliedConversations(String userId);

    // 3. Helper for fetching unread messages in a specific chat
    // (Assuming you use 'isRead' boolean based on your previous methods)
    List<Message> findByConversationIdAndReceiverIdAndIsReadFalse(String conversationId, String userId);

    // 4. Count unread messages in a specific chat
    long countByConversationIdAndReceiverIdAndIsReadFalse(String conversationId, String userId);

    // ✅ FIX A: Count Total Unread Messages for a User
    // (Replaces the SQL 'SELECT COUNT(m)...')
    // We use the 'count = true' flag to return a number instead of documents.
    // Note: I used 'isRead: false' to match your existing naming convention.
    // If you explicitly use a 'status' field, change this to "{ 'receiverId': ?0, 'status': 'UNREAD' }"
    @Query(value = "{ 'receiverId': ?0, 'isRead': false }", count = true)
    long countUnreadMessages(String userId);

    // ✅ FIX B: Count Total Unread CONVERSATIONS
    // (Replaces 'SELECT COUNT(DISTINCT m.conversationId)...')
    // MongoDB requires an aggregation pipeline to do a "DISTINCT COUNT"
    @Aggregation(pipeline = {
            "{ $match: { receiverId: ?0, isRead: false } }", // Filter unread messages for this user
            "{ $group: { _id: '$conversationId' } }",        // Group by conversation (deduplicate)
            "{ $count: 'count' }"                            // Count the groups
    })
    Long countUnreadConversations(String userId);

    // ✅ FIX C: Count Total Messages (Sent + Received)
    // Simple Derived Query Method
    long countBySenderIdOrReceiverId(String senderId, String receiverId);
}