//package com.insights.insights.controller;
//
//import com.insights.insights.dto.EmailRequest;
//import com.insights.insights.service.EmailService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//@CrossOrigin(origins = "*")
//@RestController
//@RequestMapping("/api/email")
//@RequiredArgsConstructor
//public class EmailController {
//
//    private final EmailService emailService;
//
//    @PostMapping("/analyze")
//    public String analyze(@RequestBody EmailRequest request) {
//        return emailService.analyzeEmail(request);
//    }
//}


//package com.insights.insights.controller;
//
//import com.insights.insights.dto.EmailRequest;
//import com.insights.insights.dto.EmailResponse;
//import com.insights.insights.service.EmailService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/email")
//@CrossOrigin(origins = "*")
//public class EmailController {
//
//    @Autowired
//    private EmailService emailService;
//
//    @PostMapping("/analyze")
//    public ResponseEntity<String> analyze(@RequestBody EmailRequest request) {
//        String rewritten = emailService.analyzeEmail(request);
//        return ResponseEntity.ok(rewritten);
//    }
//
//    @PostMapping("/send")
//    public ResponseEntity<EmailResponse> send(@RequestBody EmailRequest request) {
//        EmailResponse response = emailService.analyzeAndSend(request);
//        return ResponseEntity.ok(response);
//    }
//}


//
//package com.insights.insights.controller;
//
//import com.insights.insights.dto.EmailRequest;
//import com.insights.insights.dto.EmailResponse;
//import com.insights.insights.service.EmailService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/email")
//@CrossOrigin(origins = "*")
//public class EmailController {
//
//    @Autowired
//    private EmailService emailService;
//
//    /**
//     * POST /api/email/analyze
//     * Rewrites email using Groq AI based on sender's energy.
//     * Returns plain rewritten email string (no sending).
//     *
//     * Body: { userId, recipientName, emailContent }
//     */
//    @PostMapping("/analyze")
//    public ResponseEntity<String> analyze(@RequestBody EmailRequest request) {
//        String rewritten = emailService.analyzeEmail(request);
//        return ResponseEntity.ok(rewritten);
//    }
//
//    /**
//     * POST /api/email/send
//     * Rewrites email using Groq AI AND sends it via SMTP.
//     * Returns JSON with rewritten text + send status.
//     *
//     * Body: { userId, recipientName, recipientEmail, emailContent }
//     */
//    @PostMapping("/send")
//    public ResponseEntity<EmailResponse> send(@RequestBody EmailRequest request) {
//        EmailResponse response = emailService.analyzeAndSend(request);
//        return ResponseEntity.ok(response);
//    }
//}


package com.insights.insights.controller;

import com.insights.insights.dto.EmailRequest;
import com.insights.insights.dto.EmailResponse;
import com.insights.insights.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    /**
     * POST /api/email/analyze
     * Rewrites email using Groq AI based on sender's energy.
     * Returns plain rewritten email string (no sending).
     *
     * Body: { userId, recipientName, emailContent }
     */
    @PostMapping("/analyze")
    public ResponseEntity<String> analyze(@RequestBody EmailRequest request) {
        String rewritten = emailService.analyzeEmail(request);
        return ResponseEntity.ok(rewritten);
    }

    /**
     * POST /api/email/send
     * Rewrites email using Groq AI AND sends it via SMTP.
     * Returns JSON with rewritten text + send status.
     *
     * Body: { userId, recipientName, recipientEmail, emailContent }
     */
    @PostMapping("/send")
    public ResponseEntity<EmailResponse> send(@RequestBody EmailRequest request) {
        EmailResponse response = emailService.analyzeAndSend(request);
        return ResponseEntity.ok(response);
    }
}
