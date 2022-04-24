package com.bonzd.dicom.dao.impl;


import com.bonzd.dicom.dao.AbstractJpaDao;
import com.bonzd.dicom.dao.StudyDao;
import com.bonzd.dicom.entity.Study;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class StudyDaoImpl extends AbstractJpaDao<Study> implements StudyDao {

    @PersistenceContext(unitName = "dbdicom")
    private EntityManager entityManager;

    public StudyDaoImpl(){
        super();
        setClazz(Study.class);
    }

    @Override
    public List<Study> findByPkTBLPatientID(Long pkTBLPatientID) {
        try {
            return entityManager.createQuery("select s from Study s where s.patient.pkTBLPatientID = :pkTBLPatientID",Study.class)
                    .setParameter("pkTBLPatientID",pkTBLPatientID)
                    .getResultList();
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public Study findByStudyInstanceUID(String studyInstanceUID) {
        try {
            return entityManager.createQuery("select s from Study s where s.studyInstanceUID = :studyInstanceUID",Study.class)
                    .setParameter("studyInstanceUID",studyInstanceUID)
                    .getSingleResult();
        }catch (Exception e){
            return null;
        }
    }
}
