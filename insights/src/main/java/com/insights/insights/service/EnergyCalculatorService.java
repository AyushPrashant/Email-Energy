package com.insights.insights.service;


import com.insights.insights.model.Answer;
import com.insights.insights.model.AssessmentResult;
import com.insights.insights.model.EnergyType;
import com.insights.insights.model.Question;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EnergyCalculatorService {

    public AssessmentResult calculate(List<Answer> answers, List<Question> questions, Long userId) {

        Map<EnergyType, Double> scores = new HashMap<>();

        for (EnergyType type : EnergyType.values()) {
            scores.put(type, 0.0);
        }

        for (Answer ans : answers) {

            Question q = questions.stream()
                    .filter(qq -> qq.getId().equals(ans.getQuestionId()))
                    .findFirst()
                    .orElse(null);

            if (q == null) continue;

            double score = ans.getValue();

            if ("MOST".equals(ans.getType())) {
                score += 2;
            } else if ("LEAST".equals(ans.getType())) {
                score = (6 - ans.getValue());
            }

            scores.put(q.getEnergyType(),
                    scores.get(q.getEnergyType()) + score);
        }

        double total = scores.values().stream().mapToDouble(Double::doubleValue).sum();

        AssessmentResult result = new AssessmentResult();
        result.setUserId(userId);

        result.setFieryRed((scores.get(EnergyType.FIERY_RED) / total) * 100);
        result.setEarthGreen((scores.get(EnergyType.EARTH_GREEN) / total) * 100);
        result.setSunshineYellow((scores.get(EnergyType.SUNSHINE_YELLOW) / total) * 100);
        result.setCoolBlue((scores.get(EnergyType.COOL_BLUE) / total) * 100);

        String dominant = scores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .get().getKey().name();

        result.setDominantEnergy(dominant);

        return result;
    }
}
