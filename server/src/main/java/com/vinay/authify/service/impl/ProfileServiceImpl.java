// keeping DTO-Entity Separate in Mapper
package com.vinay.authify.service.impl;

import com.vinay.authify.dto.ProfileRequest;
import com.vinay.authify.dto.ProfileResponse;
import com.vinay.authify.entity.UserEntity;
import com.vinay.authify.mapper.UserMapper;
import com.vinay.authify.repository.UserRepository;
import com.vinay.authify.service.EmailService;
import com.vinay.authify.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

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

    @Override
    public void sendResetOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with " + email));

        // Generating 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000,1000000));

        // Expiry time 15 min in miliseconds
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);

        // update the user profile
        existingUser.setResetOtp(otp);
        existingUser.setResetOtpExpiredAt(expiryTime);

        // save into the database
        userRepository.save(existingUser);

        try {
            emailService.sendResetOtp(existingUser.getEmail(), otp);
        }catch(Exception ex){
            throw new RuntimeException("Unable to send email");
        }

    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getResetOtp() == null || !otp.equals(existingUser.getResetOtp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
        }

        if (existingUser.getResetOtpExpiredAt() < System.currentTimeMillis()) {
            throw new ResponseStatusException(HttpStatus.GONE, "OTP has expired");
        }

        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpiredAt(0L);

        userRepository.save(existingUser);
    }

    @Override
    public void sendOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found "+ email));

        if(existingUser.isAccountVerified()){
            return;
        }

        // Generating 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000,1000000));

        // Expiry time 24 hour in miliseconds
        long expiryTime = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpiredAt(expiryTime);

        // save to the database
        userRepository.save(existingUser);

        //sending mail
        try {
            emailService.sendOtpEmail(email, otp);
        }catch(Exception ex){
            throw new RuntimeException("Unable to send email");
        }

    }

    @Override
    public void verifyOtp(String email, String otp) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (user.getVerifyOtp() == null || !user.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getVerifyOtpExpiredAt() == null || user.getVerifyOtpExpiredAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP expired");
        }

        user.setAccountVerified(true);
        user.setVerifyOtp(null);
        user.setVerifyOtpExpiredAt(0L);

        userRepository.save(user);
    }
}
