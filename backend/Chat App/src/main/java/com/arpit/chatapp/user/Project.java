package com.arpit.chatapp.user;

import java.util.List;

public class Project {

    private String title;
    private String description;
    private List<String> techStack;
    private String repoUrl;
    private String liveUrl;

    // 🔹 No-args constructor (REQUIRED for Jackson)
    public Project() {
    }

    // 🔹 Getters
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getTechStack() {
        return techStack;
    }

    public String getRepoUrl() {
        return repoUrl;
    }

    public String getLiveUrl() {
        return liveUrl;
    }

    // 🔹 Setters
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTechStack(List<String> techStack) {
        this.techStack = techStack;
    }

    public void setRepoUrl(String repoUrl) {
        this.repoUrl = repoUrl;
    }

    public void setLiveUrl(String liveUrl) {
        this.liveUrl = liveUrl;
    }
}
