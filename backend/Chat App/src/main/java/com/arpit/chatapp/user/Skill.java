package com.arpit.chatapp.user;

public class Skill {

    private String name;
    private int level;

    // 🔹 No-args constructor (REQUIRED for Jackson)
    public Skill() {
    }

    // 🔹 Getters
    public String getName() {
        return name;
    }

    public int getLevel() {
        return level;
    }

    // 🔹 Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
