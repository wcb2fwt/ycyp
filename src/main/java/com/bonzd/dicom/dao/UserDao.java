package com.bonzd.dicom.dao;

import com.bonzd.dicom.entity.User;

import java.util.List;

public interface UserDao {

    void save(User user);
    User update(User user);
    List<User> findAll(int firstResult, int maxResults);
    Long count();
    User findById(long pkTBLUserID);
    User findByUsername(String username);
    User findByDeviceSerialNumber(String deviceSerialNumber);
    int updateHeaderUrl(Long userID, String headerUrl);
}
