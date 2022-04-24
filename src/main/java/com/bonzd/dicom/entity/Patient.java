package com.bonzd.dicom.entity;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import javax.persistence.*;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

/**
 *患者类
 */
@Entity
@Table(name = "tbl_patient")
@JsonIdentityInfo(generator= ObjectIdGenerators.IntSequenceGenerator.class, property="@pkTBLPatientID")
public class Patient implements Serializable {

    private static final long serialVersionUID = 657390142518153080L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="pkTBLPatientID")
    private Long pkTBLPatientID;



    @Column(name="patientID", length=100)
    private String patientID;

    @Column(name="patientName", length=100)
    private String patientName;

    @Column(name="deviceSerialNumber", length=100)
    private String deviceSerialNumber;

    @Column(name="patientSex", length=10)
    private String patientSex;

    @Temporal(TemporalType.DATE)
    @Column(name="patientBirthday")
    private Date patientBirthday;

    @Column(name="patientAge", length=10)
    private String patientAge;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="createdDate", updatable = false, insertable=true)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="modifiedDate", insertable = true, updatable=true)
    private Date modifiedDate;

    @OneToMany(mappedBy = "patient")
    private Collection<Study> study;

    public Patient() {
        super();
    }

    public Long getPkTBLPatientID() {
        return this.pkTBLPatientID;
    }

    public void setPkTBLPatientID(Long pkTBLPatientID) {
        this.pkTBLPatientID = pkTBLPatientID;
    }

    public String getPatientID() {
        return this.patientID;
    }

    public void setPatientID(String patientID) {
        this.patientID = patientID;
    }

    public String getPatientName() {
        return this.patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientSex() {
        return this.patientSex;
    }

    public void setPatientSex(String patientSex) {
        this.patientSex = patientSex;
    }

    public Date getPatientBirthday() {
        return patientBirthday;
    }

    public void setPatientBirthday(Date patientBirthday) {
        this.patientBirthday = patientBirthday;
    }

    public String getPatientAge() {
        return this.patientAge;
    }

    public String getDeviceSerialNumber() {
        return deviceSerialNumber;
    }

    public void setDeviceSerialNumber(String deviceSerialNumber) {
        this.deviceSerialNumber = deviceSerialNumber;
    }

    public void setPatientAge(String patientAge) {
        this.patientAge = patientAge;
    }

    public Date getCreatedDate() {
        return this.createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getModifiedDate() {
        return this.modifiedDate;
    }

    public void setModifiedDate(Date modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    @PreUpdate
    @PrePersist
    public void updateTimeStamps() {
        modifiedDate = new Date();
        if (createdDate==null) {
            createdDate = new Date();
        }
    }

    public Collection<Study> getStudy() {
        return study;
    }

    public void setStudy(Collection<Study> param) {
        this.study = param;
    }

    @Override
    public String toString() {
        return "Patient{" +
                "pkTBLPatientID=" + pkTBLPatientID +
                ", patientID='" + patientID + '\'' +
                ", patientName='" + patientName + '\'' +
                ", deviceSerialNumber='" + deviceSerialNumber + '\'' +
                ", patientSex='" + patientSex + '\'' +
                ", patientBirthday=" + patientBirthday +
                ", patientAge='" + patientAge + '\'' +
                ", createdDate=" + createdDate +
                ", modifiedDate=" + modifiedDate +
                ", study=" + study +
                '}';
    }
}
