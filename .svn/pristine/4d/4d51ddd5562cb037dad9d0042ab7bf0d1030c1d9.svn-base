package com.bonzd.dicom.dao.impl;

import com.bonzd.dicom.dao.AbstractJpaDao;
import com.bonzd.dicom.dao.LoginTicketDao;
import com.bonzd.dicom.entity.LoginTicket;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class LoginTicketDaoImpl extends AbstractJpaDao<LoginTicket> implements LoginTicketDao {

    @PersistenceContext(unitName = "dbdicom")
    private EntityManager entityManager;

    public LoginTicketDaoImpl(){
        super();
        setClazz(LoginTicket.class);
    }

    @Override
    public LoginTicket findByTicket(String ticket) {
        try {
            return entityManager.createQuery("select p from LoginTicket p where p.ticket LIKE :ticket", LoginTicket.class)
                    .setParameter("ticket",ticket)
                    .getSingleResult();
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public int updateStatus(String ticket, int status) {
        return entityManager.createQuery("update LoginTicket set status = :status where ticket = :ticket")
            .setParameter("ticket",ticket)
            .setParameter("status",status).executeUpdate();
    }
}
