package com.arpit.chatapp.chat;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private List<String> participantIds;
    private String lastMessage;
    private Instant lastUpdated;

    public String getId() {
        return id;
    }

    public List<String> getParticipantIds() {
        return participantIds;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setParticipantIds(List<String> participantIds) {
        this.participantIds = participantIds;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
