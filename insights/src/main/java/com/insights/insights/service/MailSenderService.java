//package com.insights.insights.service;
//
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//
//@Service
//public class MailSenderService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Value("${spring.mail.username}")
//    private String fromEmail;
//
//    /**
//     * Sends the AI-rewritten email to the recipient.
//     *
//     * @param toEmail       recipient's email address
//     * @param recipientName recipient's display name
//     * @param subject       email subject line
//     * @param body          the AI-rewritten email body (plain text)
//     */
//    public void sendEmail(String toEmail, String recipientName, String subject, String body)
//            throws MessagingException {
//
//        MimeMessage mimeMessage = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
//
//        helper.setFrom(fromEmail);
//        helper.setTo(toEmail);
//        helper.setSubject(subject);
//        helper.setText(body, false); // false = plain text, set true for HTML
//
//        mailSender.send(mimeMessage);
//    }
//
//    /**
//     * Sends an HTML email (optional use).
//     */
//    public void sendHtmlEmail(String toEmail, String subject, String htmlBody)
//            throws MessagingException {
//
//        MimeMessage mimeMessage = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
//
//        helper.setFrom(fromEmail);
//        helper.setTo(toEmail);
//        helper.setSubject(subject);
//        helper.setText(htmlBody, true); // true = HTML
//
//        mailSender.send(mimeMessage);
//    }
//}

//
//package com.insights.insights.service;
//
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.InternetAddress;
//import jakarta.mail.internet.MimeMessage;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//
//import java.io.UnsupportedEncodingException;
//
//@Service
//public class MailSenderService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Value("${spring.mail.username}")
//    private String smtpEmail;
//
//    @Value("${app.display.name:Insights Discovery}")
//    private String appDisplayName;
//
//    /**
//     * Sends the AI-rewritten email with proper sender branding.
//     *
//     * Gmail SMTP limitation: emails must be SENT from your authenticated Gmail.
//     * However, we set:
//     *   - From:     "Ayush via Insights <kumarayush24556@gmail.com>"
//     *   - Reply-To: "Ayush <236320015@gkv.ac.in>"   ← actual sender's email
//     *
//     * This way:
//     *   - The recipient sees "Ayush via Insights" as the sender name
//     *   - When they hit Reply, it goes to the real sender's email (236320015@gkv.ac.in)
//     *
//     * @param toEmail       recipient's email address
//     * @param recipientName recipient's display name
//     * @param subject       email subject line
//     * @param body          AI-rewritten email body (plain text)
//     * @param senderName    real sender's display name (e.g. "Ayush")
//     * @param senderEmail   real sender's email for Reply-To (e.g. "236320015@gkv.ac.in")
//     */
//    public void sendEmail(String toEmail,
//                          String recipientName,
//                          String subject,
//                          String body,
//                          String senderName,
//                          String senderEmail)
//            throws MessagingException {
//
//        MimeMessage mimeMessage = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
//
//        String displayName = (senderName != null && !senderName.isBlank())
//                ? senderName + " via " + appDisplayName
//                : appDisplayName;
//
//        try {
//            helper.setFrom(new InternetAddress(smtpEmail, displayName, "UTF-8"));
//        } catch (UnsupportedEncodingException e) {
//            helper.setFrom(smtpEmail);
//        }
//
//        if (senderEmail != null && !senderEmail.isBlank()) {
//            String replyName = (senderName != null && !senderName.isBlank()) ? senderName : senderEmail;
//            try {
//                helper.setReplyTo(new InternetAddress(senderEmail, replyName, "UTF-8"));
//            } catch (UnsupportedEncodingException e) {
//                helper.setReplyTo(senderEmail);
//            }
//        }
//
//        helper.setTo(toEmail);
//        helper.setSubject(subject);
//        helper.setText(body, false);
//
//        mailSender.send(mimeMessage);
//    }
//
//    public void sendEmail(String toEmail, String recipientName, String subject, String body)
//            throws MessagingException {
//        sendEmail(toEmail, recipientName, subject, body, null, null);
//    }
//}


package com.insights.insights.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class MailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String smtpEmail;   // The actual Gmail used for SMTP auth

    @Value("${app.display.name:Insights Discovery}")
    private String appDisplayName;  // Fallback display name if no sender provided

    /**
     * Sends the AI-rewritten email with proper sender branding.
     *
     * Gmail SMTP limitation: emails must be SENT from your authenticated Gmail.
     * However, we set:
     *   - From:     "Ayush via Insights <kumarayush24556@gmail.com>"
     *   - Reply-To: "Ayush <236320015@gkv.ac.in>"   ← actual sender's email
     *
     * This way:
     *   - The recipient sees "Ayush via Insights" as the sender name
     *   - When they hit Reply, it goes to the real sender's email (236320015@gkv.ac.in)
     *
     * @param toEmail       recipient's email address
     * @param recipientName recipient's display name
     * @param subject       email subject line
     * @param body          AI-rewritten email body (plain text)
     * @param senderName    real sender's display name (e.g. "Ayush")
     * @param senderEmail   real sender's email for Reply-To (e.g. "236320015@gkv.ac.in")
     */
    public void sendEmail(String toEmail,
                          String recipientName,
                          String subject,
                          String body,
                          String senderName,
                          String senderEmail)
            throws MessagingException {

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");

        // FROM: "Ayush via Insights <kumarayush24556@gmail.com>"
        // Gmail allows customising the display name even though the address is fixed
        String displayName = (senderName != null && !senderName.isBlank())
                ? senderName + " via " + appDisplayName
                : appDisplayName;

        try {
            helper.setFrom(new InternetAddress(smtpEmail, displayName, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            helper.setFrom(smtpEmail);  // fallback
        }

        // REPLY-TO: real sender's email — so replies go to them, not the Gmail account
        if (senderEmail != null && !senderEmail.isBlank()) {
            String replyName = (senderName != null && !senderName.isBlank()) ? senderName : senderEmail;
            try {
                helper.setReplyTo(new InternetAddress(senderEmail, replyName, "UTF-8"));
            } catch (UnsupportedEncodingException e) {
                helper.setReplyTo(senderEmail);
            }
        }

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body, false);

        mailSender.send(mimeMessage);
    }

    // Overload without sender info — uses app defaults
    public void sendEmail(String toEmail, String recipientName, String subject, String body)
            throws MessagingException {
        sendEmail(toEmail, recipientName, subject, body, null, null);
    }
}
