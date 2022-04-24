package com.bonzd.dicom.dao;



import com.bonzd.dicom.entity.Patient;

import java.util.List;

public interface PatientDao {
    void save(Patient patient);
    Patient update(Patient patient);
    List<Patient> findAll(int firstResult, int maxResults);
    Long count();
    Patient findById(long pkTBLPatientID);
    Patient findByPatientID(String patientID);
    List<Patient> findByNumber(int firstResult, int maxResults, String number);
    List<Patient> findByNumber(String number);
    List<Patient> findByNumber(String number,String name);
    List<Patient> findByNumber(int firstResult, int maxResults,String number,String name);
}
