package com.insights.insights.service;

import com.insights.insights.dto.AnswerRequest;
import com.insights.insights.dto.AssessmentResponse;
import com.insights.insights.exception.AssessmentAlreadySubmittedException;
import com.insights.insights.model.Answer;
import com.insights.insights.model.AssessmentResult;
import com.insights.insights.model.Question;
import com.insights.insights.repository.AnswerRepository;
import com.insights.insights.repository.QuestionRepository;
import com.insights.insights.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AnswerRepository answerRepo;
    private final QuestionRepository questionRepo;
    private final ResultRepository resultRepo;
    private final EnergyCalculatorService calculator;

    private AssessmentResponse mapToResponse(AssessmentResult result) {

        AssessmentResponse res = new AssessmentResponse();
        res.setFieryRed(result.getFieryRed());
        res.setEarthGreen(result.getEarthGreen());
        res.setSunshineYellow(result.getSunshineYellow());
        res.setCoolBlue(result.getCoolBlue());
        res.setDominantEnergy(result.getDominantEnergy());

        return res;
    }

    public AssessmentResponse processAssessment(Long userId, List<AnswerRequest> requests) {

        if (answerRepo.existsByUserId(userId)) {
            throw new AssessmentAlreadySubmittedException("User already submitted assessment!");
        }

        // ✅ map answers
        List<Answer> answers = requests.stream().map(req -> {
            Answer a = new Answer();
            a.setUserId(userId); // 🔥 set from request param
            a.setQuestionId(req.getQuestionId());
            a.setValue(req.getValue());
            a.setType(req.getType());
            return a;
        }).toList();

        answerRepo.saveAll(answers);

        List<Question> questions = questionRepo.findAll();

        AssessmentResult result =
                calculator.calculate(answers, questions, userId);

        resultRepo.save(result);

        return mapToResponse(result);
    }
}
