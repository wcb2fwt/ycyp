package com.bonzd.dicom.dao;

import com.bonzd.dicom.entity.LoginTicket;

public interface LoginTicketDao {
    void save(LoginTicket loginTicket);
    LoginTicket findByTicket(String ticket);
    int updateStatus(String ticket, int i);
}
