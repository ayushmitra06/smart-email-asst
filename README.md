# Smart Email Assistant

A Gmail plugin (Chrome Extension) with a Spring Boot backend that auto-generates and inserts email replies in a single click, powered by the Gemini API.

<img width="372" height="57" alt="image" src="https://github.com/user-attachments/assets/fb3f8f8c-dc59-413f-a1c8-591ede3320a8" />

<img width="666" height="128" alt="image" src="https://github.com/user-attachments/assets/d3ce07fd-65c9-457d-927a-b08a5195eb6b" />

## Features

- Seamless Gmail integration via Chrome Extension
- On-demand, auto-generated email replies
- End-to-end flow: user action → backend processing → Gemini API call → reply insertion
- Lightweight, scalable Spring Boot backend
- Clear separation between frontend (Chrome Extension) and backend services

## Tech Stack

- Backend: Spring Boot, Spring Web
- Frontend: Chrome Extension (ReactJS)
- AI/Generation: Gemini API
- Build/Packaging: Maven/Gradle (your preference)
- Version Control: GitHub

## Architecture

- Chrome Extension UI/UX
  - Triggers a one-click request to generate a reply for the currently opened Gmail thread.
  - Communicates with the Spring Boot backend via REST calls.
  - Inserts the generated reply into the Gmail compose box.
- Spring Boot Backend
  - REST controller to receive requests from the Chrome Extension.
  - Service layer that calls Gemini API to generate the reply.
  - Endpoint responds with the generated content to the extension.
  - Security, error handling, and logging.
- Gemini API
  - Provides natural language generation to craft email responses.

## Getting Started

> Note: Adapt the commands to your environment (Maven/Gradle, Java version, etc.).

### Prerequisites

- Java 17+ (or as per your project)
- Maven or Gradle (based on your choice)
- Node.js/npm (for building the Chrome Extension, if needed)
- Gemini API credentials
- Gmail account with access to the target thread

## Setup

### Backend (Spring Boot)

1. Navigate to the backend directory
   ```
   cd backend
   ```
2. Configure environment variables or application properties
   - Gemini API key/endpoint
   - Any authentication/authorization settings for your backend
   - Cloud/hosting settings if you deploy remotely
3. Build and run
   - Maven:
     ```
     mvn clean package
     java -jar target/your-app.jar
     ```
   - Gradle:
     ```
     ./gradlew bootRun
     ```
4. Access the API (default example)
   - http://localhost:8080/api/generate-reply
   - Expected payload: JSON with thread/context and user input
5. Security (optional)
   - Enable authentication (JWT, OAuth2, or custom token)
   - Validate and sanitize inputs
   - Enable CORS for the extension to call the backend

### Frontend (Chrome Extension)

1. Navigate to the frontend directory
   ```
   cd frontend
   ```
2. Load the extension in Chrome:
   - Go to chrome://extensions
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `frontend` folder
3. Permissions
   - Ensure permissions include: "activeTab", "scripting", "https://mail.google.com/*"
4. Build/pack (if you have a build step)
   - If using a bundler, run your build script (e.g., npm run build)

## Contributing

- Fork the repository
- Create a feature branch
- Open a pull request with a description of changes
- Run tests and ensure no regressions

MIT License

Copyright (c) 2025 Ayush Mitra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

If you’d like, I can tailor this README to your exact project structure (e.g., specific package names, exact API endpoints, or your preferred build tool). Share any constraints or preferences (Gradle vs Maven, exact Gemini API integration details), and I’ll adjust the content accordingly.
