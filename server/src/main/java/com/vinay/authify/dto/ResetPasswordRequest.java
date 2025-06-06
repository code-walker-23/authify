package com.vinay.authify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ResetPasswordRequest {
    @NotBlank(message = "New password is required")
    String newPassword;
    @NotBlank(message = "OTP is required")
    String otp;
    @NotBlank(message = "Email is required")
    String email;
}
