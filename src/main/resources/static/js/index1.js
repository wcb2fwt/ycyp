$(function () {
    init();
    function init() {
        $('.strokeColorBox').css('border',"4px solid "+$('.strokeColor').val()).find('.icon').css('color',$('.strokeColor').val());
        $('.weightBox .icon').html($('.weight').val()+'px');
        $('.drawFont').css({
            'height': $('.font_box_size').val()
        })
    }
    /**
     * 右键按下不显示浏览器自带框
     */
    $('html').get(0).oncontextmenu = function (e) {
        showMyselfBox(e);
        return false;
    };
    /**
     * 显示自定义框
     */
    function showMyselfBox (e) {
        let left = e.offsetX;
        let top = e.offsetY;
        $('.myselfBox').css({
            left: left,
            top: top
        }).show();
    }
    /**
     * 鼠标滑过工具台
     */
    $('.contro li').on('mouseover', function () {
        $(this).on('mouseout', function () {
            $('.contro li').find('.iconAlert').hide()
        });
        $(this).find('.iconAlert').show();
    });

    /**
     * 点击工具台
     */

    $('.drawType li').on('click touchstart', function (e) {
        if (e.type == "touchstart") {
            e.preventDefault();
        }
        $(this).addClass('drawTypeChoose').siblings().removeClass('drawTypeChoose');
        $('.picture').hide();
        initData.drawType = $(this).attr('data-name');
    })

    /**
     * 改变线条颜色
     */
    $('.strokeColor').on('change', function (e) {
        initData.color = $(this).val();
        $('.strokeColorBox').css('border','4px solid '+initData.color).find('.icon').css('color',initData.color);
    })
    /**
     * 改变背景色
     */
    $('.backgroundColor').on('change', function (e) {
        initData.background = $(this).val();
        $('.backgroundColor').css('border','4px solid '+initData.background).find('.icon').css('color',initData.background);
    })
    /**
     * 改变填充色
     */
    $('.fillDraw').on('click touchstart',function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        if ($(this).attr('data-choose') == 'false') {
            $(this).attr('data-choose','true').addClass('fillBg');
            $('.backgroundColorBox').css({'border':'4px solid '+initData.background,'background':'#fff'}).find('.icon').css('color',initData.background);
            $('.backgroundColor').show();
            initData.isFill = true;
        } else {
            initData.isFill = false;
            $(this).attr('data-choose','false').removeClass('fillBg');
            $('.backgroundColor').hide();
            $('.backgroundColorBox').css({'border':'4px solid #07133d','background':'#07133d'}).find('.icon').css('color','#666');
        }
    })
    /**
     * 改变线条粗细
     */

    $('.weight').on('change', function (e) {
        initData.size = $(this).val();
        $('.weightBox .icon').html($('.weight').val()+'px');
    })
    /**
     * 绘制还是移动
     */
    $('.drawOrMove').on('click touchstart',function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        $(this).addClass('drawOrmoveChoose').siblings('.drawOrMove').removeClass('drawOrmoveChoose');
        if ($(this).attr('data-name') == 'move') {
            $('.maskLi').show();
            // initData.drawOrMove = $(this).attr('data-name');
            $('canvas').css('cursor','move');
        } else {
            // initData.drawOrMove = $(this).attr('data-name');
            $('.maskLi').hide();
            $('canvas').css('cursor','crosshair');
        }
    })
    /**
     * 绘制文字
     */
    $('.intoFontInput').on('input', function () {
        $('.intoFont').html($(this).val());
        initData.context = $(this).val();
    })
    $('.font_box_size').on('change',function () {
        initData.fontSize = $(this).val();
    })

    /**
     * 清除画布
     */
    $('.remote').on('mousedown touchstart',function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        initData.context2d.clearRect(0,0,initData.canvasWidth,initData.canvasHeight);
        initData.drawHistoryArrData = [];
        initData.drawHistoryArrData.length = 0;
    })

    /**
     * 保存图片
     */
    $('.downLoad').on('mousedown touchstart',function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        let url = $('#canvas').get(0).toDataURL("image/png");
        $('.downImg').attr('src',url);
        window.open($('.downImg').attr('src'))
    })

    let width = window.innerWidth-180;
    let height = window.innerHeight-130;
    let stage = new Konva.Stage({
        container: 'canvas',
    });
    stage.container().style.cursor = 'crosshair';
    let layer = new Konva.Layer();
    let layer1 = new Konva.Layer();
    stage.add(layer);
    stage.add(layer1);


    let image = new Image();
    image.crossOrigin = '';
    let yoda;
    let src;
    image.onload = function () {
        let xRate = width / image.width;
        let yRate = height / image.height;
        let setRate = xRate<yRate ? xRate : yRate;
        if(setRate>5){ setRate = 5;}
        document.getElementById("setRate").value=setRate;
        yoda = new Konva.Image({
            width:image.width*setRate,
            height:image.height*setRate-10,
            image:image,
        });
        stage.setWidth(image.width*setRate);
        stage.setHeight(image.height*setRate-10);

        layer1.add(yoda);
        if (initData.drawHistoryArrData.length>1){
            initData.drawHistoryArrData.forEach((obj)=>{
                obj.moveToTop();
            })
        };
        if (cv.getBuildInformation)
        {
            src = cv.imread(image);
        }else{
            cv['onRuntimeInitialized']=()=>{
                src = cv.imread(image);
            };
        };
        layer1.moveToBottom();
        layer1.batchDraw();
    };
    let id = document.getElementById('instanceId').value
    // image.src = 'http://139.196.221.241:8085/dicom/bonzd/details/'+id;
    image.src = 'http://wcb:8085/dicom/bonzd/details/'+id;
    $('#canvas').children().children()[1].id = 'cvs';



    document.getElementById('sharpen').addEventListener('click',function () {
        $('.picture').show();
        let dst = new cv.Mat();
        let dst1 = new cv.Mat();
        let ksize = new cv.Size(3,3);
        $('#slider').bind('change',function (event) {
            let ss = $("input[name='model']:checked").val();
            switch (ss) {
                case 'sharpen':
                    cv.GaussianBlur(src,dst,ksize,0,0,cv.BORDER_DEFAULT);
                    cv.addWeighted(src,1,dst,0,parseFloat($('#slider').val()),dst1);
                    break;
                case 'denoise':
                    cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB, 0);
                    cv.bilateralFilter(dst,dst1,9,parseFloat($('#slider').val())*5,parseFloat($('#slider').val())*5,cv.BORDER_DEFAULT);
                    break;
                case 'contrast':
                    src.convertTo(dst1,-1,Math.abs(parseFloat($('#slider').val())/20),0);
                    break;
                case 'bright':
                    src.convertTo(dst1,-1,1,parseFloat($('#slider').val())*5);
                    break;
                default:
                    break;
            }
            cv.imshow('cvs',dst1);
        })
        stage.find('Tag').setAttrs({
            fill:'#2b2b2b'
        });
        stage.find('Circle').destroy();
    },false);
    document.getElementById('denoise').addEventListener('click',function () {
        stage.find('Tag').setAttrs({
            fill:'#2b2b2b'
        });
        stage.find('Circle').destroy();
    },false);
    document.getElementById('original').addEventListener('click',function () {
        $('.picture').hide();
        let dst = new cv.Mat();
        let M = cv.Mat.eye(3,3,cv.CV_32FC1);
        let anchor = new cv.Point(-1,-1);
        cv.filter2D(src,dst,cv.CV_8U,M,anchor,0,cv.BORDER_DEFAULT);
        cv.imshow('cvs',src);
        dst.delete();
    },false);

    let initData = {
        drawHistoryArrData: [],
        graphNow: null,
        graphNowId: null,
        transform: null,
        flag: null,
        drawing: false,
        isDraw: true,
        isMove: false,
        pointStart: [],
        deltaPoint: [],
        stage: stage,
        layer: layer,
        group: null,
        backgroundImage: image,
        drawType: 'rect',
        color: $('.strokeColor').val(),
        isFill: false,
        background: $('.backgroundColor').val(),
        msgArr: [],
        initLeft: 0,
        initTop: 0,
        mouseCount: 0
    }
    function downloadURI(uri, name) {
        let link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;

        // let img = stage.toDataURL();
        // downloadURI(img,'sss.png')
    }

    stage.on('mousedown',function (e) {
        console.log(initData.graphNow);
        console.log(initData.drawType);

        if (e.target === yoda || e.target === initData.graphNow&&initData.drawing) {
            stageMousedown(initData.drawType, e);
            // 移除图形选择框
            stage.find('Transformer').destroy();
            stage.find('Circle').destroy();
            stage.find('Tag').setAttrs({
                fill:'#2B2B2B'
            });
            layer.draw();
            return;
        }
        // 如果没有匹配到就终止往下执行
        if (!e.target.hasName('line')&&!e.target.hasName('polygon') && !e.target.hasName('ellipse') && !e.target.hasName('rect') && !e.target.hasName('circle')&&!e.target.hasName('delta')) {
            return;
        }
        // 移除图形选择框
        stage.find('Transformer').destroy();
        stage.find('Circle').destroy();
        stage.find('Tag').setAttrs({
            fill:'#2B2B2B'
        });
        // 当前点击的对象赋值给graphNow
        initData.graphNow=e.target;
        // 创建图形选框事件
        const tr = new Konva.Transformer({
            anchorStroke: '#04D302',
            anchorFill: '#04d302',
            anchorSize: 5,
            rotationSnaps: [0, 90, 180, 270],
            borderDash: [5,5], // 虚线间距
            ignoreStroke: true,
            keepRatio: false // 不等比缩放
        });

        initData.transform = tr;
        layer.add(tr);
        if (e.target.attrs.name!='line'&&e.target.attrs.name!='delta'&&e.target.attrs.name!='polygon'){
            tr.attachTo(e.target);
        }
        layer.draw();
    });

    // 鼠标移动
    stage.on('mousemove', function (e) {
        if (initData.graphNow && initData.drawType && initData.drawing) {
            stageMousemove(initData.drawType, e);
        }
    });

    // 鼠标放开
    stage.on('mouseup', function (e) {
        if (initData.drawType === 'delta' && initData.deltaPoint.length<6 && initData.mouseCount !==0||initData.drawType==='polygon'&&initData.mouseCount !==0){
            initData.drawing = true;
        }else {
            initData.drawing = false;
        }
        stageMouseup(initData.drawType, e);
        if (initData.drawType === 'text') initData.drawType=null;
    });
    stage.on('dblclick',function (e) {
        stageMousedb(initData.drawType, e);
    })


    function stageMousedb(flag,ev) {
        switch (flag) {
            case 'polygon':
                drawPolygonLabel(initData.graphNow.points());
                initData.mouseCount = 0;
                initData.drawing = false;
                initData.deltaPoint = [];
                break;
            default:
                break;
        }
    }

    /**
     * stage鼠标按下
     * @param flag 是否可绘制
     * @param ev 传入的event对象
     */

    function stageMousedown(flag, ev) {
        if (flag) {
            let x=ev.evt.offsetX, y=ev.evt.offsetY;
            initData.pointStart=[x, y];
            switch (flag) {
                case 'line':
                    drawLine(initData.pointStart);
                    initData.drawing = true;
                    break;
                case 'pencil':
                    drawPencil(initData.pointStart, initData.color, 2);
                    initData.drawing = true;
                    break;
                case 'ellipse':
                    // 椭圆
                    // drawEllipse(x, y, 0, 0, graphColor, 2);
                    break;
                case 'rect':
                    drawRect(x, y, 0, 0, initData.color, 2);
                    initData.drawing = true;
                    break;
                case 'rectH':
                    drawRect(x, y, 0, 0, initData.color, 2);
                    initData.drawing = true;
                    break;
                case 'text':
                    // drawText(x, y, graphColor, 16);
                    break;
                case 'delta':
                    initData.mouseCount++;
                    if (initData.mouseCount===1){
                        drawDelta(initData.pointStart);
                        initData.deltaPoint = initData.pointStart;
                        initData.drawing = true;
                        break;
                    }else if (initData.mouseCount===3){
                        initData.drawing = false;
                        break;
                    }else if (initData.mouseCount===2){
                        initData.deltaPoint = [initData.deltaPoint[2],initData.deltaPoint[3],initData.deltaPoint[0],initData.deltaPoint[1]];
                        break;
                    }
                case 'polygon':
                    initData.mouseCount++;
                    if (initData.mouseCount===1){
                        drawPolygon(initData.pointStart);
                        initData.deltaPoint = initData.pointStart;
                        break;
                    }else {
                        if (x!=initData.deltaPoint[initData.deltaPoint.length-2]&&y!=initData.deltaPoint[initData.deltaPoint.length-1])
                        initData.deltaPoint.push(x,y);
                    }
                    initData.drawing = true;
                    break;
                default:
                    break;
            }
            // initData.drawing = true;
        }
    }

    /**
     * stage鼠标移动
     * @param flag 是否可绘制
     * @param ev 传入的event对象
     */
    function stageMousemove(flag, ev) {
        switch (flag) {
            case 'line':
                //直线
                if (initData.pointStart.length>2){
                    initData.pointStart.pop();
                    initData.pointStart.pop();
                }
                initData.pointStart.push(ev.evt.offsetX, ev.evt.offsetY);
                initData.graphNow.setAttrs({
                    points: initData.pointStart
                });
                break;
            case 'polygon':
                if (initData.deltaPoint.length>2*initData.mouseCount){
                    initData.deltaPoint.pop();
                    initData.deltaPoint.pop();
                }
                initData.deltaPoint.push(ev.evt.offsetX, ev.evt.offsetY);
                initData.graphNow.setAttrs({
                    points: initData.deltaPoint
                });
                break;
            case 'delta':
                if (initData.mouseCount == 2){
                    if (initData.deltaPoint.length>4){
                        initData.deltaPoint.pop();
                        initData.deltaPoint.pop();
                    }
                    initData.deltaPoint.push(ev.evt.offsetX, ev.evt.offsetY);
                    initData.graphNow.setAttrs({
                        points: initData.deltaPoint
                    });
                    break;
                }
                if (initData.pointStart.length>2){
                    initData.pointStart.pop();
                    initData.pointStart.pop();
                }
                initData.pointStart.push(ev.evt.offsetX, ev.evt.offsetY);
                initData.graphNow.setAttrs({
                    points: initData.pointStart
                });
                break;
            case 'pencil':
                // 铅笔
                initData.pointStart.push(ev.evt.offsetX, ev.evt.offsetY);
                initData.graphNow.setAttrs({
                    points: initData.pointStart
                });
                break;
            case 'ellipse':
                // 椭圆
                initData.graphNow.setAttrs({
                    radiusX: Math.abs(ev.evt.offsetX-initData.pointStart[0]),
                    radiusY: Math.abs(ev.evt.offsetY-initData.pointStart[1])
                });
                break;
            case 'rect':
            case 'rectH':
                initData.graphNow.setAttrs({
                    width: ev.evt.offsetX-initData.pointStart[0],
                    height: ev.evt.offsetY-initData.pointStart[1]
                });
                break;
            default:
                break;
        }
        layer.draw();
    }

    function stageMouseup(flag, ev) {
        switch (flag) {
            case 'line':
                if (initData.pointStart.length>3)
                    drawLabel(initData.graphNow.points());
                initData.pointStart = [];
                initData.mouseCount = 0;
                break;
            case 'delta':
                if (initData.mouseCount>2){
                    initData.mouseCount = 0;
                    drawDeltaLabel(initData.graphNow.points());
                    initData.deltaPoint = [];
                }
                break;
            case 'polygon':
                if (ev.evt.button === 2){
                    drawPolygonLabel(initData.graphNow.points());
                    initData.pointStart=[];
                    initData.mouseCount = 0;
                    initData.drawing = false;
                    initData.deltaPoint = [];
                }
                break;
            default:
                break;
        }

    }

    function drawPolygon(points) {
        const polygon = new Konva.Line({
            name: 'delta',
            points: points,
            stroke: '#04D302',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
            strokeScaleEnabled: false,
        });
        initData.graphNow = polygon;
        initData.drawHistoryArrData.push(initData.graphNow);
        layer.add(polygon)
        layer.draw();
    }
    
    function drawPolygonLabel(points) {
        if (points.length>0){
            let point = [], msg = 0,targets = [], lines=[],labels=[],texts=[];
            for (let i=0;i<points.length;i=i+2){
                point = [points[i],points[i+1],points[i]+50,points[i+1]+50];
                const line = new Konva.Line({
                    points:point,
                    dash: [2,1],
                    stroke: 'white',
                    strokeWidth: 1,
                    lineCap: 'round',
                    lineJoin: 'round',
                });
                initData.drawHistoryArrData.push(line);
                lines.push(line);
                const label = new Konva.Label({
                    x:point[2],
                    y:point[3],
                    opacity: 0.75,
                    draggable: true,
                    lid:initData.graphNow,
                });
                initData.drawHistoryArrData.push(label);
                labels.push(label);
                const tag = new Konva.Tag({
                    fill: '#2B2B2B',
                    pointerDirection: 'left'
                });
                targets.push(tag);
                let px = document.getElementById('instance').value
                let setRate = document.getElementById("setRate").value;
                let l1 = Math.sqrt(Math.pow((points[i]-points[i-2]),2)+Math.pow((points[i+1]-points[i-1]),2))*px/setRate;
                if (i!==0){
                    msg += l1;
                }
                const text = new Konva.Text({
                    text : msg.toFixed(2)+'mm',
                    fontFamily: 'Arial',
                    fontSize: 13,
                    padding: 3,
                    fill: '#04D302'
                });
                texts.push(text);
                label.add(tag,text);
                layer.add(line);
                layer.add(label);
                labels.forEach((obj,i)=>{
                    obj.on('dragmove',function () {
                        point = [points[i*2],points[i*2+1],labels[i].x(),labels[i].y()];
                        lines[i].setAttrs({
                            points:point
                        });
                        layer.batchDraw();
                    });
                });
                label.on('click',function (e) {
                    stage.find('Tag').setAttrs({
                        fill:'#2b2b2b'
                    });
                    stage.find('Circle').destroy();
                    initData.graphNow = e.currentTarget.attrs.lid
                    const circle1 = new Konva.Circle({
                        x:initData.graphNow.points()[2],
                        y:initData.graphNow.points()[3],
                        fill:'transparent',
                        radius:20,
                        hitStrokeWidth:10,
                        strokeWidth:3,
                        stroke: '#50D2FA',
                        draggable:true,
                    });
                    layer.add(circle1);
                    circle1.on('mouseenter ',function () {
                        stage.container().style.cursor = 'move';
                    });
                    circle1.on('mouseleave',function () {
                        stage.container().style.cursor = 'crosshair';
                    });
                    let circles = [];
                    targets.forEach((obj,i)=> {
                        obj.setAttrs({
                            fill : '#9E9E9E'
                        });
                        const circle = new Konva.Circle({
                            x:initData.graphNow.points()[i*2],
                            y:initData.graphNow.points()[i*2+1],
                            fill:'white',
                            radius:2,
                            hitStrokeWidth:10,
                            strokeWidth:5,
                            stroke: 'transparent',
                            draggable:true,
                        });
                        circles.push(circle);
                        circle.on('mouseenter ',function () {
                            stage.container().style.cursor = 'pointer';
                        });
                        circle.on('mouseleave',function () {
                            stage.container().style.cursor = 'crosshair';
                        });
                        circle1.on('dragmove',function (e) {
                            let x =  e.currentTarget.attrs.x-initData.graphNow.points()[2];
                            let y =  e.currentTarget.attrs.y-initData.graphNow.points()[3];
                            let points = initData.graphNow.points();
                            for (let i=0;i<points.length;i=i+2){
                                points[i] = points[i]+x;
                                points[i+1] = points[i+1]+y;
                            };
                            initData.graphNow.setAttrs({
                                points:points
                            });
                            circles.forEach((obj,i)=>{
                                obj.setAttrs({
                                    x : obj.x()+x,
                                    y : obj.y()+y
                                });
                            });
                            lines.forEach((obj,i)=>{
                                const points = obj.points();
                                const point = [points[0]+x,points[1]+y,points[2]+x,points[3]+y];
                                obj.setAttrs({
                                    points:point
                                });
                            });
                            labels.forEach((obj,i)=>{
                                obj.setAttrs({
                                    x:obj.x()+x,
                                    y:obj.y()+y
                                });
                            });
                        });
                        circle.on('dragmove',updateLine);
                        function updateLine(){
                            let points = initData.graphNow.points();
                            points[i*2]=circle.x();
                            points[i*2+1]=circle.y();
                            initData.graphNow.setAttrs({
                                points:points
                            });
                            circle1.setAttrs({
                                x:points[2],
                                y:points[3]
                            });
                            point = [circle.x(),circle.y(),labels[i].x(),labels[i].y()];
                            lines[i].setAttrs({
                                points:point
                            });
                            let msg= 0;
                            for (let j=0;j<texts.length;j++){
                                let l1 = Math.sqrt(Math.pow((points[j*2]-points[j*2-2]),2)+Math.pow((points[j*2+1]-points[j*2-1]),2))*px/setRate;
                                if (j!==0){
                                    msg += l1;
                                }
                                texts[j].setAttrs({
                                    text : msg.toFixed(2)+'mm',
                                });
                            };
                            layer.batchDraw();
                        }
                        layer.add(circle);
                    });
                    layer.draw();
                });
                label.on('mouseenter ',function () {
                    stage.container().style.cursor = 'move';
                });
                label.on('mouseleave',function () {
                    stage.container().style.cursor = 'crosshair';
                });
                label.on('dblclick', function(e) {
                    stage.find('Circle').destroy();
                    lines.forEach((obj)=>{
                        obj.remove();
                    });
                    labels.forEach((obj)=>{
                        obj.remove();
                    })
                    e.currentTarget.attrs.lid.remove();
                    layer.draw();
                });
            };
            layer.draw();
        };
    };
    
    function drawDeltaLabel(points) {
        let x1 = (points[0]+points[2])/2,x2 = (points[2]+points[4])/2,
            y1 = (points[1]+points[3])/2,y2 = (points[3]+points[5])/2;
        let point = [points[2],points[3],(x1+x2)/2,(y1+y2)/2];
        const label = new Konva.Label({
            x:point[2],
            y:point[3],
            opacity: 0.75,
            draggable: true,
            lid:initData.graphNow,
        });
        initData.drawHistoryArrData.push(label);
        const line = new Konva.Line({
            points:point,
            dash: [2,1],
            stroke: 'white',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
        });
        initData.drawHistoryArrData.push(line);
        const tag = new Konva.Tag({
            fill: '#2B2B2B',
            pointerDirection: 'left'
        });
        let angle = angle2({x:points[0]-points[2],y:points[1]-points[3]}
            ,{x:points[4]-points[2],y:points[5]-points[3]});
        let msg = angle.toFixed(1)+"°";
        const text = new Konva.Text({
            text : msg,
            fontFamily: 'Arial',
            fontSize: 13,
            padding: 3,
            fill: '#04D302'
        });
        label.on('dragmove',function (e) {
            point = [point[0],point[1],e.currentTarget.attrs.x,e.currentTarget.attrs.y];
            line.setAttrs({
                points:point,
            });
        });
        label.on('click',function (e) {
            stage.find('Tag').setAttrs({
                fill:'#2b2b2b'
            });
            initData.graphNow = e.currentTarget.attrs.lid
            tag.setAttrs({
                fill : '#9E9E9E'
            });
            stage.find('Circle').destroy();
            const circle1 = new Konva.Circle({
                x:initData.graphNow.points()[0],
                y:initData.graphNow.points()[1],
                fill:'white',
                radius:2,
                hitStrokeWidth:10,
                strokeWidth:5,
                stroke: 'transparent',
                draggable:true,
            }),
             circle2 = new Konva.Circle({
                x:initData.graphNow.points()[2],
                y:initData.graphNow.points()[3],
                fill:'white',
                radius:2,
                hitStrokeWidth:10,
                strokeWidth:5,
                stroke: 'transparent',
                draggable:true,
            }),
             circle4 = new Konva.Circle({
                x:initData.graphNow.points()[2],
                y:initData.graphNow.points()[3],
                fill:'transparent',
                radius:20,
                hitStrokeWidth:10,
                strokeWidth:3,
                stroke: '#50D2FA',
                draggable:true,
            }),
             circle3 = new Konva.Circle({
                x:initData.graphNow.points()[4],
                y:initData.graphNow.points()[5],
                fill:'white',
                radius:2,
                hitStrokeWidth:10,
                strokeWidth:5,
                stroke: 'transparent',
                draggable:true,
            });

            layer.add(circle1);
            layer.add(circle3);
            layer.add(circle4);
            layer.add(circle2);

            layer.draw();
            label.on('mouseenter ',function () {
                stage.container().style.cursor = 'pointer';
            });
            label.on('mouseleave',function () {
                stage.container().style.cursor = 'crosshair';
            });
            circle1.on('mouseenter ',function () {
                stage.container().style.cursor = 'pointer';
            });
            circle1.on('mouseleave',function () {
                stage.container().style.cursor = 'crosshair';
            });
            circle2.on('mouseenter ',function () {
                stage.container().style.cursor = 'pointer';
            });
            circle2.on('mouseleave',function () {
                stage.container().style.cursor = 'crosshair';
            });
            circle3.on('mouseenter ',function () {
                stage.container().style.cursor = 'pointer';
            });
            circle3.on('mouseleave',function () {
                stage.container().style.cursor = 'crosshair';
            });
            circle4.on('mouseenter ',function () {
                stage.container().style.cursor = 'move';
            });
            circle4.on('mouseleave',function () {
                stage.container().style.cursor = 'crosshair';
            });
            circle1.on('dragmove',updateLine);
            circle2.on('dragmove',updateLine);
            circle3.on('dragmove',updateLine);
            circle4.on('dragmove',function (e) {
                let x =  e.currentTarget.attrs.x-circle2.x();
                let y =  e.currentTarget.attrs.y-circle2.y();
                const points = [
                    circle1.x()+x,
                    circle1.y()+y,
                    circle2.x()+x,
                    circle2.y()+y,
                    circle3.x()+x,
                    circle3.y()+y
                ]
                initData.graphNow.setAttrs({
                    points:points
                });
                circle1.setAttrs({
                    x:circle1.x()+x,
                    y:circle1.y()+y,
                });
                circle2.setAttrs({
                    x:circle2.x()+x,
                    y:circle2.y()+y,
                });
                circle3.setAttrs({
                    x:circle3.x()+x,
                    y:circle3.y()+y,
                });
                label.setAttrs({
                    x:label.x()+x,
                    y:label.y()+y,
                });
                point = [circle2.x()+x,circle2.y()+y,label.x()+x,label.y()+y];
                line.setAttrs({
                    points:point
                });
                layer.batchDraw();
            });

            function updateLine(){
                const points = [
                    circle1.x(),
                    circle1.y(),
                    circle2.x(),
                    circle2.y(),
                    circle3.x(),
                    circle3.y()
                ]
                initData.graphNow.setAttrs({
                    points:points
                });
                circle4.setAttrs({
                    x:circle2.x(),
                    y:circle2.y(),
                });
                point = [circle2.x(),circle2.y(),point[2],point[3]];
                line.setAttrs({
                    points:point
                });
                let angle = angle2({x:circle1.x()-circle2.x(),y:circle1.y()-circle2.y()}
                    ,{x:circle3.x()-circle2.x(),y:circle3.y()-circle2.y()});
                let msg = angle.toFixed(1)+"°";
                text.setAttrs({
                    text : msg,
                });
                layer.batchDraw();
            };
        });
        label.on('dblclick', function(e) {
            this.remove();
            stage.find('Circle').destroy();
            line.remove();
            e.currentTarget.attrs.lid.remove();
            layer.draw();
        });
        label.add(tag,text);
        layer.add(label);
        layer.add(line);
        layer.draw();
    }
    function angle2(a,b) {
        const dot = a.x*b.x+a.y*b.y;
        const det = a.x*b.y-a.y*b.x;
        const angle = Math.atan2(det,dot)/Math.PI*180;
        let ss = (angle+360)%360;
        return ss>180?360-ss:ss;
    }

    function drawDelta(points) {
        const delta = new Konva.Line({
            name: 'delta',
            points: points,
            stroke: '#04D302',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
            strokeScaleEnabled: false,
            pLine:initData.graphNow
        });
        initData.graphNow = delta;
        initData.drawHistoryArrData.push(initData.graphNow);
        layer.add(delta);
        layer.draw();
    }
    
    /**
     * 矩形
     * @param x x坐标
     * @param y y坐标
     * @param w 宽
     * @param h 高
     * @param c 颜色
     * @param sw 该值大于0-表示空心矩形（描边宽），等于0-表示实心矩形
     */
    function drawRect(x, y, w, h, c, sw) {
        const rect = new Konva.Rect({
            name: 'rect',
            x: x,
            y: y,
            width: w,
            height: h,
            fill: sw===0?c:null,
            stroke: '#04d302',
            strokeWidth: sw,
            opacity: sw===0?0.5:1,
            strokeScaleEnabled: false,
            draggable: true
        });
        initData.graphNow=rect;
        initData.drawHistoryArrData.push(initData.graphNow);
        layer.add(rect);
        layer.draw();

        rect.on('mouseenter', function() {
            stage.container().style.cursor = 'move';
        });

        rect.on('mouseleave', function() {
            stage.container().style.cursor = 'crosshair';
        });

        rect.on('dblclick', function() {
            // 双击删除自己
            this.remove();
            stage.find('Transformer').destroy();
            layer.draw();
        });

    }

    function drawLabel(points) {
        let point = [(points[0]+points[2])/2,(points[1]+points[3])/2,points[0]+15,points[1]-15];
        const label = new Konva.Label({
            x:point[2],
            y:point[3],
            opacity: 0.75,
            draggable: true,
            lid:initData.graphNow,
        });
        initData.drawHistoryArrData.push(label);
        const line = new Konva.Line({
            points:point,
            dash: [2,1],
            stroke: 'white',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
        });
        initData.drawHistoryArrData.push(line);
        const tag = new Konva.Tag({
            fill: '#2B2B2B',
            pointerDirection: 'down'
        });
        const px = document.getElementById('instance').value
        const setRate = document.getElementById("setRate").value;
        let l = Math.sqrt(Math.pow((points[3]-points[1]),2)+Math.pow((points[2]-points[0]),2))*px/setRate,
            msg = l.toFixed(2)+" mm";
        const text = new Konva.Text({
            text : msg,
            fontFamily: 'Arial',
            fontSize: 13,
            padding: 3,
            fill: '#04D302'
        })
        label.add(tag,text);
        layer.add(label);
        layer.add(line);
        layer.draw();
        label.on('dragmove',function (e) {
            point = [point[0],point[1],e.currentTarget.attrs.x,e.currentTarget.attrs.y];
            line.setAttrs({
                points:point,
            });
        });
        label.on('click',function (e) {
            stage.find('Tag').setAttrs({
                fill:'#2B2B2B'
            });
            initData.graphNow = e.currentTarget.attrs.lid
            tag.setAttrs({
                fill : '#9e9e9e'
            });
            stage.find('Circle').destroy();
            const circle1 = new Konva.Circle({
                x:initData.graphNow.points()[0],
                y:initData.graphNow.points()[1],
                fill:'white',
                radius:2,
                hitStrokeWidth:10,
                strokeWidth:5,
                stroke: 'transparent',
                draggable:true,
            });
            layer.add(circle1);
            const circle2 = new Konva.Circle({
                x:initData.graphNow.points()[2],
                y:initData.graphNow.points()[3],
                fill:'white',
                radius:2,
                strokeWidth:5,
                stroke: 'transparent',
                hitStrokeWidth:10,
                draggable:true,
            });
            layer.add(circle2);
            layer.draw();
            circle1.on('dragmove',updateLine);
            circle2.on('dragmove',updateLine);

            label.on('mouseenter ',function () {
                stage.container().style.cursor = 'pointer';
            });
            label.on('mouseleave',function () {
                stage.container().style.cursor = 'crosshair';
            });
            circle1.on(' mouseover',function () {
                stage.container().style.cursor = 'pointer';
            });
            circle1.on(' mouseout',function () {
                stage.container().style.cursor = 'crosshair';
            });
            circle2.on('mouseenter mouseover',function () {
                stage.container().style.cursor = 'pointer';
            });
            circle2.on('mouseleave mouseout',function () {
                stage.container().style.cursor = 'crosshair';
            });
            function updateLine(){
                const points = [
                    circle1.x(),
                    circle1.y(),
                    circle2.x(),
                    circle2.y(),
                ]
                initData.graphNow.setAttrs({
                    points:points
                });
                point = [(circle1.x()+circle2.x())/2,(circle1.y()+circle2.y())/2,point[2],point[3]];
                line.setAttrs({
                    points:point
                });
                let l = Math.sqrt(Math.pow((circle2.y()-circle1.y()),2)+Math.pow((circle2.x()-circle1.x()),2))*px/setRate,
                    msg = l.toFixed(2)+" mm";
                text.setAttrs({
                    text : msg,
                });
                layer.batchDraw();
            };
        });
        label.on('dblclick', function(e) {
            this.remove();
            stage.find('Circle').destroy();
            line.remove();
            e.currentTarget.attrs.lid.remove();
            layer.draw();
        });
    };
    function drawLine(points) {
        const line = new Konva.Line({
            name: 'line',
            points: points,
            stroke: '#04D302',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
            strokeScaleEnabled: false,
        });
        initData.graphNow = line;
        initData.drawHistoryArrData.push(initData.graphNow);
        layer.add(line);
        layer.draw();
    };

    /**
     *
     * @param points 点数组
     * @param stroke 颜色
     * @param strokeWidth 线粗细
     */
    function drawPencil(points, stroke, strokeWidth) {
        const line = new Konva.Line({
            name: 'line',
            points: points,
            stroke: '#04d302',
            strokeWidth: strokeWidth,
            lineCap: 'round',
            lineJoin: 'round',
            tension: 0.5,
            strokeScaleEnabled: false,
            draggable:true,
        });
        initData.graphNow=line;
        initData.drawHistoryArrData.push(initData.graphNow);
        layer.add(line);
        layer.draw();

        line.on('mouseenter', function() {
            stage.container().style.cursor = 'move';
        });

        line.on('mouseleave', function() {
            stage.container().style.cursor = 'default';
        });

        line.on('dblclick', function() {
            // 双击删除自己
            this.remove();
            stage.find('Transformer').destroy();
            layer.draw();
        });
    }
})

