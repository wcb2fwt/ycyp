package com.bonzd.dicom.controller;

import com.bonzd.dicom.annotation.LoginRequired;
import com.bonzd.dicom.entity.User;
import com.bonzd.dicom.service.UserService;
import com.bonzd.dicom.util.CommunityConstant;
import com.bonzd.dicom.util.HostHolder;
import com.bonzd.dicom.util.Utils;
import com.google.code.kaptcha.Producer;
import org.junit.platform.commons.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.imageio.ImageIO;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

@Controller
public class LoginController implements CommunityConstant {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private Producer kaptchaProducer;
    @Value("${server.servlet.context-path}")
    private String contextPath;
    @Autowired
    private HostHolder hostHolder;



    @RequestMapping(path = "/login",method = RequestMethod.GET)
    public String getLoginPage(){
        return "login/login";
    }

    @RequestMapping(path = "/register",method = RequestMethod.GET)
    public String getRegisterPage(){
        return "login/register";
    }

    @LoginRequired
    @RequestMapping(path = "/index",method = RequestMethod.GET)
    public String getIndexPage(){
        return "site/index";
    }


    //用户注册
    @RequestMapping(path = "/register",method = RequestMethod.POST)
    public String register(Model model, User user){

        Map<String, Object> map = userService.register(user);
        if (map==null || map.isEmpty()){
            model.addAttribute("msg", "注册成功!");
            model.addAttribute("target", "/index");
            return "login/login";
        }else {
            model.addAttribute("usernameMsg", map.get("usernameMsg"));
            model.addAttribute("passwordMsg", map.get("passwordMsg"));
            model.addAttribute("numberMsg", map.get("numberMsg"));
            return "login/register";
        }
    }

    //用户登录
    @RequestMapping(path = "/login",method = RequestMethod.POST)
    public String login(String username, String password, String code, boolean rememberme,
                        Model model, HttpServletRequest request, HttpServletResponse response){
        //从session中获取验证码
        String kaptcha = (String) request.getSession().getAttribute("kaptcha");
        if (StringUtils.isBlank(username)){
            model.addAttribute("usernameMsg", "账号不能为空！");
            return "login/login";
        }
        if (StringUtils.isBlank(password)){
            model.addAttribute("passwordMsg", "密码不能为空！");
            return "login/login";
        }
        if (StringUtils.isBlank(kaptcha) || StringUtils.isBlank(code) || !kaptcha.equalsIgnoreCase(code)){
            model.addAttribute("codeMsg", "验证码不正确！");
            return "login/login";
        }
        //检查账号、密码
        int expiredSeconds = rememberme ? REMEMBER_EXPIRED_SECONDS : DEFAULT_EXPIRED_SECONDS;
        Map<String, Object> map = userService.login(username, password, expiredSeconds);
        if (map.containsKey("ticket")){
            Cookie cookie = new Cookie("ticket", map.get("ticket").toString());
            cookie.setPath(contextPath);
            cookie.setMaxAge(expiredSeconds);
            response.addCookie(cookie);
            hostHolder.setUsers((User) map.get("user"));
            return "redirect:/index";

        }else {
            model.addAttribute("usernameMsg", map.get("usernameMsg"));
            model.addAttribute("passwordMsg", map.get("passwordMsg"));
            return "login/login";
        }
    }
    //生成验证码
    @RequestMapping(path = "/kaptcha",method = RequestMethod.GET)
    public void getKaptcha(HttpServletResponse response , HttpSession session){
        //生成验证码
        String text = kaptchaProducer.createText();
        BufferedImage image = kaptchaProducer.createImage(text);
        //将验证码存入session
        session.setAttribute("kaptcha", text);
        //验证码的归属
        String kaptchaOwner = Utils.generateUUID();
        Cookie cookie = new Cookie("kaptchaOwner",kaptchaOwner);
        //设置cookie的生存时间
        cookie.setMaxAge(60);
        //设置cookie的有效路径
        cookie.setPath(contextPath);
        //将cookie发送给客户端
        response.addCookie(cookie);
        //将图片输出给浏览器
        response.setContentType("image/png");
        try {
            OutputStream os = response.getOutputStream();
            ImageIO.write(image, "png", os);
        } catch (IOException e) {
            LOGGER.error("响应验证码失败："+e.getMessage());
        }
    }

    //退出登录
    @RequestMapping(path = "/logout",method = RequestMethod.GET)
    public String logout(@CookieValue("ticket") String ticket){
        userService.logout(ticket);
        return "redirect:/login";
    }
}
