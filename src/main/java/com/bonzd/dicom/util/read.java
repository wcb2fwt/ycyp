package com.bonzd.dicom.util;

import com.bonzd.dicom.controller.DicomController;
import com.bonzd.dicom.server.DicomReader;
import com.google.common.primitives.Bytes;
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

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.*;

public class read {

    private static final Logger LOG = LoggerFactory.getLogger(DicomController.class);

    private static List<Property> params = new ArrayList<Property>();
    private static Attributes attr = null; //file dataset info
    private static Attributes fmi = null; //file metadata info
    public static void main(String[] args) {
        File src = new File("D:/DICOM/1.2.276.0.7230010.3.1.2.2519560041.10684.1632904109.968/1.2.276.0.7230010.3.1.4.2519560041.15664.1632904522.1359.dcm"); //带有压缩协议的dicom原始文件
        File dest = new File("D:/DICOM/1.2.276.0.7230010.3.1.2.2519560041.10684.1632904109.968/fff.dcm"); //解压成未压缩的dicom目标文件
        File dest2 = new File("D:/DICOM/1.2.276.0.7230010.3.1.2.2519560041.10684.1632904109.968/fff333.dcm"); //解压成未压缩的dicom目标文件

        try {
//            transcodeWithTranscoderjys(src,dest);
            if (dest.exists()){
                jiangcaiyang();
                System.out.println("cunzai");
            }
//            transcodeWithTranscoderys(dest,dest);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void transcodeWithTranscoderjys(File src, final File dest) throws IOException {
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

    public static void transcodeWithTranscoderys(File src, final File dest) throws IOException {
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

    private static void jiangcaiyang() throws IOException{
        File file = new File("D:/DICOM/1.2.276.0.7230010.3.1.2.2519560041.10684.1632904109.968/fff.dcm");
        DicomInputStream dis = null;
        try {
            dis = new DicomInputStream(file);
            dis.setIncludeBulkData(DicomInputStream.IncludeBulkData.URI);
            attr = dis.readDataset(-1,-1);
            fmi = dis.readFileMetaInformation() != null? dis.readFileMetaInformation():attr.createFileMetaInformation(UID.ImplicitVRLittleEndian);
            System.out.println(attr.getString(Tag.PatientName));
            Integer rows = Integer.parseInt(attr.getString(Tag.Rows));
            Integer columns = Integer.parseInt(attr.getString(Tag.Columns));
            System.out.println(fmi.getString(Tag.TransferSyntaxUID));

            Double pixelSpacing =Double.parseDouble(attr.getString(Tag.PixelSpacing));
            System.out.println(pixelSpacing*2);

            byte[] ss  = attr.getBytes(Tag.PixelData);

            byte[] bt = new byte[320000];
            int k=0;
            for (int i=0;i<rows;i=i+2){
                for (int j=0;j<columns*2;j=j+4){
                    bt[k++]=ss[i *1600+ j];
                    bt[k++]=ss[i *1600+ j+1];
                }
            }

            attr.setString(Tag.Columns,VR.US,400+"");
            attr.setString(Tag.Rows,VR.US,400+"");
            attr.setBytes(Tag.PixelData, VR.OW,bt);
            attr.setString(Tag.PixelSpacing,VR.DS,"0.40\\0.40");

            File file2 = new File("D:/DICOM/1.3.6.1.4.1.25403.8931133062858.6152.20191217122219.1/fu.dcm");
            DicomOutputStream dos = new DicomOutputStream(file2);
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
}
