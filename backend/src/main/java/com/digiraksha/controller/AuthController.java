package com.digiraksha.controller;

import com.digiraksha.model.User;
import com.digiraksha.repository.UserRepository;
import com.digiraksha.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String name = request.get("name");
        String school = request.get("school");
        String className = request.get("className");
        String role = request.get("role");

        if (username == null || password == null || name == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required credentials."));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already registered."));
        }

        User user = new User(
                username,
                passwordEncoder.encode(password),
                name,
                school != null ? school : "Greenwood High",
                className != null ? className : "Class 8",
                role != null ? role.toLowerCase() : "student"
        );

        // Standard defaults
        user.setXp(100); // 100 XP starting bonus
        user.setCoins(50); // 50 starting coins
        user.setRankName("ROOKIE CADET");

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Cadet registered successfully."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing username or password."));
        }

        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password."));
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("name", user.getName());
        response.put("role", user.getRole());
        response.put("school", user.getSchool());
        response.put("className", user.getClassName());
        response.put("xp", user.getXp());
        response.put("coins", user.getCoins());
        response.put("rank", user.getRankName());
        response.put("stamps", user.getStamps());
        response.put("completedMissions", user.getCompletedMissions());
        response.put("badges", user.getBadges());
        response.put("signedPledge", user.isSignedPledge());
        response.put("pledgeSignature", user.getPledgeSignature());
        response.put("posterSubmitted", user.isPosterSubmitted());

        return ResponseEntity.ok(response);
    }
}
