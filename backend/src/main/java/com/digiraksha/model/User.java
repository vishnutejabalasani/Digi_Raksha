package com.digiraksha.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String name;
    private String school;
    private String className;
    private String role;
    
    private int xp = 0;
    private int coins = 0;
    private String rankName = "ROOKIE CADET";

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_stamps", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "stamp_id")
    private Set<String> stamps = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_completed_missions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "mission_id")
    private Set<String> completedMissions = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_badges", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "badge_id")
    private Set<String> badges = new HashSet<>();

    private boolean signedPledge = false;
    private String pledgeSignature;

    private boolean posterSubmitted = false;
    private String posterSlogan;
    private String posterMode;

    @Column(columnDefinition = "TEXT")
    private String posterContent;

    public User() {}

    public User(String username, String password, String name, String school, String className, String role) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.school = school;
        this.className = className;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getCoins() { return coins; }
    public void setCoins(int coins) { this.coins = coins; }

    public String getRankName() { return rankName; }
    public void setRankName(String rankName) { this.rankName = rankName; }

    public Set<String> getStamps() { return stamps; }
    public void setStamps(Set<String> stamps) { this.stamps = stamps; }

    public Set<String> getCompletedMissions() { return completedMissions; }
    public void setCompletedMissions(Set<String> completedMissions) { this.completedMissions = completedMissions; }

    public Set<String> getBadges() { return badges; }
    public void setBadges(Set<String> badges) { this.badges = badges; }

    public boolean isSignedPledge() { return signedPledge; }
    public void setSignedPledge(boolean signedPledge) { this.signedPledge = signedPledge; }

    public String getPledgeSignature() { return pledgeSignature; }
    public void setPledgeSignature(String pledgeSignature) { this.pledgeSignature = pledgeSignature; }

    public boolean isPosterSubmitted() { return posterSubmitted; }
    public void setPosterSubmitted(boolean posterSubmitted) { this.posterSubmitted = posterSubmitted; }

    public String getPosterSlogan() { return posterSlogan; }
    public void setPosterSlogan(String posterSlogan) { this.posterSlogan = posterSlogan; }

    public String getPosterMode() { return posterMode; }
    public void setPosterMode(String posterMode) { this.posterMode = posterMode; }

    public String getPosterContent() { return posterContent; }
    public void setPosterContent(String posterContent) { this.posterContent = posterContent; }
}
