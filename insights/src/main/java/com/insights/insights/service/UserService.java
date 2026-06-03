package com.insights.insights.service;

import com.insights.insights.dto.AssessmentResponse;
import com.insights.insights.model.AssessmentResult;
import com.insights.insights.model.User;
import com.insights.insights.repository.AssessmentResultRepository;
import com.insights.insights.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AssessmentResultRepository assessmentResultRepository;

    public User saveUser(User user) {

        userRepository.findByEmail(user.getEmail()).ifPresent(existingUser -> {
            throw new RuntimeException("Email is already registered");
        });

        return userRepository.save(user);
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AssessmentResponse getUserEnergyByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AssessmentResult result = assessmentResultRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Assessment not completed"));

        AssessmentResponse res = new AssessmentResponse();
        res.setFieryRed(result.getFieryRed());
        res.setEarthGreen(result.getEarthGreen());
        res.setSunshineYellow(result.getSunshineYellow());
        res.setCoolBlue(result.getCoolBlue());
        res.setDominantEnergy(result.getDominantEnergy());

        return res;
    }

}
