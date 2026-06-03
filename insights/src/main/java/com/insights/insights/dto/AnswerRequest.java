//package com.insights.insights.dto;
//
//import lombok.Data;
//
//@Data
//public class AnswerRequest {
//    private Long userId;
//    private Long questionId;
//    private int value;
//    private String type;
//}


package com.insights.insights.dto;

import lombok.Data;

@Data
public class AnswerRequest {

    private Long questionId;
    private int value;
    private String type; // MOST / LEAST / NORMAL
}