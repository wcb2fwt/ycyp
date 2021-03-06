package com.bonzd.dicom.service.impl;

import com.bonzd.dicom.dao.LoginTicketDao;
import com.bonzd.dicom.dao.UserDao;
import com.bonzd.dicom.entity.LoginTicket;
import com.bonzd.dicom.entity.User;
import com.bonzd.dicom.service.UserService;
import com.bonzd.dicom.util.Utils;
import org.junit.platform.commons.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;
    @Autowired
    LoginTicketDao loginTicketDao;


    @Override
    public User buildUser(User user) {
        return null;
    }

    @Override
    public Map<String, Object> register(User user) {
        HashMap<String,Object> map = new HashMap<>();
        if (user == null){
            throw new IllegalArgumentException("参数不能为空！");
        }
        if (StringUtils.isBlank(user.getUsername())){
            map.put("usernameMsg","账号不能为空！");
            return map;
        }
        if (StringUtils.isBlank(user.getPassword())){
            map.put("passwordMsg","密码不能为空！");
            return map;
        }
        if (StringUtils.isBlank(user.getDeviceSerialNumber())){
            map.put("numberMsg","序列号不能为空！");
            return map;
        }
        User un = userDao.findByUsername(user.getUsername());

        if (un != null){
            map.put("usernameMsg","该账号已存在！");
            return map;
        }
        un = userDao.findByDeviceSerialNumber(user.getDeviceSerialNumber());
        if (un != null){
            map.put("numberMsg","该序列号已注册！");
            return map;
        }
        //注册用户
        user.setSalt(Utils.generateUUID().substring(0,5));//获取随机5字符串
        user.setPassword(Utils.md5(user.getPassword()+user.getSalt()));
        user.setStatus(1);
        user.setHeaderUrl(String.format("http://images.nowcoder.com/head/%dt.png", new Random().nextInt(1000)));
        user.setCreatedDate(new Date());
        userDao.save(user);
        return map;
    }

    @Override
    public Map<String, Object> login(String username, String password, int expiredSeconds) {
        Map<String,Object> map = new HashMap<>();
        if (StringUtils.isBlank(username)){
            map.put("usernameMsg", "账号不能为空！");
            return map;
        }
        if (StringUtils.isBlank(password)){
            map.put("passwordMsg", "密码不能为空！");
            return map;
        }
        //验证账号
        User user = userDao.findByUsername(username);
        if (user == null){
            map.put("usernameMsg", "该账号不存在！");
            return map;
        }
        if (user.getStatus() == 0){
            map.put("usernameMsg", "该账号未激活！");
            return map;
        }
        //验证密码
        password = Utils.md5(password+user.getSalt());
        if (!user.getPassword().equals(password)){
            map.put("passwordMsg", "密码不正确！");
            return map;
        }
        //生成登录凭证
        LoginTicket loginTicket = new LoginTicket();
        loginTicket.setUserId(user.getPkTBLUserID());
        loginTicket.setTicket(Utils.generateUUID());
        loginTicket.setStatus(0);
        loginTicket.setExpired(new Date(System.currentTimeMillis() + expiredSeconds * 1000));
        loginTicketDao.save(loginTicket);
        map.put("ticket", loginTicket.getTicket());
        map.put("user",user);
        return map;
    }

    @Override
    public LoginTicket findByTicket(String ticket) {
        return loginTicketDao.findByTicket(ticket);
    }

    @Override
    public User findById(Long userId) {
        return userDao.findById(userId);
    }

    @Transactional
    @Override
    public void logout(String ticket) {
        loginTicketDao.updateStatus(ticket, 1);
    }

    @Transactional
    @Override
    public int updateHeader(Long userID, String headerUrl) {
        return userDao.updateHeaderUrl(userID,headerUrl);
    }


}
