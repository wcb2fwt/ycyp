package com.bonzd.dicom.controller;

import com.bonzd.dicom.annotation.LoginRequired;
import com.bonzd.dicom.entity.User;
import com.bonzd.dicom.service.UserService;
import com.bonzd.dicom.util.HostHolder;
import com.bonzd.dicom.util.Utils;
import org.junit.platform.commons.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Controller
@RequestMapping("/user")
public class UserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private HostHolder hostHolder;
    @Autowired
    private UserService userService;
    @Value("${server.servlet.context-path}")
    private String contextPath;
    @Value("${community.path.domain}")
    private String domain;
    @Value("${community.path.upload}")
    private String uploadPath;

    //上传文件
    @LoginRequired
    @RequestMapping(path = "/upload",method = RequestMethod.POST)
    public String uploadHeader(@RequestParam("headerImage") MultipartFile headerImage, Model model){
        if (headerImage.isEmpty()){
            model.addAttribute("error", "您还没有选择图片！");
            return "redirect:/profile-edit";
        }
        String filename = headerImage.getOriginalFilename();
        String suffix = filename.substring(filename.lastIndexOf("."));
        if (StringUtils.isBlank(suffix)){
            model.addAttribute("error", "文件的格式不正确！");
            return "redirect:/profile-edit";
        }
        String s = Utils.generateUUID() + suffix;
        File dest = new File(uploadPath + "/" + s);
        try {
            headerImage.transferTo(dest);
        } catch (IOException e) {
            LOGGER.error("上传文件失败："+e.getMessage());
            throw new RuntimeException("上传文件失败，服务器发生异常",e);
        }
        User user = hostHolder.getUser();
        String headerUrl = domain + contextPath + "/bonzd/header/" + s;
        int i = userService.updateHeader(user.getPkTBLUserID(), headerUrl);
        return "redirect:/index";
    }


    @RequestMapping(path = "/updateUser",method = RequestMethod.POST)
    public String updateUser(User user,Model model){
        System.out.println("111111111"+user.getPkTBLUserID());
        System.out.println("22222222"+user.getUsername());
        System.out.println("333333333"+user.getEmail());
        System.out.println("444444444"+user.getName());
        System.out.println("555555555"+user.getOccupation());
        return "redirect:/profile-edit";
    }

}
