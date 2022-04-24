package com.bonzd.dicom.dao.impl;

import com.bonzd.dicom.dao.AbstractJpaDao;
import com.bonzd.dicom.dao.UserDao;
import com.bonzd.dicom.entity.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Repository
public class UserDaoImpl extends AbstractJpaDao<User> implements UserDao {

    @PersistenceContext(unitName = "dbdicom")
    private EntityManager entityManager;

    public UserDaoImpl(){
        super();
        setClazz(User.class);
    }



    @Override
    public User findByUsername(String username) {
        try {
            return entityManager.createQuery("select p from User p where p.username LIKE :username", User.class)
                    .setParameter("username",username)
                    .getSingleResult();
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public User findByDeviceSerialNumber(String deviceSerialNumber) {
        try {
            return entityManager.createQuery("select p from User p where p.deviceSerialNumber LIKE :deviceSerialNumber", User.class)
                    .setParameter("deviceSerialNumber",deviceSerialNumber)
                    .getSingleResult();
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public int updateHeaderUrl(Long userID, String headerUrl) {
        return entityManager.createQuery("update User p set p.headerUrl = :headerUrl where p.pkTBLUserID = :userID")
                .setParameter("headerUrl",headerUrl)
                .setParameter("userID",userID)
                .executeUpdate();

    }
}
