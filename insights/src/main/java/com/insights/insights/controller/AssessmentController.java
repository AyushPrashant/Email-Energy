//package com.insights.insights.controller;
//
//import com.insights.insights.dto.AnswerRequest;
//import com.insights.insights.dto.AssessmentResponse;
//import com.insights.insights.service.AssessmentService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/assessment")
//@RequiredArgsConstructor
//public class AssessmentController {
//
//    private final AssessmentService assessmentService;
//
//    @PostMapping("/submit")
//    public AssessmentResponse submitAnswers(@RequestBody List<AnswerRequest> requests) {
//        return assessmentService.processAssessment(requests);
//    }
//}
//


package com.insights.insights.controller;

import com.insights.insights.dto.AnswerRequest;
import com.insights.insights.dto.AssessmentResponse;
import com.insights.insights.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/assessment")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping("/submit")
    public AssessmentResponse submitAnswers(
            @RequestParam Long userId,
            @RequestBody List<AnswerRequest> requests) {

        return assessmentService.processAssessment(userId, requests);
    }
}