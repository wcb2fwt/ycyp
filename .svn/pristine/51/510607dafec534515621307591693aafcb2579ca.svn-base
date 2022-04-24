package com.bonzd.dicom.service;

import com.bonzd.dicom.entity.LoginTicket;
import com.bonzd.dicom.entity.User;

import java.util.Map;

public interface UserService {

    User buildUser(User user);

    Map<String, Object> register(User user);

    Map<String,Object> login(String username,String password,int expiredSeconds);

    LoginTicket findByTicket(String ticket);

    User findById(Long userId);

    void logout(String ticket);

    int updateHeader(Long userID,String headerUrl);
}
