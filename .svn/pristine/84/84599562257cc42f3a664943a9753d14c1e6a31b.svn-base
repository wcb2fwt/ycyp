package com.bonzd.dicom.util;

import com.bonzd.dicom.entity.User;
import org.springframework.stereotype.Controller;

@Controller
public class HostHolder {
    private ThreadLocal<User> users = new ThreadLocal<>();

    public void setUsers(User user){
        users.set(user);
    }

    public User getUser(){
        return users.get();
    }

    public void clear(){
        users.remove();
    }
}
