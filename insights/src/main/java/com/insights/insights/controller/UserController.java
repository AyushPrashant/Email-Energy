package com.insights.insights.controller;

import com.insights.insights.dto.AssessmentResponse;
import com.insights.insights.dto.UserEmailRequest;
import com.insights.insights.repository.UserRepository;
import com.insights.insights.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/energy")
    public AssessmentResponse getEnergy(@RequestBody UserEmailRequest request) {
        return userService.getUserEnergyByEmail(request.getEmail());
    }

//    @GetMapping
//    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
//        return userRepository.findByEmail(email)
//                .map(user -> ResponseEntity.ok(Map.of(
//                        "id",    user.getId(),
//                        "name",  user.getName(),
//                        "email", user.getEmail()
//                )))
//                .orElse(ResponseEntity.notFound().build());
//    }

//    @GetMapping
//    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
//        return userRepository.findByEmail(email)
//                .map(user -> ResponseEntity.ok(Map.of(
//                        "id",    user.getId(),
//                        "name",  user.getName(),
//                        "email", user.getEmail()
//                )))
//                .orElse(ResponseEntity.notFound().build());
//    }

    @GetMapping
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(Map.of(
                        "id",    user.getId(),
                        "name",  user.getName(),
                        "email", user.getEmail()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

}