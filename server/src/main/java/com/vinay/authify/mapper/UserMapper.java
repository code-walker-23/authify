package com.vinay.authify.mapper;

import com.vinay.authify.dto.ProfileRequest;
import com.vinay.authify.dto.ProfileResponse;
import com.vinay.authify.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final PasswordEncoder passwordEncoder;

    public UserEntity toEntity(ProfileRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .userId(UUID.randomUUID().toString())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .verifyOtp(null)
                .verifyOtpExpiredAt(0L)
                .resetOtpExpiredAt(0L)
                .resetOtp(null)
                .build();
    }

    public ProfileResponse toResponse(UserEntity user) {
        return ProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getUserId())
                .isAccountVerified(user.isAccountVerified())
                .build();
    }
}
