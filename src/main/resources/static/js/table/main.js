$(document).ready(function(){

    let cols11 = [
        {title: '患者编号',name: 'patientID',width: 200,align: 'center'},
        {title: '姓名',name: 'patientName',width: 200,align: 'center' },
        {title: '生日',name: 'patientBirthday',width: 150,align: 'center' },
        {title: '年龄',name: 'patientAge',width: 100,align: 'center' },
        {title: '性别',name: 'patientSex',width: 100,align: 'center' },
    ];
    let cols12 = [
        {title: '登记号',name: 'accessionNumber',width: 200,align: 'center'},
        {title: '检查ID',name: 'studyID',width: 150,align: 'center' },
        {title: '检查UID',name: 'studyInstanceUID',width: 100,align: 'center' },
        {title: '检查描述',name: 'studyDescription',width: 200,align: 'center' },
        {title: '检查日期',name: 'studyDateTime',width: 200,align: 'center' },
    ];
    let cols13 = [
        {title: '序列描述',name: 'seriesDescription',width: 100,align: 'center' },
        {title: '检查部位',name: 'bodyPartExamined',width: 100,align: 'center' },
        {title: '患者部位',name: 'patientPosition',width: 100,align: 'center' },
        {title: '模式',name: 'modality',width: 100,align: 'center', renderer: function (val,item,rowIndex) {
                if (item.equipment.modality.toUpperCase()==='CT'){
                    return '<i class="label label-warning label-mini">CT</i>';
                }else if (item.equipment.modality.toUpperCase()==='CAPTURE'){
                    return '<i class="label label-default label-mini">Capture</i>';
                }else if(item.equipment.modality.toUpperCase()==='PANO'){
                    return '<i class="label label-success label-mini">PANO</i>';
                }else if(item.equipment.modality.toUpperCase()==='CEPH'){
                    return '<i class="label label-info label-mini">CEPH</i>';
                }else if(item.equipment.modality.toUpperCase()==='TMJ'){
                    return '<i>TMJ</i>';
                }
            }
        },
        {title: '操作',name: '',width: 200,align: 'center', renderer: function (val,item) {

                if (item.equipment.modality.toUpperCase()==='CT'){
                    return '<button class="btn btn-primary btn-xs icon-plus-sign-alt" > 查看MPR</button>'
                }else if (item.equipment.modality.toUpperCase()==='PANO'){
                    return '<button class="btn btn-info btn-xs icon-globe" > 查看全景</button>'
                }else if(item.equipment.modality.toUpperCase()==='CEPH'){
                    return '<button class="btn btn-warning btn-xs icon-picture" > 查看侧位</button>'
                }else if(item.equipment.modality.toUpperCase()==='CAPTURE'){
                    return '<button class="btn btn-default btn-xs icon-picture" > 客户截图</button>'
                }
            }
        },
        {title: '操作',name: '',width: 150,align: 'center', renderer: function (val,item) {
                if (item.equipment.modality.toUpperCase()==='CT'){
                    return '<button class="btn btn-success btn-render btn-xs icon-eye-open" > 查看三维图像</button>'
                }
            }
        },
    ];

    //分页
    let mmg1 = $('#table11-1').mmGrid({
        indexCol: true,
        indexColWidth: 35,
        cols: cols11,
        url: 'patient1',
        method: 'get',
        root: 'items',
        plugins : [
            $('#paginator11-1').mmPaginator()
        ]
    });

    let mmg3 = $('#table11-3').mmGrid({
        indexCol: true,
        indexColWidth: 35,
        cols: cols13,
        url: 'study_table/'+0,
        method: 'get',
        root: 'items',
    })
    mmg1.on('cellSelected',function (e, item, rowIndex, colIndex) {
        console.log('item1'+e);
        mmg3.removeRow();
        mmg3.addRow(item.study[0].series);
    })

    $('#btnSearch').on('click',function(){
        let name = document.getElementById("secucode").value;
        //点击查询时页码置为1
        mmg1.load({
            page: 1,
            limit: 20,
            name: name,
        });
    });

    mmg3.on('cellSelected',function (e, item, rowIndex, colIndex) {
        if($(e.target).is('.btn-primary')){
            e.stopPropagation();  //阻止事件冒泡
            window.location.href="renderMPR1/"+item.pkTBLSeriesID;
        }
        if($(e.target).is('.btn-render')){
            e.stopPropagation();  //阻止事件冒泡
            window.location.href="render/"+item.pkTBLSeriesID;
        }
        if($(e.target).is('.btn-info')){
            e.stopPropagation();  //阻止事件冒泡
            window.location.href="renderPANO/"+item.pkTBLSeriesID;
        }
        if($(e.target).is('.btn-warning')){
            e.stopPropagation();  //阻止事件冒泡
            window.location.href="renderCEPH/"+item.pkTBLSeriesID;
        }

        $.ajax({
            url: 'insert_table/'+item.pkTBLSeriesID,
            type: 'get',
            success:function (data) {
                $("#boxscroll").mCustomScrollbar("destroy");
                $(".content").html(data)
                $("#boxscroll").mCustomScrollbar({
                    theme:"minimal",
                    scrollInertia: 1,
                    mouseWheel:{scrollAmount:800},
                    snapAmount:800,
                });
                $("#boxscroll").mCustomScrollbar("update");
            }
        })
    })

});
