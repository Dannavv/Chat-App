package com.arpit.chatapp.user;

public class CurrentWorking {

    private String status;
    // STUDENT | WORKING | INTERN | FREELANCER | UNEMPLOYED

    private String role;
    private String organization;
    private String startDate;
    private String description;

    public CurrentWorking() {}


    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }
}
