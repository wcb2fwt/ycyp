package com.bonzd.dicom.dao.impl;


import com.bonzd.dicom.dao.AbstractJpaDao;
import com.bonzd.dicom.dao.SeriesDao;
import com.bonzd.dicom.entity.Series;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class SeriesDaoImpl extends AbstractJpaDao<Series> implements SeriesDao {

    @PersistenceContext(unitName = "dbdicom")
    private EntityManager entityManager;

    public SeriesDaoImpl(){
        super();
        setClazz(Series.class);
    }

    @Override
    public List<Series> findByPkTBLStudyID(Long pkTBLStudyID) {
        try{
            return entityManager.createQuery("select sr from Series sr  where sr.study.pkTBLStudyID = :pkTBLStudyID", Series.class)
                    .setParameter("pkTBLStudyID", pkTBLStudyID)
                    .getResultList();
        }catch(Exception e){
            return null;
        }
    }

    @Override
    public synchronized Series findBySeriesInstanceUID(String seriesInstanceUID) {
        try{
            return entityManager.createQuery("select sr from Series sr  where sr.seriesInstanceUID = :seriesInstanceUID", Series.class)
                    .setParameter("seriesInstanceUID", seriesInstanceUID)
                    .getSingleResult();
        }catch(Exception e){
            return null;
        }
    }

    @Override
    public Series findBySeriesInstanceUID(String seriesInstanceUID, Integer seriesNumber) {
        try{
            return entityManager.createQuery("select sr from Series sr  where sr.seriesNumber = :seriesNumber AND sr.seriesInstanceUID = :seriesInstanceUID", Series.class)
                    .setParameter("seriesInstanceUID", seriesInstanceUID)
                    .setParameter("seriesNumber", seriesNumber)
                    .getSingleResult();
        }catch(Exception e){
            return null;
        }
    }

    @Override
    public List<Series> findAllByPkTBLPatientID(Long pkTBLPatientID) {
        try{
            return entityManager.createQuery("select sr from Series sr LEFT OUTER JOIN sr.study st " +
                    "LEFT OUTER JOIN sr.study.patient p " +
                    "where p.pkTBLPatientID = :pkTBLPatientID", Series.class)
                    .setParameter("pkTBLPatientID", pkTBLPatientID)
                    .getResultList();

        }catch(Exception e){
            return null;
        }
    }
}
