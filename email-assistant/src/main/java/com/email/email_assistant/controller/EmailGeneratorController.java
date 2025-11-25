package com.email.email_assistant.controller;

import com.email.email_assistant.dto.EmailRequest;
import com.email.email_assistant.service.EmailGeneratorService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest request) {
        String response = emailGeneratorService.generatedEmailReply(request);
        return ResponseEntity.ok(response);
    }
}
