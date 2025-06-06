package com.vinay.authify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String name){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Our Platform");
        message.setText("Hello " + name + ",\n\nThanks for registering with us!\n\nRegards,\nAuthify Team");
        javaMailSender.send(message);
    }

    public void sendResetOtp(String toEmail, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your Password Reset OTP - Authify");

        String body = String.format(
                "Dear user,\n\n" +
                        "We received a request to reset your password.\n\n" +
                        "Your One-Time Password (OTP) is: %s\n\n" +
                        "This OTP is valid for 15 minutes. Please do not share it with anyone.\n\n" +
                        "If you did not request a password reset, please ignore this email or contact support immediately.\n\n" +
                        "Best regards,\n" +
                        "Authify Security Team",
                otp
        );

        message.setText(body);
        javaMailSender.send(message);
    }

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your OTP Code - Authify");

        String body = String.format(
                "Hello,\n\n" +
                        "Your OTP code is: %s\n\n" +
                        "Please use this code to complete your verification. It will expire in 24 hours.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Thanks,\n" +
                        "Authify Team",
                otp
        );

        message.setText(body);
        javaMailSender.send(message);
    }

}
