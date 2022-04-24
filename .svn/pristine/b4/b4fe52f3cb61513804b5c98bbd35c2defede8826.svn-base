package com.bonzd.dicom.service;


import com.bonzd.dicom.entity.*;
import com.bonzd.dicom.server.DicomReader;

import java.util.Map;

public interface DBService {
    public void buildEntities(DicomReader reader);

    Patient buildPatient(DicomReader reader);

    Study buildStudy(DicomReader reader, Patient patient);

    Series buildSeries(DicomReader reader, Study study);

    Equipment buildEquipment(DicomReader reader, Series series);

    Instance buildInstance(DicomReader reader, Series series);


}
