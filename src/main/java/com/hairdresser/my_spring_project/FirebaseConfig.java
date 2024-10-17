package com.hairdresser.my_spring_project;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Configuration
public class FirebaseConfig {

    @Value("${FIREBASE_PROJECT_ID}")
    private String projectId;

    @Value("${FIREBASE_PRIVATE_KEY}")
    private String privateKey;

    @Value("${FIREBASE_CLIENT_EMAIL}")
    private String clientEmail;

    @PostConstruct
    public void initialize() {
        try {
            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(ServiceAccountCredentials.fromPkcs8(null, clientEmail, privateKey, null, Collections.emptyList()))
                    .setProjectId(projectId)
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("Firebase initialized successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
