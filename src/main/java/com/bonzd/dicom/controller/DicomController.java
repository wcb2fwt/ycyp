package com.bonzd.dicom.controller;

import com.alibaba.fastjson.JSON;
import com.bonzd.dicom.annotation.LoginRequired;
import com.bonzd.dicom.dao.*;
import com.bonzd.dicom.entity.*;
import com.bonzd.dicom.util.Dcm2Jpg;
import com.bonzd.dicom.util.HostHolder;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.data.UID;
import org.dcm4che3.data.VR;
import org.dcm4che3.imageio.codec.Transcoder;
import org.dcm4che3.io.DicomInputStream;
import org.dcm4che3.io.DicomOutputStream;
import org.dcm4che3.util.Property;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.util.*;


@Controller
@RequestMapping("/bonzd")
public class DicomController {

    private static final String JPG_EXT = ".jpg";
    private static final String JSON_EXT = ".json";

    @Value("${pacs.storage.image}")
    private String pacsImageStoragePath;

    @Value("${pacs.storage.dcm}")
    private String pacsDcmStoragePath;

    @Value("${pacs.storage.dcmjcy}")
    private String pacsDcmStoragePathJcy;

    @Value("${pacs.storage.dcmjys}")
    private String pacsDcmStoragePathJys;

    @Value("${pacs.storage.dcmys}")
    private String pacsDcmStoragePathYs;

    @Autowired
    PatientDao patientDao;

    @Autowired
    StudyDao studyDao;

    @Autowired
    SeriesDao seriesDao;

    @Autowired
    InstanceDao instanceDao;

    @Autowired
    EquipmentDao equipmentDao;

    @Autowired
    HostHolder hostHolder;

    private static final Logger LOG = LoggerFactory.getLogger(DicomController.class);

    @LoginRequired
    @RequestMapping(value = "/patient", method = RequestMethod.GET)
    public String patient(@RequestParam(defaultValue="1", value="page", required=false) Integer page,
                          @RequestParam(defaultValue="10", value="size", required=false) Integer size,
                          @RequestParam(defaultValue="0", value="pkTBLPatientID", required=false) Long pkTBLPatientID,
                          @RequestParam(defaultValue="0", value="pkTBLStudyID", required=false) Long pkTBLStudyID,
                          @RequestParam(defaultValue="0", value="pkTBLSeriesID", required=false) Long pkTBLSeriesID,
                          Model model){
        LOG.debug("patient()");
        int firstResult = (page==null)?0:(page-1) * size;
        String number = hostHolder.getUser().getDeviceSerialNumber();
        List<Patient> patients = patientDao.findByNumber(number);
        model.addAttribute("patients", patients);
        return "site/patient";
    }

    @LoginRequired
    @RequestMapping(value = "/patient1", method = RequestMethod.GET)
    @ResponseBody
    public Map patient1(Integer page,Integer limit,String name){
        String number = null;
        List<Patient> patients;
        List<Patient> patients1;
        if(hostHolder.getUser() != null){
            number = hostHolder.getUser().getDeviceSerialNumber();
        }
        if(name!=null&&!"".equals(name)){
            patients = patientDao.findByNumber(page,limit,number,name);
            patients1 = patientDao.findByNumber(number,name);
        }else {
            patients = patientDao.findByNumber(page,limit,number);
            patients1 = patientDao.findByNumber(number);
        }
        int seIndex= patients1.size();
        Map map = new HashMap();
        map.put("items",patients);
        map.put("totalCount",seIndex);
        return map;
    }

    @RequestMapping(value = "/study_table/{pkTBLPatientID}", method = RequestMethod.GET)
    @ResponseBody
    public Map studyTable(@PathVariable Long pkTBLPatientID){
        List<Study> studyList = studyDao.findByPkTBLPatientID(pkTBLPatientID);
        List list = new ArrayList();
        Map map = new HashMap();
        for (Study study : studyList) {
            list.add(study);
        }
        map.put("items",list);
        map.put("totalCount",list.size());
        return map;
    }
    @RequestMapping(value = "/series_table/{pkTBLStudyID}",method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> seriesTable(@PathVariable Long pkTBLStudyID){
        List<Series> seriesList = seriesDao.findAllByPkTBLPatientID(pkTBLStudyID);
        Map<String,Object> map = new HashMap();
        map.put("items",seriesList);
        return map;
    }
    @RequestMapping(value = "/insert_table/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String insertTable(@PathVariable Long pkTBLSeriesID, Model model){
        List<Instance> instanceList = instanceDao.findByPkTBLSeriesID(pkTBLSeriesID);
        List<Map<String ,Object>> instances = new ArrayList();
        for (Instance instance : instanceList) {
            Map<String,Object> map = new HashMap();
            map.put("instance",instance);
            instances.add(map);
        }
        model.addAttribute("instances",instances);
        return "site/patient::scrollBar";
    }
    @RequestMapping(value = "/render/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String render(@PathVariable Long pkTBLSeriesID, Model model){
        System.out.println("pkTBLSeriesID"+pkTBLSeriesID);
        List<String> stringList = instanceDao.findSopInstanceUIDByPkTBLSeriesID(pkTBLSeriesID);
        model.addAttribute("stringList",JSON.toJSONString(stringList));
        model.addAttribute("pkTBLSeriesID",pkTBLSeriesID);
        return "site/render";
    }
    @LoginRequired
    @RequestMapping(value = "/renderMPR/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String renderMPR(@PathVariable Long pkTBLSeriesID, Model model){
        List<String> stringList = instanceDao.findSopInstanceUIDByPkTBLSeriesID(pkTBLSeriesID);
        model.addAttribute("stringList",JSON.toJSONString(stringList));
        model.addAttribute("pkTBLSeriesID",pkTBLSeriesID);
        return "site/renderMPR";
    }
    @LoginRequired
    @RequestMapping(value = "/renderMPR1/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String renderMPR1(@PathVariable Long pkTBLSeriesID, Model model){
        List<String> stringList = instanceDao.findSopInstanceUIDByPkTBLSeriesID(pkTBLSeriesID);
        model.addAttribute("stringList",JSON.toJSONString(stringList));
        model.addAttribute("pkTBLSeriesID",pkTBLSeriesID);
        return "site/blank";
    }
    @LoginRequired
    @RequestMapping(value = "/wcb1/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String wcb1(@PathVariable Long pkTBLSeriesID, Model model){
        List<String> stringList = instanceDao.findSopInstanceUIDByPkTBLSeriesID(pkTBLSeriesID);
        model.addAttribute("stringList",JSON.toJSONString(stringList));
        model.addAttribute("pkTBLSeriesID",pkTBLSeriesID);
        return "site/renderMPR1";
    }
    @LoginRequired
    @RequestMapping(value = "/renderMPR2/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String renderMPR2(@PathVariable Long pkTBLSeriesID, Model model){
        List<String> stringList = instanceDao.findSopInstanceUIDByPkTBLSeriesID(pkTBLSeriesID);
        model.addAttribute("stringList",JSON.toJSONString(stringList));
        model.addAttribute("pkTBLSeriesID",pkTBLSeriesID);
        return "site/renderMPR2";
    }
    @LoginRequired
    @RequestMapping(value = "/renderPANO/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String renderPANO(@PathVariable Long pkTBLSeriesID, Model model){
        List<Instance> stringList = instanceDao.findByPkTBLSeriesID(pkTBLSeriesID);
        if(stringList.size()==1){
            model.addAttribute("instanceID",stringList.get(0).getPkTBLInstanceID());
            model.addAttribute("instance",stringList.get(0));
        }
        return "site/pano";
    }
    @LoginRequired
    @RequestMapping(value = "/renderCEPH/{pkTBLSeriesID}",method = RequestMethod.GET)
    public String renderCEPH(@PathVariable Long pkTBLSeriesID, Model model){
        List<Instance> stringList = instanceDao.findByPkTBLSeriesID(pkTBLSeriesID);
        if(stringList.size()==1){
            model.addAttribute("instanceID",stringList.get(0).getPkTBLInstanceID());
            model.addAttribute("instance",stringList.get(0));
        }
        return "site/ceph";
    }
    @RequestMapping(value = "/files/{pkTBLSeriesID}",method = RequestMethod.GET)
    @ResponseBody
    public String files(@PathVariable Long pkTBLSeriesID, Model model){
        List<String> stringList = instanceDao.findSopInstanceUIDByPkTBLSeriesID(pkTBLSeriesID);
        List<String> stringList1 = new ArrayList();
        model.addAttribute("pkTBLSeriesID",pkTBLSeriesID);
        for (int i=0;i<stringList.size();i+=2){
            stringList1.add(stringList.get(i));
        }
        return JSON.toJSONString(stringList1);
    }
    @RequestMapping(value = "/details/{pkTBLInstanceID}", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getImage(@PathVariable Long pkTBLInstanceID) throws IOException {
        File tempImage = null;
        Instance instance = instanceDao.findById(pkTBLInstanceID);
//		List<Instance> instanceList = instanceDao.findByPkTBLSeriesID(pkTBLInstanceID);
//		if (instanceList.size() != 0){
//			File dicomFile;
//			Dcm2Jpg dcm2Jpg = null;
//			for(int i=0;i<instanceList.size();i++){
//				dicomFile = new File(pacsDcmStoragePath+"/"+instanceList.get(i).getMediaStorageSopInstanceUID()+".dcm");
//				dcm2Jpg = new Dcm2Jpg();
//				dcm2Jpg.initImageWriter("JPEG", "jpeg", "com.sun.imageio.plugins.*", null, null);
//				String dicomPath = pacsDcmStoragePath + "/" + instanceList.get(i).getMediaStorageSopInstanceUID()+".dcm";
//				String newfilename = FilenameUtils.removeExtension(dicomFile.getName()) + JPG_EXT;
//				String imagePath = pacsImageStoragePath + "/" + newfilename;
//				String[] strings = new String[]{dicomPath,imagePath};
//				tempImage = new File(pacsImageStoragePath, newfilename); //create the temporary image file instance
//				dcm2Jpg.main(strings);
//				if(!tempImage.exists()) try {
//					throw new Exception();
//				} catch (Exception e) {
//					LOG.error("failed convert {} to jpeg... Exception: {}", dicomFile, e.getMessage());
//					e.printStackTrace();
//				}
//			}
//			final HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.IMAGE_JPEG);
//			if(tempImage != null){
//				byte[] bytes = IOUtils.toByteArray( new FileInputStream(tempImage) ) ;
//				return new ResponseEntity<byte[]> (bytes, headers, HttpStatus.CREATED);
//			}
//		}
        if(instance != null){
            File dicomFile = new File(pacsDcmStoragePath + "/" + instance.getMediaStorageSopInstanceUID()+".dcm");
            /********************************************************* TEMP IMAGE FILE CREATION *****************************************************************/
            Dcm2Jpg dcm2Jpg = null;
            try{
                dcm2Jpg = new Dcm2Jpg();// Dcm2Jpg isn't thread safe (due to ImageIO), so need to create a new instance each thread...
                dcm2Jpg.initImageWriter("JPEG", "jpeg", "com.sun.imageio.plugins.*", null, null); // default JPEG writer class, compressionType, and quality
                String dicomPath = pacsDcmStoragePath + "/" + instance.getMediaStorageSopInstanceUID()+".dcm";
                String newfilename = FilenameUtils.removeExtension(dicomFile.getName()) + JPG_EXT; //remove the .dcm and  assign a JPG extension
                String imagePath = pacsImageStoragePath + "/" + newfilename;
                String[] strings = new String[]{dicomPath,imagePath};
                tempImage = new File(pacsImageStoragePath, newfilename); //create the temporary image file instance
//                if (!tempImage.exists())
                    dcm2Jpg.main(strings);
                dcm2Jpg.convert(dicomFile,tempImage);
                if(!tempImage.exists())
                    throw new Exception(); //if not exists, throw exception to log and return back
            }catch(Exception e){
                LOG.error("failed convert {} to jpeg... Exception: {}", dicomFile, e.getMessage()); // shouldn't care...
            }
            /********************************************************** END OF TEMP FILE CREATION ***************************************************************/
            final HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            if(tempImage != null){
                byte[] bytes = IOUtils.toByteArray( new FileInputStream(tempImage) ) ;
                return new ResponseEntity<byte[]> (bytes, headers, HttpStatus.CREATED);
            }
        }
        return null;
    }

    @RequestMapping(path = "files",method = RequestMethod.GET)
    @ResponseBody
    public String getFiles(String path1){
        String path = "D:/DICOM/CTimage/dicomVR"; // 路径
        File f = new File(path);
        if (!f.exists()) {
            System.out.println(path + " not exists");
            return null;
        }
        File[] fa = f.listFiles();
        List list = new ArrayList();
        for (int i = 0; i < fa.length; i++) {
            File fs = fa[i];
            if (fs.isDirectory()) {
                System.out.println(fs.getName() + " [目录]");
            } else {
                list.add(fs.getName());
                System.out.println(fs.getName());
            }
        }
        return JSON.toJSONString(list);
    }

    //获取文件
    //向浏览器响应文件
    @RequestMapping(path = "/header/{filename}",method = RequestMethod.GET)
    public void getHeader(@PathVariable("filename") String filename, HttpServletResponse response){

        //服务器存放路径
//        filename = pacsImageStoragePath + "/" + filename;
        filename = pacsDcmStoragePath + "/" + filename;
        //文件的后缀
        String suffix = filename.substring(filename.lastIndexOf("."));
        //响应文件
        response.setContentType("application/octet-stream"+suffix);
        try (
                //获取字节流，图片是二进制的，文件的输出流
                OutputStream os = response.getOutputStream();
                //创建文件的输入流
                FileInputStream fis = new FileInputStream(filename);
        ){
            //声明一个缓冲区
            byte[] buffer = new byte[1024];
            int b = 0;
            while ((b = fis.read(buffer)) != -1){
                os.write(buffer,0,b);
            }
        } catch (IOException e) {
//            LOGGER.error("读取头像失败："+e.getMessage());
            System.out.println("获取文件失败"+e.getMessage());
        }
    }

    private Attributes attr = null; //file dataset info
    private Attributes fmi = null; //file metadata info

    @RequestMapping(path = "/header1/{filename}",method = RequestMethod.GET)
    public synchronized void getHeader1(@PathVariable("filename") String filename, HttpServletResponse response){
        //服务器存放路径
        String filename1 = pacsDcmStoragePath + "/" + filename;
        String jys = pacsDcmStoragePathJys + "/" + filename;
        String jcy = pacsDcmStoragePathJcy + "/" + filename;
        String ys = pacsDcmStoragePathYs + "/" + filename;
        File file = new File(filename1);
        File jcyFile =new File(jcy);
        File ysFile =new File(ys);
        DicomInputStream dis = null;
        //文件的后缀
        String suffix = filename1.substring(filename1.lastIndexOf("."));
        response.setContentType("application/octet-stream"+suffix);
        try {
            dis = new DicomInputStream(file);
            dis.setIncludeBulkData(DicomInputStream.IncludeBulkData.URI);
            attr = dis.readDataset(-1,-1);
            fmi = dis.readFileMetaInformation() != null? dis.readFileMetaInformation():attr.createFileMetaInformation(UID.ImplicitVRLittleEndian);
            String tsuid = fmi.getString(Tag.TransferSyntaxUID);

            if (tsuid.equals("1.2.840.10008.1.2.1")||tsuid.equals("1.2.840.10008.1.2.2")||tsuid.equals("1.2.840.10008.1.2")){
                if (file.exists()){
                    decimation(file,jcyFile);
                    if (jcyFile.exists())
                        transcodeWithTranscoderys(jcyFile,ysFile);
                }
            }else{
                if (file.exists()){
                    File jysFile = new File(jys);
                    transcodeWithTranscoderjys(file,jysFile);
                    decimation(jysFile,jcyFile);
                    transcodeWithTranscoderys(jcyFile,ysFile);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        try(
            //获取字节流，文件的输出流
            OutputStream os = response.getOutputStream();
            //创建文件的输入流
            FileInputStream fis = new FileInputStream(ys);
        ){
            //声明一个缓冲区
            byte[] buffer = new byte[1024];
            int b = 0;
            while ((b = fis.read(buffer)) != -1){
                os.write(buffer,0,b);
            }
        } catch (IOException e) {
//            LOGGER.error("读取头像失败："+e.getMessage());
            System.out.println("获取文件失败"+e.getMessage());
        }
    }

    public void decimation(File src, File dest) throws IOException {
        DicomInputStream dis = null;
        try {
            dis = new DicomInputStream(src);
            dis.setIncludeBulkData(DicomInputStream.IncludeBulkData.URI);
            attr = dis.readDataset(-1,-1);
            fmi = dis.readFileMetaInformation() != null? dis.readFileMetaInformation():attr.createFileMetaInformation(UID.ImplicitVRLittleEndian);

            Integer rows = Integer.parseInt(attr.getString(Tag.Rows));
            Integer columns = Integer.parseInt(attr.getString(Tag.Columns));
            Double pixelSpacing =Double.parseDouble(attr.getString(Tag.PixelSpacing));
            Integer place = Integer.parseInt(attr.getString(Tag.BitsAllocated));

            byte[] ss  = attr.getBytes(Tag.PixelData);
            byte[] bt = new byte[ss.length/4];

            int k=0;
            if (place==16){
                for (int i=0;i<rows;i=i+2){
                    for (int j=0;j<columns*2;j=j+4){
                        bt[k++]=ss[i * columns*2 + j];
                        bt[k++]=ss[i * columns*2 + j+1];
                    }
                }
            }
            if (place==8){
                for (int i=0;i<=rows;i=i+2){
                    for (int j=0;j<=columns;j=j+2){
                        bt[k++]=ss[i *columns + j];
                    }
                }
            }
            attr.setString(Tag.Columns, VR.US,columns/2+"");
            attr.setString(Tag.Rows,VR.US,rows/2+"");
            attr.setBytes(Tag.PixelData, VR.OW,bt);
            attr.setString(Tag.PixelSpacing,VR.DS,pixelSpacing*2+"\\"+pixelSpacing*2);

            DicomOutputStream dos = new DicomOutputStream(dest);
            dos.writeDataset(fmi,attr);
            dos.finish();
            dos.flush();
            dos.close();

        }catch (IOException e){
            throw e;
        }finally {
            try {
                if (dis != null) dis.close();
            }catch (IOException ignore){

            }
        }
    }

    public void transcodeWithTranscoderjys(File src, final File dest) throws IOException {
        try (Transcoder transcoder = new Transcoder(src)) {
            transcoder.setDestinationTransferSyntax(UID.ExplicitVRLittleEndian);
            transcoder.setIncludeFileMetaInformation(true);
            transcoder.transcode(new Transcoder.Handler(){
                @Override
                public OutputStream newOutputStream(Transcoder transcoder, Attributes dataset) throws IOException {
                    return new FileOutputStream(dest);
                }
            });
        } catch (Exception e) {
            Files.deleteIfExists(dest.toPath());
            throw e;
        }
    }
    public void transcodeWithTranscoderys(File src, final File dest) throws IOException {
        List<Property> params = new ArrayList<Property>();
        try (Transcoder transcoder = new Transcoder(src)) {
            transcoder.setIncludeFileMetaInformation(true);
            transcoder.setDestinationTransferSyntax("1.2.840.10008.1.2.4.90");
            Property p = new Property("compressionQuality", 0.5);//压缩率
            params.add(p);
            transcoder.setCompressParams(params.toArray(new Property[params.size()]));
            transcoder.transcode(new Transcoder.Handler(){
                @Override
                public OutputStream newOutputStream(Transcoder transcoder, Attributes dataset) throws IOException {
                    return new FileOutputStream(dest);
                }
            });
        } catch (Exception e) {
            Files.deleteIfExists(dest.toPath());
            throw e;
        }
    }

    @RequestMapping(path = "profile/{pkTBLUserID}",method = RequestMethod.GET)
    public String getProfile1(@PathVariable Long pkTBLUserID){
        System.out.println("pkTBLUserID"+pkTBLUserID);
        return "site/profile";
    }


}
