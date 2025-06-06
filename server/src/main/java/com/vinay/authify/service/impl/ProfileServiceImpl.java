// keeping DTO-Entity Separate in Mapper
package com.vinay.authify.service.impl;

import com.vinay.authify.dto.ProfileRequest;
import com.vinay.authify.dto.ProfileResponse;
import com.vinay.authify.entity.UserEntity;
import com.vinay.authify.mapper.UserMapper;
import com.vinay.authify.repository.UserRepository;
import com.vinay.authify.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity user = userMapper.toEntity(request);
        if(!userRepository.existsByEmail(request.getEmail())){
            user = userRepository.save(user);
            return userMapper.toResponse(user);
        }

        throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already exists");

    }

    @Override
    public ProfileResponse getProfile(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found "+ email));
        return userMapper.toResponse(user);
    }
}
