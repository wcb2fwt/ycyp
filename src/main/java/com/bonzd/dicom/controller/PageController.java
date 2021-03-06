package com.bonzd.dicom.controller;

import com.bonzd.dicom.annotation.LoginRequired;
import com.bonzd.dicom.entity.User;
import com.bonzd.dicom.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class PageController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PageController.class);

    @Autowired
    private UserService userService;

    @LoginRequired
    @RequestMapping(path = "/profile",method = RequestMethod.GET)
    public String getProfile1(){
        return "site/profile";
    }


    @LoginRequired
    @RequestMapping(path = "/profile-edit",method = RequestMethod.GET)
    public String getProfileEdit(){
        return "site/profile-edit";
    }

    @LoginRequired
    @RequestMapping(path = "/profile-activity",method = RequestMethod.GET)
    public String getProfileActivity(){
        return "site/profile-activity";
    }

    @LoginRequired
    @RequestMapping(path = "/blank",method = RequestMethod.GET)
    public String getBlank(){
        return "site/blank";
    }

}
