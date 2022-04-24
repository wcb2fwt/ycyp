package com.bonzd.dicom.dao;



import com.bonzd.dicom.entity.Series;

import java.util.List;

public interface SeriesDao {

    void save(Series series);
    Series update(Series series);
    List<Series> findAll(int firstResult, int maxResults);
    Long count();
    Series findById(long pkTBLSeriesID);
    List<Series> findByPkTBLStudyID(Long pkTBLStudyID);
    Series findBySeriesInstanceUID(String seriesInstanceUID);
    Series findBySeriesInstanceUID(String seriesInstanceUID, Integer seriesNumber);
    List<Series> findAllByPkTBLPatientID(Long pkTBLPatientID);
}
