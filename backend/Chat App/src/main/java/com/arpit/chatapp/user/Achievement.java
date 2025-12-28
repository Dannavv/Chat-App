package com.arpit.chatapp.user;

public class Achievement {

    private String title;
    private String description;
    private String date;

    // 🔹 No-args constructor (REQUIRED for Jackson)
    public Achievement() {
    }



    // 🔹 Getters
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getDate() {
        return date;
    }

    // 🔹 Setters
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
