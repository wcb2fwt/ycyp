package com.bonzd.dicom.handler;


import com.bonzd.dicom.component.ActiveDicoms;
import com.bonzd.dicom.event.NewFileEvent;
import com.bonzd.dicom.server.DicomReader;
import com.bonzd.dicom.service.DBService;
import com.google.common.eventbus.AllowConcurrentEvents;
import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;

public class IncomingFileHandler {
    private static final Logger LOG = LoggerFactory.getLogger(com.bonzd.dicom.handler.IncomingFileHandler.class);

    @Autowired(required = true)
    private EventBus eventBus;

    @Autowired
    private DBService dbService;

    @Autowired
    private ActiveDicoms activeDicoms;

    @Transactional
    @Subscribe
    @AllowConcurrentEvents
    public void handleIncomingFileEvent(NewFileEvent newFileEvent) {
        //IMPORTANT! Write everything inside try catch, the guava breaks if an exception occurs

        try{
            File file = newFileEvent.getFile();//get the file from event handler
            DicomReader reader = new DicomReader(file);

            //LOG.info("Active Dicoms:{} Received Patient Name:{} ID:{} Age:{} Sex:{} ", activeDicoms.toString(), reader.getPatientName(), reader.getPatientID(), reader.getPatientAge(), reader.getPatientSex());
            synchronized(dbService){
                dbService.buildEntities(reader);//lets build our dicom database entities
            }


        }catch(Exception e){
            LOG.error(e.getMessage());
        }
    }

    @PostConstruct
    public void postConstruct(){
        System.out.println("eventBus.register(this)");
        eventBus.register(this);
    }

    @PreDestroy
    public void preDestroy(){
        System.out.println("eventBus.unregister(this)");
        eventBus.unregister(this);
    }

    public void printStats(String status) {
        //String str = Thread.currentThread().getName().split("@@")[0];
        //Thread.currentThread().setName(String.valueOf(Thread.currentThread().getId()));
        LOG.info("{} {} {} [Active Threads: {}] ",Thread.currentThread().getId(), Thread.currentThread().getName(), status, Thread.activeCount());

    }
}
