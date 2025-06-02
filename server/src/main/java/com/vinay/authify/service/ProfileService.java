package com.vinay.authify.service;

import com.vinay.authify.dto.ProfileRequest;
import com.vinay.authify.dto.ProfileResponse;

public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest request);
}
