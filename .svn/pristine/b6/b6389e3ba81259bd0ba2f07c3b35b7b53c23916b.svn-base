package com.bonzd.dicom;

import javax.transaction.Transactional;

import com.bonzd.dicom.dao.EquipmentDao;
import com.bonzd.dicom.entity.Equipment;
import junit.framework.TestCase;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@Ignore
@Transactional
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@SpringBootTest
public class EquipmentTest extends TestCase {

    private static final Logger LOG = LoggerFactory.getLogger(EquipmentTest.class);

    @Autowired
    EquipmentDao equipmentDao;

    @Ignore
    @Test
    public void testfindByPKTBLSeriesID() {

        Equipment equipment = equipmentDao.findByPkTBLSeriesID(3L);
        assertNotNull(equipment);
        LOG.info(equipment.toString());
    }
}
