package com.bonzd.dicom;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import com.bonzd.dicom.component.ActiveDicoms;
import com.bonzd.dicom.handler.IncomingFileHandler;
import com.bonzd.dicom.server.DicomServer;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.*;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import com.google.common.eventbus.AsyncEventBus;
import com.google.common.eventbus.EventBus;


@SpringBootApplication
@Configuration
@EnableConfigurationProperties
@EnableJpaRepositories(basePackages = {"com.bonzd.dicom.dao"})
@PropertySource("classpath:application.properties")
public class DicomApplication {

    private static final Logger LOG = LoggerFactory.getLogger(DicomApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(DicomApplication.class, args);
    }

    @Bean //Guava asynch event bus that initiates 100 fixed thread pool
    public EventBus asyncEventBus() {
        EventBus eventBus = new AsyncEventBus(java.util.concurrent.Executors.newFixedThreadPool(100));
        return eventBus;
    }
    @Bean
    // only one incoming file handler. Even we have multiple DicomServer instances, they all forward files to the same handler...
    public IncomingFileHandler incomingFileHandler() {
        return new IncomingFileHandler();
    }
    @Bean
    //dicom server takes storage output directory, ae title and ports. Server listens same number of ports with same ae title
    public Map<String, DicomServer> dicomServers(@Value("${pacs.storage.dcm}") String storageDir, @Value("${pacs.aetitle}") String aeTitle, @Value("#{'${pacs.ports}'.split(',')}") List<Integer> ports) {
        Map<String, DicomServer> dicomServers = new HashMap<>();
        for (int port : ports) {
            dicomServers.put("DICOM_SERVER_AT_" + port, DicomServer.init(null, port, aeTitle, storageDir, asyncEventBus()));
        }
        return dicomServers;
    }
    @Bean
    @Qualifier(value = "activeDicoms")
    public ActiveDicoms activeDicoms() {
        return new ActiveDicoms();
    }
    @Bean //Creating and registering in spring context an entityManager
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(primaryDataSource());
        em.setPersistenceUnitName("dbdicom");
        em.setPackagesToScan(new String[]{"com.bonzd.dicom.entity"}); // package where are the @Entity classes are located, usually your domain package
        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter(); // JPA implementation
        em.setJpaVendorAdapter(vendorAdapter);
        return em;
    }
//    @Bean
//    @Primary //configure the primary database
//    @ConfigurationProperties(prefix = "spring.datasource")
//    public DataSource primaryDataSource() {
//        return DataSourceBuilder.create().build();
//    }
    @Bean
    @ConfigurationProperties("spring.datasource")
    public HikariDataSource primaryDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean //Configuring the transactionManager
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(emf);
        return transactionManager;
    }
    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }


}
