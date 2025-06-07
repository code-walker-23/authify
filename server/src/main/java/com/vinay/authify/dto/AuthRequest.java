package com.vinay.authify.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthRequest {

    @NotNull(message = "Email should not be empty")
    @Email(message = "Enter a valid email address")
    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$",
            message = "Enter a valid email address"
    )
    private String email;

    @NotBlank(message = "Password should not be empty")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
