// keeping DTO-Entity Separate in Mapper
package com.vinay.authify.service.impl;

import com.vinay.authify.dto.ProfileRequest;
import com.vinay.authify.dto.ProfileResponse;
import com.vinay.authify.entity.UserEntity;
import com.vinay.authify.mapper.UserMapper;
import com.vinay.authify.repository.UserRepository;
import com.vinay.authify.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity user = userMapper.toEntity(request);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
}
