//package com.insights.insights.dto;
//
//import lombok.Data;
//
//@Data
//public class EmailRequest {
//
//    private Long userId;
//    private String recipientName;
//    private String recipientEnergy;
//    private String emailContent;
//}


//package com.insights.insights.dto;
//
//public class EmailRequest {
//
//    private Long userId;
//    private String recipientName;
//    private String recipientEmail;   // ← NEW: actual email address to send to
//    private String emailContent;
//
//    public EmailRequest() {}
//
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//
//    public String getRecipientName() { return recipientName; }
//    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
//
//    public String getRecipientEmail() { return recipientEmail; }
//    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
//
//    public String getEmailContent() { return emailContent; }
//    public void setEmailContent(String emailContent) { this.emailContent = emailContent; }
//}

//
//package com.insights.insights.dto;
//
//public class EmailRequest {
//
//    private Long userId;
//    private String senderName;        // ← NEW: actual sender's display name
//    private String senderEmail;       // ← NEW: actual sender's email (set as Reply-To)
//    private String recipientName;
//    private String recipientEmail;
//    private String emailContent;
//
//    public EmailRequest() {}
//
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//
//    public String getSenderName() { return senderName; }
//    public void setSenderName(String senderName) { this.senderName = senderName; }
//
//    public String getSenderEmail() { return senderEmail; }
//    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
//
//    public String getRecipientName() { return recipientName; }
//    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
//
//    public String getRecipientEmail() { return recipientEmail; }
//    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
//
//    public String getEmailContent() { return emailContent; }
//    public void setEmailContent(String emailContent) { this.emailContent = emailContent; }
//}


package com.insights.insights.dto;

public class EmailRequest {

    private Long userId;
    private String senderName;        // ← NEW: actual sender's display name
    private String senderEmail;       // ← NEW: actual sender's email (set as Reply-To)
    private String recipientName;
    private String recipientEmail;
    private String emailContent;

    public EmailRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getEmailContent() { return emailContent; }
    public void setEmailContent(String emailContent) { this.emailContent = emailContent; }
}
