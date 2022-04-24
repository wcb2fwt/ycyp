package com.bonzd.dicom.dao.impl;


import com.bonzd.dicom.dao.AbstractJpaDao;
import com.bonzd.dicom.dao.PatientDao;
import com.bonzd.dicom.entity.Patient;
import org.springframework.stereotype.Repository;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
public class PatientDaoImpl extends AbstractJpaDao<Patient> implements PatientDao {

    @PersistenceContext(unitName = "dbdicom")
    private EntityManager entityManager;

    public PatientDaoImpl(){
        super();
        setClazz(Patient.class);
    }

    /*@Transactional
	@Override
	public void save(Patient patient) {
		entityManager.persist(patient);
		entityManager.flush();
	}

	@Override
	public List<Patient> findAll() {

		try{
			TypedQuery<Patient> query = entityManager.createQuery("select p FROM Patient p", Patient.class);
			return query.getResultList();

		}catch(Exception e){
			return null;
		}
	}

	@Override
	public Patient findByID(long pkTBLPatientID) {
		try{
			return entityManager.find(Patient.class, pkTBLPatientID);

		}catch(Exception e){
			return null;
		}
	}*/

    @Override
    public Patient findByPatientID(String patientID) {
        try {
            return entityManager.createQuery("select p from Patient p where p.patientID LIKE :patientID",Patient.class)
                    .setParameter("patientID",patientID)
                    .getSingleResult();
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public List<Patient> findByNumber(int firstResult, int maxResults, String number) {
        try {
            return entityManager.createQuery("select p from Patient p where p.deviceSerialNumber LIKE :deviceSerialNumber order by p.modifiedDate desc",Patient.class)
                    .setParameter("deviceSerialNumber",number)
                    .setFirstResult((firstResult-1)*maxResults)
                    .setMaxResults(maxResults)
                    .getResultList();
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public List<Patient> findByNumber(String number) {
        try {
            return entityManager.createQuery("select p from Patient p where p.deviceSerialNumber LIKE :deviceSerialNumber order by p.modifiedDate desc",Patient.class)
                    .setParameter("deviceSerialNumber",number)
                    .getResultList();
        }catch (Exception e){
            return null;
        }
    }
    @Override
    public List<Patient> findByNumber(String number,String name) {
        try {
            return entityManager.createQuery("select p from Patient p where p.deviceSerialNumber LIKE :deviceSerialNumber and p.patientName LIKE :name order by p.modifiedDate desc",Patient.class)
                    .setParameter("deviceSerialNumber",number)
                    .setParameter("name",name)
                    .getResultList();
        }catch (Exception e){
            return null;
        }
    }

    @Override
    public List<Patient> findByNumber(int firstResult, int maxResults,String number, String name) {
        try {
            return entityManager.createQuery("select p from Patient p where p.deviceSerialNumber LIKE :deviceSerialNumber and p.patientName LIKE :name order by p.modifiedDate desc",Patient.class)
                    .setParameter("deviceSerialNumber",number)
                    .setParameter("name",name)
                    .setFirstResult((firstResult-1)*maxResults)
                    .setMaxResults(maxResults)
                    .getResultList();
        }catch (Exception e){
            return null;
        }
    }
}
