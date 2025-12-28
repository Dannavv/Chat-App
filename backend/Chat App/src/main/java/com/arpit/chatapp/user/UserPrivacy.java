package com.arpit.chatapp.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_privacy")
public class UserPrivacy {

    @Id
    private String userId;

    private boolean showLastSeen = true;
    private boolean showProfilePhoto = true;
    private boolean readReceipts = true;

    private boolean showEmail = false;
    private boolean showLocation = false;
    private boolean allowMessages = true;

    public UserPrivacy() {}

    public UserPrivacy(String userId) {
        this.userId = userId;
    }

    // ===== GETTERS =====
    public String getUserId() {
        return userId;
    }

    public boolean isShowLastSeen() {
        return showLastSeen;
    }

    public boolean isShowProfilePhoto() {
        return showProfilePhoto;
    }

    public boolean isReadReceipts() {
        return readReceipts;
    }

    public boolean isShowEmail() {
        return showEmail;
    }

    public boolean isShowLocation() {
        return showLocation;
    }

    public boolean isAllowMessages() {
        return allowMessages;
    }

    // ===== SETTERS =====
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setShowLastSeen(boolean showLastSeen) {
        this.showLastSeen = showLastSeen;
    }

    public void setShowProfilePhoto(boolean showProfilePhoto) {
        this.showProfilePhoto = showProfilePhoto;
    }

    public void setReadReceipts(boolean readReceipts) {
        this.readReceipts = readReceipts;
    }

    public void setShowEmail(boolean showEmail) {
        this.showEmail = showEmail;
    }

    public void setShowLocation(boolean showLocation) {
        this.showLocation = showLocation;
    }

    public void setAllowMessages(boolean allowMessages) {
        this.allowMessages = allowMessages;
    }
}
