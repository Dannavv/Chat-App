package com.arpit.chatapp.user;

public class Experience {

    private String role;
    private String company;
    private String startDate;
    private String endDate;
    private String description;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }
}
