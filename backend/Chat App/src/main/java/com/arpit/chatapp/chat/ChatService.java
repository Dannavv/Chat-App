package com.arpit.chatapp.chat;

import com.arpit.chatapp.auth.User;
import com.arpit.chatapp.auth.UserRepository;
import com.arpit.chatapp.user.UserProfile;
import com.arpit.chatapp.user.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepo;
    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final MessageRepository messageRepo;

    public ChatService(
            ConversationRepository conversationRepo,
            UserRepository userRepo,
            UserProfileRepository profileRepo,
            MessageRepository messageRepo
    ) {
        this.conversationRepo = conversationRepo;
        this.userRepo = userRepo;
        this.profileRepo = profileRepo;
        this.messageRepo = messageRepo;
    }

    // ✅ GET RECENT CHATS
    // inside ChatService.java

    public List<RecentChatResponse> getRecentChats(String userId) {

        return conversationRepo
                .findByParticipantIdsContainingOrderByLastUpdatedDesc(userId)
                .stream()
                // Remove self-chat
                .filter(conv -> conv.getParticipantIds().stream().anyMatch(id -> !id.equals(userId)))
                .map(conv -> {

                    // 1. Identify the friend
                    String friendId = conv.getParticipantIds().stream()
                            .filter(id -> !id.equals(userId))
                            .findFirst()
                            .orElse(null);

                    if (friendId == null) return null; // Safety check

                    // 2. Get Friend Details
                    User user = userRepo.findById(friendId).orElse(null);
                    UserProfile profile = profileRepo.findById(friendId).orElse(null);

                    String displayName = (profile != null && profile.getDisplayName() != null)
                            ? profile.getDisplayName()
                            : (user != null ? user.getName() : "Unknown");

                    String profilePhoto = (profile != null) ? profile.getProfilePhoto() : null;

                    // ✅ 3. FIX: QUERY THE DATABASE FOR THE ACTUAL COUNT
                    // (Make sure you use the 'long' variable type)
                    long unreadCount = messageRepo.countByConversationIdAndReceiverIdAndIsReadFalse(
                            conv.getId(),
                            userId  // Ensure we count messages sent TO me
                    );

                    return new RecentChatResponse(
                            conv.getId(),
                            friendId,
                            displayName,
                            profilePhoto,
                            conv.getLastMessage(),
                            conv.getLastUpdated().toString(),
                            (int) unreadCount // ✅ Pass the real count (cast long to int)
                    );
                })
                .collect(Collectors.toList());
    }
    // inside ChatService.java

    public void markMessagesAsRead(String conversationId, String userId) {
        // Find all unread messages sent TO me in this conversation
        List<Message> unreadMessages = messageRepo.findByConversationIdAndReceiverIdAndIsReadFalse(conversationId, userId);

        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(m -> m.setRead(true));
            messageRepo.saveAll(unreadMessages); // Batch update
        }
    }

    // ✅ SEND MESSAGE (already working)
    public SendMessageResponse sendMessage(
            String senderId,
            String receiverId,
            String content
    ) {

        System.out.println(senderId + receiverId + content);

        if (senderId == null || receiverId == null || content == null) {
            throw new RuntimeException("Invalid message data");
        }

        Conversation conversation = conversationRepo
                .findConversationBetween(senderId, receiverId)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setParticipantIds(List.of(senderId, receiverId));
                    c.setLastUpdated(Instant.now()); // 🔥 REQUIRED
                    return conversationRepo.save(c);
                });

        Message message = new Message();
        message.setConversationId(conversation.getId());
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);

        message = messageRepo.save(message);

        conversation.setLastMessage(content);
        conversation.setLastUpdated(message.getTimestamp());
        conversationRepo.save(conversation);

        return new SendMessageResponse(
                message.getId(),
                conversation.getId(),
                senderId,
                receiverId,
                content,
                message.getTimestamp().toString()
        );
    }

    public List<MessageResponse> getMessagesWithUser(
            String myUserId,
            String friendUserId
    ) {
        System.out.println("===== GET MESSAGES DEBUG =====");
        System.out.println("myUserId      = " + myUserId);
        System.out.println("friendUserId  = " + friendUserId);

        List<Message> rawMessages =
                messageRepo.findMessagesBetweenUsers(myUserId, friendUserId);

        System.out.println("Mongo result count = " + rawMessages.size());

        rawMessages.forEach(m -> {
            System.out.println(
                    "MSG -> sender=" + m.getSenderId()
                            + ", receiver=" + m.getReceiverId()
                            + ", content=" + m.getContent()
            );
        });

        return rawMessages.stream()
                .sorted((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()))
                .map(msg -> new MessageResponse(
                        msg.getId(),
                        msg.getSenderId(),
                        msg.getReceiverId(),
                        msg.getContent(),
                        msg.getTimestamp().toString()
                ))
                .toList();
    }



}
