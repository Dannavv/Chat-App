package com.arpit.chatapp.user;


public class Certification {

    private String name;
    private String issuedBy;
    private String year;
    private String credentialUrl;

    // 🔹 No-args constructor (REQUIRED for Jackson)
    public Certification() {
    }


    // 🔹 Getters
    public String getName() {
        return name;
    }

    public String getIssuedBy() {
        return issuedBy;
    }

    public String getYear() {
        return year;
    }

    public String getCredentialUrl() {
        return credentialUrl;
    }

    // 🔹 Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setIssuedBy(String issuedBy) {
        this.issuedBy = issuedBy;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public void setCredentialUrl(String credentialUrl) {
        this.credentialUrl = credentialUrl;
    }
}
