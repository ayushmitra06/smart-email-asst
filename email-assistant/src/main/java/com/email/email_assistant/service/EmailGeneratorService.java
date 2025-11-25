package com.email.email_assistant.service;

import com.email.email_assistant.dto.EmailRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String GEMINI_API_URL;
    @Value("${gemini.api.key}")
    private String API_KEY;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generatedEmailReply(EmailRequest request) {
        //build the prompt
        String prompt = buildPrompt(request);

        //craft a request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        //do request and response
        String response = webClient.post()
                .uri(GEMINI_API_URL + API_KEY)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        //Extract response and return
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .get("text")
                    .asText();
        }
        catch (Exception e){
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest request) {
        String tone = (request.getTone() != null && !request.getTone().isBlank())
                ? request.getTone().trim()
                : "professional";

        String recipient = (request.getRecipientName() != null && !request.getRecipientName().isBlank())
                ? request.getRecipientName().trim()
                : "there";

        StringBuilder prompt = new StringBuilder();
        prompt.append(
                "Return only the final email body as plain text. " +
                        "Do not include a subject line, headings, bullet points, numbering, quotes, code blocks, markdown, links, or any extra commentary. " +
                        "Do not repeat or paste the original email. Do not add placeholders. Do not wrap in quotes. " +
                        "Your response must start with 'Hi " + recipient + ",'. " +   // FIXED: explicitly use recipient name
                        "and must end with a line that is exactly 'Regards,'. "
        );
        prompt.append("Use a ").append(tone).append(" tone. ");
        prompt.append(
                "Keep the body concise (3–6 sentences).\n\n" +
                        "Format requirements:\n" +
                        "- Line 1: Hi " + recipient + ",\n" +
                        "- Line 2: blank\n" +
                        "- Lines 3–?: 3–6 sentences forming the reply\n" +
                        "- Next line: blank\n" +
                        "- Next line: Regards,\n\n" +
                        "Base the reply strictly on the original email below.\n\n" +
                        "Original email:\n"
        );
        prompt.append(request.getEmailContent() == null ? "" : request.getEmailContent().trim());
        return prompt.toString();
    }

}
