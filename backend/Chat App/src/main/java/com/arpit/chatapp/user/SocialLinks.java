package com.arpit.chatapp.user;

public class SocialLinks {

    private String github = "";
    private String linkedin = "";
    private String twitter = "";
    private String portfolio = "";

    public SocialLinks() {}

    // 🔹 Getters
    public String getLinkedin() {
        return linkedin;
    }

    public String getGithub() {
        return github;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public String getTwitter() {
        return twitter;
    }

    // 🔹 Setters
    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public void setTwitter(String twitter) {
        this.twitter = twitter;
    }
}
