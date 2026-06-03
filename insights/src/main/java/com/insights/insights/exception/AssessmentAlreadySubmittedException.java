package com.insights.insights.exception;

public class AssessmentAlreadySubmittedException extends RuntimeException {

    public AssessmentAlreadySubmittedException(String message) {
        super(message);
    }
}