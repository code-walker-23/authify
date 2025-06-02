package com.vinay.authify.mapper;

import com.vinay.authify.dto.ProfileRequest;
import com.vinay.authify.dto.ProfileResponse;
import com.vinay.authify.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserMapper {

    public UserEntity toEntity(ProfileRequest request) {
        return UserEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .userId(UUID.randomUUID().toString())
                .password(request.getPassword())
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
