package com.arpit.chatapp.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "user_profiles")
public class UserProfile {

    @Id
    private String userId;

    // 🔹 BASIC INFO
    private String displayName;
    private String bio;
    private String profilePhoto;
    private String location;

    // 🔹 CURRENT WORKING STATUS
    private CurrentWorking currentWorking;

    // 🔹 PREVIOUS WORK / INTERNSHIPS
    private List<Experience> experiences;

    // 🔹 EDUCATION
    private List<Education> education;

    // 🔹 SKILLS
    private List<Skill> skills;

    // 🔹 PROJECTS
    private List<Project> projects;

    // 🔹 CERTIFICATIONS
    private List<Certification> certifications;

    // 🔹 ACHIEVEMENTS
    private List<Achievement> achievements;

    // 🔹 SOCIAL LINKS
    private SocialLinks socialLinks;

    public UserProfile() {}

    public UserProfile(String userId) {
        this.userId = userId;

        // BASIC INFO
        this.displayName = "";
        this.bio = "";
        this.profilePhoto = "";
        this.location = "";

        // CURRENT WORK
        this.currentWorking = new CurrentWorking();

        // LIST FIELDS (NEVER NULL)
        this.experiences = new ArrayList<>();
        this.education = new ArrayList<>();
        this.skills = new ArrayList<>();
        this.projects = new ArrayList<>();
        this.certifications = new ArrayList<>();
        this.achievements = new ArrayList<>();

        // OBJECT FIELDS (NEVER NULL)
        this.socialLinks = new SocialLinks();
    }


    // ===== GETTERS & SETTERS =====

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public CurrentWorking getCurrentWorking() { return currentWorking; }
    public void setCurrentWorking(CurrentWorking currentWorking) {
        this.currentWorking = currentWorking;
    }

    public List<Experience> getExperiences() { return experiences; }
    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
    }

    public List<Education> getEducation() { return education; }
    public void setEducation(List<Education> education) {
        this.education = education;
    }

    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }

    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }

    public List<Certification> getCertifications() { return certifications; }
    public void setCertifications(List<Certification> certifications) {
        this.certifications = certifications;
    }

    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) {
        this.achievements = achievements;
    }

    public SocialLinks getSocialLinks() { return socialLinks; }
    public void setSocialLinks(SocialLinks socialLinks) {
        this.socialLinks = socialLinks;
    }
}
