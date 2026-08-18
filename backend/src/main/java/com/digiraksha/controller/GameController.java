package com.digiraksha.controller;

import com.digiraksha.model.User;
import com.digiraksha.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Logged in user not found."));
    }

    private void updateRank(User user) {
        int xp = user.getXp();
        if (xp >= 1500) {
            user.setRankName("CYBER HERO");
        } else if (xp >= 1000) {
            user.setRankName("ELITE COMMANDER");
        } else if (xp >= 500) {
            user.setRankName("SECURITY SPECIALIST");
        } else if (xp >= 200) {
            user.setRankName("CYBER GUARD");
        } else {
            user.setRankName("ROOKIE CADET");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PostMapping("/mission/complete")
    public ResponseEntity<?> completeMission(@RequestBody Map<String, Object> request) {
        String missionId = (String) request.get("missionId");
        int stars = (Integer) request.get("stars");
        int xpAwarded = (Integer) request.get("xpAwarded");
        int coinsAwarded = (Integer) request.get("coinsAwarded");

        User user = getCurrentUser();
        user.getCompletedMissions().add(missionId);
        
        // Map stamp ids based on mission
        String stampId = "";
        switch (missionId.toLowerCase()) {
            case "phishing": stampId = "PHISHING_STAMP"; break;
            case "otp": stampId = "OTP_STAMP"; break;
            case "vishing": stampId = "VISHING_STAMP"; break;
            case "upi": stampId = "UPI_STAMP"; break;
        }
        if (!stampId.isEmpty()) {
            user.getStamps().add(stampId);
        }

        user.setXp(user.getXp() + xpAwarded);
        user.setCoins(user.getCoins() + coinsAwarded);
        
        // Add badges
        user.getBadges().add("MISSION_" + missionId.toUpperCase() + "_COMPLETE");
        if (user.getCompletedMissions().size() == 4) {
            user.getBadges().add("DIGI_PROTECTOR");
        }

        updateRank(user);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody Map<String, Object> request) {
        int score = (Integer) request.get("score");
        User user = getCurrentUser();

        user.setXp(user.getXp() + (score * 15));
        user.setCoins(user.getCoins() + (score * 10));

        user.getBadges().add("QUIZ_MASTER");
        if (score == 10) {
            user.getBadges().add("PERFECT_SCORE");
        }

        updateRank(user);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/pledge/sign")
    public ResponseEntity<?> signPledge(@RequestBody Map<String, String> request) {
        String signature = request.get("signature");
        User user = getCurrentUser();

        user.setSignedPledge(true);
        user.setPledgeSignature(signature);
        user.setXp(user.getXp() + 50);
        user.getBadges().add("SWORN_DEFENDER");

        updateRank(user);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/poster/submit")
    public ResponseEntity<?> submitPoster(@RequestBody Map<String, String> request) {
        String slogan = request.get("slogan");
        String mode = request.get("mode");
        String content = request.get("content");

        User user = getCurrentUser();
        user.setPosterSubmitted(true);
        user.setPosterSlogan(slogan);
        user.setPosterMode(mode);
        user.setPosterContent(content);

        user.setXp(user.getXp() + 100);
        user.setCoins(user.getCoins() + 50);
        user.getBadges().add("CREATIVE_ARTIST");

        updateRank(user);
        userRepository.save(user);

        return ResponseEntity.ok(user);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<User> topUsers = userRepository.findAll().stream()
                .sorted((u1, u2) -> Integer.compare(u2.getXp(), u1.getXp()))
                .limit(10)
                .collect(Collectors.toList());

        List<Map<String, Object>> rankList = topUsers.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", u.getName());
            map.put("school", u.getSchool());
            map.put("className", u.getClassName());
            map.put("xp", u.getXp());
            map.put("badgesCount", u.getBadges().size());
            map.put("missionsCount", u.getCompletedMissions().size());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(rankList);
    }
}
