package com.bonzd.dicom.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "tbl_loginticket")
@JsonIdentityInfo(generator= ObjectIdGenerators.IntSequenceGenerator.class, property="@pkTBLLoginID")
public class LoginTicket implements Serializable {

    private static final long serialVersionUID = -4368789097670784782L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="pkTBLLoginID")
    private Long pkTBLLoginID;

    @Column(name="userId")
    private Long userId;

    @Column(name="ticket", length=100)
    private String ticket;

    @Column(name="status")
    private int status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="expired", insertable = true, updatable=true)
    private Date expired;

    public LoginTicket() {
        super();
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Long getPkTBLLoginID() {
        return pkTBLLoginID;
    }

    public void setPkTBLLoginID(Long pkTBLLoginID) {
        this.pkTBLLoginID = pkTBLLoginID;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTicket() {
        return ticket;
    }

    public void setTicket(String ticket) {
        this.ticket = ticket;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Date getExpired() {
        return expired;
    }

    public void setExpired(Date expired) {
        this.expired = expired;
    }


    @Override
    public String toString() {
        return "LoginTicket{" +
                "pkTBLLoginID=" + pkTBLLoginID +
                ", userId=" + userId +
                ", ticket='" + ticket + '\'' +
                ", status=" + status +
                ", expired=" + expired +
                '}';
    }
}
