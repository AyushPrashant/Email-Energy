////package com.insights.insights.service;
////
////import com.insights.insights.dto.EmailRequest;
////import com.insights.insights.model.AssessmentResult;
////import com.insights.insights.repository.AssessmentResultRepository;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.stereotype.Service;
////
////@Service
////public class EmailService {
////
////    @Autowired
////    private AssessmentResultRepository resultRepo;
////
////    public String analyzeEmail(EmailRequest request) {
////
////        AssessmentResult result = resultRepo.findByUserId(request.getUserId())
////                .orElseThrow(() -> new RuntimeException("No assessment found for user."));
////
////
////        String energy = result.getDominantEnergy();
////        String name = request.getRecipientName();
////
////        return switch (energy) {
////
////            case "SUNSHINE_YELLOW" ->
////                    "Hi " + name + " 😊,\n\n" +
////                            "Hope you're doing amazing! Just wanted to check in on the leads — really excited to hear your update!\n\n" +
////                            "Let me know how I can help!\n\nCheers!";
////
////            case "COOL_BLUE" ->
////                    "Hi " + name + ",\n\n" +
////                            "I hope you are doing well.\n\n" +
////                            "Please provide an update on the status of the leads.\n\n" +
////                            "Let me know if any assistance is required.\n\nRegards.";
////
////            case "FIERY_RED" ->
////                    "Hi " + name + ",\n\n" +
////                            "Please share the current status of the leads.\n\nThanks.";
////
////            case "EARTH_GREEN" ->
////                    "Hi " + name + ",\n\n" +
////                            "I hope you're doing well. Just wanted to gently check in on the leads.\n\n" +
////                            "Happy to support if needed.\n\nTake care.";
////
////            default -> "Hi " + name + ", please share update.";
////        };
////    }
////}
//
//
//
//package com.insights.insights.service;
//
//import com.insights.insights.dto.EmailRequest;
//import com.insights.insights.model.AssessmentResult;
//import com.insights.insights.repository.AssessmentResultRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.util.Map;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private AssessmentResultRepository resultRepo;
//
//    @Value("${groq.api.key}")
//    private String apiKey;
//
//    @Value("${groq.api.url}")
//    private String apiUrl;
//
//    private final WebClient webClient = WebClient.builder().build();
//
//    public String analyzeEmail(EmailRequest request) {
//
//        AssessmentResult result = resultRepo.findByUserId(request.getUserId())
//                .orElseThrow(() -> new RuntimeException("No assessment found for user."));
//
//        String energy = result.getDominantEnergy();
//        String name = request.getRecipientName();
//        String emailContent = request.getEmailContent();
//
//        String prompt = buildPrompt(energy, name, emailContent);
//
//        Map<String, Object> requestBody = Map.of(
//                "model", "llama-3.3-70b-versatile",
//                "messages", new Object[]{
//                        Map.of("role", "user", "content", prompt)
//                }
//        );
//
//        return webClient.post()
//                .uri(apiUrl)
//                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
//                .contentType(MediaType.APPLICATION_JSON)
//                .bodyValue(requestBody)
//                .retrieve()
//                .bodyToMono(Map.class)
//                .map(response -> {
//                    var choices = (java.util.List<Map<String, Object>>) response.get("choices");
//                    var message = (Map<String, Object>) choices.get(0).get("message");
//                    return message.get("content").toString();
//                })
//                .block();
//    }
//
//    private String buildPrompt(String energy, String name, String emailContent) {
//
//        String systemPrompt = """
//    You are a professional AI email assistant specialized in rewriting emails
//    based on personality communication styles.
//    Your goal is to improve clarity, tone, and effectiveness.
//    """;
//
//        String energyPrompt = getEnergyPrompt(energy);
//
//        String taskPrompt = """
//    Rewrite the following email addressed to %s.
//
//    Original Email:
//    %s
//    """.formatted(name, emailContent);
//
//        String outputRules = """
//    Rules:
//    - Keep the message intent unchanged
//    - Improve clarity and grammar
//    - Match the personality tone strictly
//    - Make it natural and human-like
//    - Do NOT add extra information
//    - Keep it concise
//    - Return ONLY the final email (no explanation)
//    """;
//
//        return systemPrompt + "\n\n" + energyPrompt + "\n\n" + taskPrompt + "\n\n" + outputRules;
//    }
//
//    private String getEnergyPrompt(String energy) {
//
//        return switch (energy) {
//
//            case "SUNSHINE_YELLOW" -> """
//        Tone Style: Friendly, enthusiastic, expressive
//
//        Guidelines:
//        - Use warm and cheerful language
//        - Add light emojis (1–2 max)
//        - Keep it engaging and positive
//        - Make the reader feel excited and valued
//        """;
//
//            case "COOL_BLUE" -> """
//        Tone Style: Professional, logical, structured
//
//        Guidelines:
//        - Use formal and precise language
//        - Keep sentences well-structured
//        - Avoid emojis
//        - Focus on clarity and completeness
//        """;
//
//            case "FIERY_RED" -> """
//        Tone Style: Direct, assertive, action-oriented
//
//        Guidelines:
//        - Be concise and to the point
//        - Use strong, confident language
//        - Focus on outcomes and action
//        - Avoid unnecessary politeness
//        """;
//
//            case "EARTH_GREEN" -> """
//        Tone Style: Calm, supportive, empathetic
//
//        Guidelines:
//        - Use polite and friendly language
//        - Show understanding and patience
//        - Keep tone soft and respectful
//        - Encourage collaboration
//        """;
//
//            default -> """
//        Tone Style: Neutral professional
//
//        Guidelines:
//        - Keep it polite and clear
//        - Maintain balance between formal and friendly
//        """;
//        };
//    }
//}


//package com.insights.insights.service;
//
//import com.insights.insights.dto.EmailRequest;
//import com.insights.insights.dto.EmailResponse;
//import com.insights.insights.model.AssessmentResult;
//import com.insights.insights.repository.AssessmentResultRepository;
//import jakarta.mail.MessagingException;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class EmailService {
//
//    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
//
//    @Autowired
//    private AssessmentResultRepository resultRepo;
//
//    @Autowired
//    private MailSenderService mailSenderService;
//
//    @Value("${groq.api.key}")
//    private String apiKey;
//
//    @Value("${groq.api.url}")
//    private String apiUrl;
//
//    private final WebClient webClient = WebClient.builder().build();
//
//    // ─────────────────────────────────────────────
//    // 1. Rewrite email only (existing behaviour)
//    // ─────────────────────────────────────────────
//    public String analyzeEmail(EmailRequest request) {
//        AssessmentResult result = resultRepo.findByUserId(request.getUserId())
//                .orElseThrow(() -> new RuntimeException("No assessment found for user."));
//
//        String energy = result.getDominantEnergy();
//        String prompt = buildPrompt(energy, request.getRecipientName(), request.getEmailContent());
//        return callGroq(prompt);
//    }
//
//    // ─────────────────────────────────────────────
//    // 2. Rewrite email AND send it automatically
//    // ─────────────────────────────────────────────
//    public EmailResponse analyzeAndSend(EmailRequest request) {
//
//        // Validate recipient email
//        if (request.getRecipientEmail() == null || request.getRecipientEmail().isBlank()) {
//            throw new IllegalArgumentException("recipientEmail is required to send email.");
//        }
//
//        // Step 1: Get sender's energy profile
//        AssessmentResult result = resultRepo.findByUserId(request.getUserId())
//                .orElseThrow(() -> new RuntimeException("No assessment found for user."));
//
//        String energy = result.getDominantEnergy();
//
//        // Step 2: Rewrite email with Groq AI
//        String prompt = buildPrompt(energy, request.getRecipientName(), request.getEmailContent());
//        String rewrittenEmail = callGroq(prompt);
//
//        // Step 3: Build subject line
//        String subject = buildSubject(request.getEmailContent());
//
//        // Step 4: Send the rewritten email via SMTP
//        boolean sent = false;
//        String statusMessage;
//
//        try {
//            mailSenderService.sendEmail(
//                    request.getRecipientEmail(),
//                    request.getRecipientName(),
//                    subject,
//                    rewrittenEmail
//            );
//            sent = true;
//            statusMessage = "Email sent successfully to " + request.getRecipientEmail();
//            log.info("Email sent to {} (energy: {})", request.getRecipientEmail(), energy);
//
//        } catch (MessagingException e) {
//            statusMessage = "Email rewritten but could not be sent: " + e.getMessage();
//            log.error("Failed to send email to {}: {}", request.getRecipientEmail(), e.getMessage());
//        }
//
//        return new EmailResponse(rewrittenEmail, sent, statusMessage);
//    }
//
//    // ─────────────────────────────────────────────
//    // Groq AI call
//    // ─────────────────────────────────────────────
//    private String callGroq(String prompt) {
//        Map<String, Object> requestBody = Map.of(
//                "model", "llama-3.3-70b-versatile",
//                "messages", new Object[]{
//                        Map.of("role", "user", "content", prompt)
//                }
//        );
//
//        return webClient.post()
//                .uri(apiUrl)
//                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
//                .contentType(MediaType.APPLICATION_JSON)
//                .bodyValue(requestBody)
//                .retrieve()
//                .bodyToMono(Map.class)
//                .map(response -> {
//                    var choices = (List<Map<String, Object>>) response.get("choices");
//                    var message = (Map<String, Object>) choices.get(0).get("message");
//                    return message.get("content").toString();
//                })
//                .block();
//    }
//
//    // ─────────────────────────────────────────────
//    // Auto-generate subject from first line
//    // ─────────────────────────────────────────────
//    private String buildSubject(String emailContent) {
//        if (emailContent == null || emailContent.isBlank()) return "Follow-up";
//        String firstLine = emailContent.lines().findFirst().orElse("").trim();
//        if (firstLine.toLowerCase().startsWith("subject:")) {
//            return firstLine.substring(8).trim();
//        }
//        // Truncate long first lines
//        return firstLine.length() > 60 ? firstLine.substring(0, 57) + "..." : firstLine;
//    }
//
//    // ─────────────────────────────────────────────
//    // Prompt builder (unchanged from your original)
//    // ─────────────────────────────────────────────
//    private String buildPrompt(String energy, String name, String emailContent) {
//        String systemPrompt = """
//                You are a professional AI email assistant specialized in rewriting emails
//                based on personality communication styles.
//                Your goal is to improve clarity, tone, and effectiveness.
//                """;
//
//        String energyPrompt = getEnergyPrompt(energy);
//
//        String taskPrompt = """
//                Rewrite the following email addressed to %s.
//
//                Original Email:
//                %s
//                """.formatted(name, emailContent);
//
//        String outputRules = """
//                Rules:
//                - Keep the message intent unchanged
//                - Improve clarity and grammar
//                - Match the personality tone strictly
//                - Make it natural and human-like
//                - Do NOT add extra information
//                - Keep it concise
//                - Return ONLY the final email (no explanation)
//                """;
//
//        return systemPrompt + "\n\n" + energyPrompt + "\n\n" + taskPrompt + "\n\n" + outputRules;
//    }
//
//    private String getEnergyPrompt(String energy) {
//        return switch (energy) {
//            case "SUNSHINE_YELLOW" -> """
//                    Tone Style: Friendly, enthusiastic, expressive
//
//                    Guidelines:
//                    - Use warm and cheerful language
//                    - Add light emojis (1–2 max)
//                    - Keep it engaging and positive
//                    - Make the reader feel excited and valued
//                    """;
//            case "COOL_BLUE" -> """
//                    Tone Style: Professional, logical, structured
//
//                    Guidelines:
//                    - Use formal and precise language
//                    - Keep sentences well-structured
//                    - Avoid emojis
//                    - Focus on clarity and completeness
//                    """;
//            case "FIERY_RED" -> """
//                    Tone Style: Direct, assertive, action-oriented
//
//                    Guidelines:
//                    - Be concise and to the point
//                    - Use strong, confident language
//                    - Focus on outcomes and action
//                    - Avoid unnecessary politeness
//                    """;
//            case "EARTH_GREEN" -> """
//                    Tone Style: Calm, supportive, empathetic
//
//                    Guidelines:
//                    - Use polite and friendly language
//                    - Show understanding and patience
//                    - Keep tone soft and respectful
//                    - Encourage collaboration
//                    """;
//            default -> """
//                    Tone Style: Neutral professional
//
//                    Guidelines:
//                    - Keep it polite and clear
//                    - Maintain balance between formal and friendly
//                    """;
//        };
//    }
//}


//
//package com.insights.insights.service;
//
//import com.insights.insights.dto.EmailRequest;
//import com.insights.insights.dto.EmailResponse;
//import com.insights.insights.model.AssessmentResult;
//import com.insights.insights.model.User;
//import com.insights.insights.repository.AssessmentResultRepository;
//import com.insights.insights.repository.UserRepository;
//import jakarta.mail.MessagingException;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class EmailService {
//
//    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
//
//    @Autowired
//    private AssessmentResultRepository resultRepo;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private MailSenderService mailSenderService;
//
//    @Value("${groq.api.key}")
//    private String apiKey;
//
//    @Value("${groq.api.url}")
//    private String apiUrl;
//
//    private final WebClient webClient = WebClient.builder().build();
//
//    // ─── 1. Rewrite only ──────────────────────────────────────────────
//    public String analyzeEmail(EmailRequest request) {
////        AssessmentResult result = resultRepo.findByUserId(request.getUserId())
////                .orElseThrow(() -> new RuntimeException("No assessment found for user."));
//
//        User recipientUser = userRepository.findByEmail(request.getRecipientEmail())
//                .orElseThrow(() -> new RuntimeException("Recipient not found"));
//
//        AssessmentResult result = resultRepo.findByUserId(recipientUser.getId())
//                .orElseThrow(() -> new RuntimeException("Recipient assessment not found"));
//
////        String energy = result.getDominantEnergy();
//
//        System.out.println(request.getUserId() + request.getRecipientEmail() + result);
//
//        String energy = result.getDominantEnergy();
//        String prompt = buildPrompt(energy, request.getRecipientName(), request.getEmailContent());
//        return callGroq(prompt);
//    }
//
//    // ─── 2. Rewrite AND send ──────────────────────────────────────────
//    public EmailResponse analyzeAndSend(EmailRequest request) {
//
//        if (request.getRecipientEmail() == null || request.getRecipientEmail().isBlank()) {
//            throw new IllegalArgumentException("recipientEmail is required.");
//        }
//
//        // Get assessment to determine energy
////        AssessmentResult result = resultRepo.findByUserId(request.getUserId())
////                .orElseThrow(() -> new RuntimeException("No assessment found for user."));
//
//        User recipientUser = userRepository.findByEmail(request.getRecipientEmail())
//                .orElseThrow(() -> new RuntimeException("Recipient not found"));
//
//        AssessmentResult result = resultRepo.findByUserId(recipientUser.getId())
//                .orElseThrow(() -> new RuntimeException("Recipient assessment not found"));
//
////        String energy = result.getDominantEnergy();
//
//        String energy = result.getDominantEnergy();
//
//        // Lookup sender name + email from User table if not provided in request
//        String senderName  = request.getSenderName();
//        String senderEmail = request.getSenderEmail();
//
//        if ((senderName == null || senderName.isBlank()) ||
//                (senderEmail == null || senderEmail.isBlank())) {
//            try {
//                User user = userRepository.findById(request.getUserId())
//                        .orElse(null);
//                if (user != null) {
//                    if (senderName  == null || senderName.isBlank())  senderName  = user.getName();
//                    if (senderEmail == null || senderEmail.isBlank()) senderEmail = user.getEmail();
//                }
//            } catch (Exception e) {
//                log.warn("Could not look up user for sender info: {}", e.getMessage());
//            }
//        }
//
//        // Rewrite with Groq AI
//        String prompt = buildPrompt(energy, request.getRecipientName(), request.getEmailContent());
//        String rewrittenEmail = callGroq(prompt);
//
//        // Build subject
//        String subject = buildSubject(request.getEmailContent());
//        if (senderName != null && !senderName.isBlank()) {
//            subject = "[" + senderName + "] " + subject;
//        }
//
//        // Send via SMTP with sender branding
//        boolean sent = false;
//        String statusMessage;
//
//        try {
//            mailSenderService.sendEmail(
//                    request.getRecipientEmail(),
//                    request.getRecipientName(),
//                    subject,
//                    rewrittenEmail,
//                    senderName,
//                    senderEmail
//            );
//            sent = true;
//            statusMessage = "Email sent to " + request.getRecipientEmail()
//                    + " as \"" + (senderName != null ? senderName : "Insights") + " via Insights\"";
//            log.info("Email sent — from display: '{}', reply-to: {}, to: {}",
//                    senderName, senderEmail, request.getRecipientEmail());
//
//        } catch (MessagingException e) {
//            statusMessage = "Email rewritten but could not be sent: " + e.getMessage();
//            log.error("Send failed to {}: {}", request.getRecipientEmail(), e.getMessage());
//        }
//
//        return new EmailResponse(rewrittenEmail, sent, statusMessage);
//    }
//
//    // ─── Groq call ────────────────────────────────────────────────────
//    private String callGroq(String prompt) {
//        Map<String, Object> requestBody = Map.of(
//                "model", "llama-3.3-70b-versatile",
//                "messages", new Object[]{
//                        Map.of("role", "user", "content", prompt)
//                }
//        );
//
//        return webClient.post()
//                .uri(apiUrl)
//                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
//                .contentType(MediaType.APPLICATION_JSON)
//                .bodyValue(requestBody)
//                .retrieve()
//                .bodyToMono(Map.class)
//                .map(response -> {
//                    var choices = (List<Map<String, Object>>) response.get("choices");
//                    var message = (Map<String, Object>) choices.get(0).get("message");
//                    return message.get("content").toString();
//                })
//                .block();
//    }
//
//    // ─── Subject from first line ──────────────────────────────────────
//    private String buildSubject(String emailContent) {
//        if (emailContent == null || emailContent.isBlank()) return "Follow-up";
//        String firstLine = emailContent.lines().findFirst().orElse("").trim();
//        if (firstLine.toLowerCase().startsWith("subject:")) return firstLine.substring(8).trim();
//        return firstLine.length() > 60 ? firstLine.substring(0, 57) + "..." : firstLine;
//    }
//
//    // ─── Prompt builder ───────────────────────────────────────────────
//    private String buildPrompt(String energy, String name, String emailContent) {
//        String systemPrompt = """
//                You are a professional AI email assistant specialized in rewriting emails
//                based on personality communication styles.
//                Your goal is to improve clarity, tone, and effectiveness.
//                """;
//        String taskPrompt = """
//                Rewrite the following email addressed to %s.
//
//                Original Email:
//                %s
//                """.formatted(name, emailContent);
//        String outputRules = """
//                Rules:
//                - Keep the message intent unchanged
//                - Improve clarity and grammar
//                - Match the personality tone strictly
//                - Make it natural and human-like
//                - Do NOT add extra information
//                - Keep it concise
//                - Return ONLY the final email (no explanation)
//                """;
//        return systemPrompt + "\n\n" + getEnergyPrompt(energy) + "\n\n" + taskPrompt + "\n\n" + outputRules;
//    }
//
//private String getEnergyPrompt(String energy) {
//    return switch (energy) {
//        case "SUNSHINE_YELLOW" -> """
//                    Tone Style: Friendly, enthusiastic, expressive
//
//                    Guidelines:
//                    - Use warm and cheerful language
//                    - Add light emojis (1–2 max)
//                    - Keep it engaging and positive
//                    - Make the reader feel excited and valued
//                    """;
//        case "COOL_BLUE" -> """
//                    Tone Style: Professional, logical, structured
//
//                    Guidelines:
//                    - Use formal and precise language
//                    - Keep sentences well-structured
//                    - Avoid emojis
//                    - Focus on clarity and completeness
//                    """;
//        case "FIERY_RED" -> """
//                    Tone Style: Direct, assertive, action-oriented
//
//                    Guidelines:
//                    - Be concise and to the point
//                    - Use strong, confident language
//                    - Focus on outcomes and action
//                    - Avoid unnecessary politeness
//                    """;
//        case "EARTH_GREEN" -> """
//                    Tone Style: Calm, supportive, empathetic
//
//                    Guidelines:
//                    - Use polite and friendly language
//                    - Show understanding and patience
//                    - Keep tone soft and respectful
//                    - Encourage collaboration
//                    """;
//        default -> """
//                    Tone Style: Neutral professional
//
//                    Guidelines:
//                    - Keep it polite and clear
//                    - Maintain balance between formal and friendly
//                    """;
//    };
//}
//}


package com.insights.insights.service;

import com.insights.insights.dto.EmailRequest;
import com.insights.insights.dto.EmailResponse;
import com.insights.insights.model.AssessmentResult;
import com.insights.insights.model.User;
import com.insights.insights.repository.AssessmentResultRepository;
import com.insights.insights.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private AssessmentResultRepository resultRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailSenderService mailSenderService;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.builder().build();

    // ─── 1. Rewrite only ──────────────────────────────────────────────
    // Rewrites based on RECIPIENT's energy profile (looked up by recipientEmail)
    public String analyzeEmail(EmailRequest request) {
        String energy = resolveRecipientEnergy(request.getRecipientEmail());
        String prompt = buildPrompt(energy, request.getRecipientName(), request.getEmailContent());
        return callGroq(prompt);
    }

    // ─── 2. Rewrite AND send ──────────────────────────────────────────
    public EmailResponse analyzeAndSend(EmailRequest request) {

        if (request.getRecipientEmail() == null || request.getRecipientEmail().isBlank()) {
            throw new IllegalArgumentException("recipientEmail is required.");
        }

        // ── Rewrite based on RECIPIENT's energy ──────────────────────
        String recipientEnergy = resolveRecipientEnergy(request.getRecipientEmail());
        String prompt = buildPrompt(recipientEnergy, request.getRecipientName(), request.getEmailContent());
        String rewrittenEmail = callGroq(prompt);

        // ── Resolve sender name + email for From/Reply-To headers ────
        String senderName  = request.getSenderName();
        String senderEmail = request.getSenderEmail();

        if ((senderName == null || senderName.isBlank()) ||
                (senderEmail == null || senderEmail.isBlank())) {
            try {
                User sender = userRepository.findById(request.getUserId()).orElse(null);
                if (sender != null) {
                    if (senderName  == null || senderName.isBlank())  senderName  = sender.getName();
                    if (senderEmail == null || senderEmail.isBlank()) senderEmail = sender.getEmail();
                }
            } catch (Exception e) {
                log.warn("Could not look up sender info: {}", e.getMessage());
            }
        }

        // ── Build subject ─────────────────────────────────────────────
        String subject = buildSubject(request.getEmailContent());
        if (senderName != null && !senderName.isBlank()) {
            subject = "[" + senderName + "] " + subject;
        }

        // ── Send via SMTP ─────────────────────────────────────────────
        boolean sent = false;
        String statusMessage;

        try {
            mailSenderService.sendEmail(
                    request.getRecipientEmail(),
                    request.getRecipientName(),
                    subject,
                    rewrittenEmail,
                    senderName,
                    senderEmail
            );
            sent = true;
            statusMessage = "Email sent to " + request.getRecipientEmail()
                    + " as \"" + (senderName != null ? senderName : "Insights") + " via Insights\""
                    + " (rewritten for " + recipientEnergy.replace("_", " ") + " energy)";
            log.info("Email sent — recipient energy: {}, from: '{}', reply-to: {}, to: {}",
                    recipientEnergy, senderName, senderEmail, request.getRecipientEmail());

        } catch (MessagingException e) {
            statusMessage = "Email rewritten but could not be sent: " + e.getMessage();
            log.error("Send failed to {}: {}", request.getRecipientEmail(), e.getMessage());
        }

        return new EmailResponse(rewrittenEmail, sent, statusMessage);
    }

    // ─── Resolve recipient's dominant energy by their email ───────────
    // Looks up: recipientEmail → User → AssessmentResult → dominantEnergy
    // Falls back to "NEUTRAL" if recipient has no profile
    private String resolveRecipientEnergy(String recipientEmail) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            log.warn("No recipient email provided — using neutral tone");
            return "NEUTRAL";
        }
        try {
            User recipient = userRepository.findByEmail(recipientEmail)
                    .orElseThrow(() -> new RuntimeException("Recipient not registered: " + recipientEmail));

            AssessmentResult result = resultRepo.findByUserId(recipient.getId())
                    .orElseThrow(() -> new RuntimeException("Recipient has no assessment: " + recipientEmail));

            String energy = result.getDominantEnergy();
            log.info("Recipient {} energy resolved: {}", recipientEmail, energy);
            return energy;

        } catch (Exception e) {
            log.warn("Could not resolve recipient energy for {}: {} — using neutral tone",
                    recipientEmail, e.getMessage());
            return "NEUTRAL";
        }
    }

    // ─── Groq call ────────────────────────────────────────────────────
    private String callGroq(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", new Object[]{
                        Map.of("role", "user", "content", prompt)
                }
        );

        return webClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    var choices = (List<Map<String, Object>>) response.get("choices");
                    var message = (Map<String, Object>) choices.get(0).get("message");
                    return message.get("content").toString();
                })
                .block();
    }

    // ─── Subject from first line ──────────────────────────────────────
    private String buildSubject(String emailContent) {
        if (emailContent == null || emailContent.isBlank()) return "Follow-up";
        String firstLine = emailContent.lines().findFirst().orElse("").trim();
        if (firstLine.toLowerCase().startsWith("subject:")) return firstLine.substring(8).trim();
        return firstLine.length() > 60 ? firstLine.substring(0, 57) + "..." : firstLine;
    }

    // ─── Prompt builder ───────────────────────────────────────────────
    private String buildPrompt(String energy, String name, String emailContent) {
        String systemPrompt = """
                You are a professional AI email assistant specialized in rewriting emails
                based on the RECIPIENT's personality communication style.
                Your goal is to make the message land well with the specific person receiving it.
                """;
        String taskPrompt = """
                Rewrite the following email so it resonates with %s's communication style.

                Original Email:
                %s
                """.formatted(name, emailContent);
        String outputRules = """
                Rules:
                - Keep the original message intent completely unchanged
                - Adjust ONLY the tone, phrasing, and style to match the recipient
                - Make it natural and human-like
                - Do NOT add extra information
                - Keep it concise
                - Return ONLY the final email (no explanation, no subject line prefix)
                """;
        return systemPrompt + "\n\n" + getEnergyPrompt(energy) + "\n\n" + taskPrompt + "\n\n" + outputRules;
    }

    // ─── Energy tone instructions ─────────────────────────────────────
    private String getEnergyPrompt(String energy) {
        return switch (energy) {
            case "SUNSHINE_YELLOW" -> """
                    The recipient has SUNSHINE YELLOW energy — they are enthusiastic, social, and expressive.
                    Tone Style: Warm, cheerful, optimistic

                    Guidelines:
                    - Use engaging and upbeat language
                    - Add 1–2 light emojis where natural
                    - Make the recipient feel valued and excited
                    - Keep it friendly and personable
                    """;
            case "COOL_BLUE" -> """
                    The recipient has COOL BLUE energy — they are analytical, precise, and detail-oriented.
                    Tone Style: Professional, logical, structured

                    Guidelines:
                    - Use formal and precise language
                    - Keep sentences well-structured and clear
                    - Avoid emojis or informal expressions
                    - Focus on facts and completeness
                    """;
            case "FIERY_RED" -> """
                    The recipient has FIERY RED energy — they are direct, decisive, and results-focused.
                    Tone Style: Concise, assertive, action-oriented

                    Guidelines:
                    - Get straight to the point
                    - Use strong, confident language
                    - Focus on outcomes and next actions
                    - Avoid unnecessary pleasantries or padding
                    """;
            case "EARTH_GREEN" -> """
                    The recipient has EARTH GREEN energy — they value harmony, relationships, and collaboration.
                    Tone Style: Warm, considerate, empathetic

                    Guidelines:
                    - Use polite and caring language
                    - Acknowledge the recipient's feelings or situation
                    - Keep tone soft, patient, and collaborative
                    - Avoid anything that could sound demanding or abrupt
                    """;
            default -> """
                    Tone Style: Neutral professional

                    Guidelines:
                    - Keep it polite and clear
                    - Maintain a balance between formal and friendly
                    """;
        };
    }
}
