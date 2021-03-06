$(function () {
    let xx = 0;
    let yy = 0;
    let txx = 0;
    let tyy = 0;
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
    $('#canvas').get(0).oncontextmenu = function (e) {
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
        initData.drawType = $(this).attr('data-name');
        initData.drayTypeNum= $(this).attr('data-nameNum')
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
            // if (initData.drawType == 'line' || initData.drawType == 'pen' || initData.drawType == 'line' || initData.drawType == 'signet' || initData.drawType == 'eraser') {
            // 	alert('')
            // }
            $('.maskLi').show();
            initData.drawOrMove = $(this).attr('data-name');
            $('#canvas').css('cursor','move');
        } else {
            initData.drawOrMove = $(this).attr('data-name');
            $('.maskLi').hide();
            $('#canvas').css('cursor','crosshair');
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


    /**
     * 鼠标在canvas按下
     */
    $('#canvas').on('mousedown touchstart',function (e) {
        if (e.type == "touchstart") {
            e.preventDefault()
        }
        if (e.button == '0' || e.type == "touchstart") { // 判断是左键按下
            $('.myselfBox').hide();
            initData.mouseDown(e);
            $(this).on('mousemove touchmove', function (e) {
                if (e.type == "touchmove") {
                    e.preventDefault()
                }
                initData.mouseMove(e);
            })
        }
    })




    /**
     * 鼠标抬起
     */
    $('canvas').on('mouseup touchend',function(){
        let drawType = {
            rect : function(){
                if (initData.point.length>1){
                    initData.mouseUp();
                }
            },
            line : function () {
                if (initData.point.length>1){
                    initData.mouseUp();
                }
            },
            circle : function () {
                if (initData.point.length>1){
                    initData.mouseUp();
                }
            },
            delta : function () {
                if (initData.point.length>2){
                    initData.drawHistoryArrData[initData.chooseIndex] = {
                        drawType: initData.drawType,
                        drawTypeNum: initData.drawTypeNum,
                        fill: initData.isFill?initData.background:'',
                        size: initData.size,
                        color: initData.color,
                        points: JSON.parse(JSON.stringify(initData.point)),
                        x: initData.initLeft,
                        y: initData.initTop,
                    }
                    initData.drawArr(initData.drawHistoryArrData);
                    initData.mouseUp();
                }
            },
        }
        switch (initData.drawType) {
            case 'rect':drawType.rect(); break;
            case 'line':drawType.line(); break;
            case 'circle':drawType.circle(); break;
            case 'delta':drawType.delta(); break;
        }
    })
    $('canvas').on('dblclick contextmenu',function(){
        initData.mouseUp();
        console.log(initData.drawHistoryArrData)
    })

    let initData= {
        drawHistoryArrData: [], // 存放所有绘制图形的数据
        context2d: $('#canvas').get(0).getContext('2d'), // canvas绘图2d环境
        canvasWidth: $('#canvas').width(),
        canvasHeight: $('#canvas').height(),
        relPosX: 0, // 鼠标在绘制图形中按下相对该图形左面的距离
        relPosY: 0, // 鼠标在绘制图形中按下相对该图形上面的距离
        relPosToX: 0, // 鼠标在绘制图形中按下相对该图形左面的距离
        relPosToY: 0,
        initLeft: 0,
        initTop: 0,
        chooseIndex: 0, // 选中图形在drawHistoryArrData数据中的index
        drawOrMove: 'draw', // 当前模式是拖拽还是绘制
        isMove: false, // 是否可以拖拽
        drawType: 'rect', // 绘制图形的类型
        drawTypeNum: '1', // 用于区分同一图形不同形状
        size: 2, // 绘制的粗细
        fontSize: $('.font_box_size').val(),
        context:'',
        color: $('.strokeColor').val(), // 绘制颜色
        isFill: false, // 是否填充
        background: $('.backgroundColor').val(),
        msgArr: [], // 画笔信息
        point: [], //点
        maxPoint: -1,
        isDrawing: true,
        isPointAdd: false,
        clickCount:0,
        /**
         * 矩形绘制轨迹
         */
        drawTypeArr: function (arr,j) {
            let drawTypeFn = { // 绘制方法
                rect: function () { // 矩形
                    initData.context2d.beginPath();
                    initData.context2d.lineWidth = arr[j].size;
                    initData.context2d.strokeStyle = arr[j].color;
                    initData.context2d.rect(arr[j].x, arr[j].y, arr[j].w,arr[j].h);
                    if (arr[j].fill) {
                        initData.context2d.fillStyle = arr[j].fill;
                        initData.context2d.fill();
                    }
                    initData.context2d.stroke();
                },
                line: function () {
                    initData.context2d.beginPath();
                    initData.context2d.moveTo (arr[j].x,arr[j].y);       //设置起点状态
                    initData.context2d.lineTo (arr[j].toX,arr[j].toY);       //设置末端状态
                    initData.context2d.lineWidth = arr[j].size;          //设置线宽状态
                    initData.context2d.strokeStyle = arr[j].color;  //设置线的颜色状态
                    initData.context2d.fillStyle = arr[j].color;
                    initData.context2d.stroke();
                    let px = document.getElementById('instance').value
                    let setRate = document.getElementById("setRate").value;
                    let //hudu = Math.atan2(mouse.y-y,mouse.x-x),
                        //msg = '  x:'+arr[j].toX+'y:'+arr[j].toY,//+'弧度:'+hudu+'(rad)',
                        msg = '',
                        l1 = Math.sqrt(Math.pow((arr[j].toX-arr[j].x),2)+Math.pow((arr[j].toY-arr[j].y),2))*px/setRate;
                    msg = "线长:"+l1.toFixed(2)+"mm";
                    initData.context2d.fillText(msg,(arr[j].x+arr[j].toX)/2,(arr[j].y+arr[j].toY)/2-5);
                },
                circle: function () { // 圆
                    initData.context2d.beginPath();
                    initData.context2d.lineWidth = arr[j].size;          //设置线宽状态
                    initData.context2d.strokeStyle = arr[j].color;
                    initData.context2d.arc(arr[j].x,arr[j].y,arr[j].r,0,2*Math.PI);
                    if (arr[j].fill) {
                        initData.context2d.fillStyle = arr[j].fill;
                        initData.context2d.fill();
                    }
                    initData.context2d.stroke()
                },
                delta: function () { // 三角
                    function angle2(a,b) {
                        const dot = a.x*b.x+a.y*b.y;
                        const det = a.x*b.y-a.y*b.x;
                        const angle = Math.atan2(det,dot)/Math.PI*180;
                        let ss = (angle+360)%360;
                        return ss>180?360-ss:ss;
                    }
                    if (arr[j].points.length == 3){
                        console.log('33333333----'+j)
                        initData.context2d.beginPath();
                        initData.context2d.moveTo (arr[j].points[1].x,arr[j].points[1].y);
                        initData.context2d.lineTo(arr[j].points[0].x,arr[j].points[0].y);
                        initData.context2d.lineTo(arr[j].points[2].x,arr[j].points[2].y);
                        let angle = angle2({x:arr[j].points[1].x-arr[j].points[0].x,y:arr[j].points[1].y-arr[j].points[0].y}
                        ,{x:arr[j].points[2].x-arr[j].points[0].x,y:arr[j].points[2].y-arr[j].points[0].y});
                         initData.context2d.lineWidth = arr[j].size;
                        initData.context2d.strokeStyle = arr[j].color;
                        initData.context2d.fillStyle = arr[j].color;
                        initData.context2d.stroke();
                        // initData.context2d.beginPath();
                        // initData.context2d.moveTo((arr[j].points[1].x+arr[j].points[0].x)/2,(arr[j].points[1].y+arr[j].points[0].y)/2);
                        // initData.context2d.arcTo((arr[j].points[1].x+arr[j].points[2].x)/2,(arr[j].points[1].y+arr[j].points[2].y)/2,
                        //     (arr[j].points[2].x+arr[j].points[0].x)/2,(arr[j].points[2].y+arr[j].points[0].y)/2,30);
                        // initData.context2d.lineTo((arr[j].points[2].x+arr[j].points[0].x)/2,(arr[j].points[2].y+arr[j].points[0].y)/2);
                        // initData.context2d.stroke();
                        let msg = angle.toFixed(1);
                        initData.context2d.fillText(msg,arr[j].points[0].x-5,arr[j].points[0].y-5);
                    }else if (arr[j].points.length == 2){
                        console.log('2222222222----'+j)
                        initData.context2d.beginPath();
                        initData.context2d.moveTo (arr[j].points[1].x,arr[j].points[1].y);   //设置起点状态
                        initData.context2d.lineTo(arr[j].points[0].x,arr[j].points[0].y);
                        initData.context2d.lineTo (arr[j].toX,arr[j].toY);       //设置末端状态
                        initData.context2d.lineWidth = arr[j].size;
                        initData.context2d.strokeStyle = arr[j].color;
                        initData.context2d.fillStyle = arr[j].color;
                        initData.context2d.stroke();
                    } else {
                        console.log('11111111111----'+j)
                        initData.context2d.beginPath();
                        initData.context2d.moveTo (arr[j].points[0].x,arr[j].points[0].y);   //设置起点状态
                        for (let i=1;i<arr[j].points.length;i++){
                            if (arr[j].points.length>1){
                                initData.context2d.lineTo (arr[j].points[i].x,arr[j].points[i].y);
                            }
                        }
                        initData.context2d.lineTo (arr[j].toX,arr[j].toY);       //设置末端状态
                        initData.context2d.lineWidth = arr[j].size;          //设置线宽状态
                        initData.context2d.strokeStyle = arr[j].color;  //设置线的颜色状态
                        initData.context2d.fillStyle = arr[j].color;
                        initData.context2d.stroke();
                    }
                },
                ellipse: function () {
                    initData.context2d.beginPath();
                    initData.context2d.lineWidth = arr[j].size;          //设置线宽状态
                    initData.context2d.strokeStyle = arr[j].color;
                    initData.context2d.ellipse(arr[j].x,arr[j].y,Math.abs(arr[j].toX - arr[j].x),Math.abs(arr[j].toY -arr[j].y),0,0,Math.PI*2);
                    if (arr[j].fill) {
                        initData.context2d.fillStyle = arr[j].fill;
                        initData.context2d.fill();
                    }
                    initData.context2d.stroke();
                },
                polygon: function () {
                    let px = document.getElementById('instance').value
                    let setRate = document.getElementById("setRate").value;
                    initData.context2d.beginPath();
                    let length = arr[j].points.length;
                    if (arr[j].points.length>1){
                        initData.context2d.moveTo (arr[j].points[0].x,arr[j].points[0].y);//设置起点状态
                        for (let i=1;i<arr[j].points.length;i++){
                            initData.context2d.lineTo (arr[j].points[i].x,arr[j].points[i].y);     //设置末端状态
                            let l1 = Math.sqrt(Math.pow((arr[j].points[i].x-arr[j].points[i-1].x),2)+Math.pow((arr[j].points[i].y-arr[j].points[i-1].y),2))*px/setRate,
                            msg = "线长:"+l1.toFixed(2)+"mm";
                            initData.context2d.fillText(msg,(arr[j].points[i].x+arr[j].points[i-1].x)/2,(arr[j].points[i].y+arr[j].points[i-1].y)/2-5);
                        }
                    }else {
                        initData.context2d.moveTo (arr[j].x,arr[j].y);

                    }
                    initData.context2d.lineTo (arr[j].toX,arr[j].toY);       //设置末端状态
                    let l1 = Math.sqrt(Math.pow((arr[j].toX-arr[j].points[length-1].x),2)+Math.pow((arr[j].toY-arr[j].points[length-1].y),2))*px/setRate,
                        msg = "线长:"+l1.toFixed(2)+"mm";
                    initData.context2d.fillText(msg,(arr[j].points[length-1].x+arr[j].toX)/2,(arr[j].points[length-1].y+arr[j].toY)/2-5);
                    initData.context2d.lineWidth = arr[j].size;          //设置线宽状态
                    initData.context2d.strokeStyle = arr[j].color;  //设置线的颜色状态
                    initData.context2d.fillStyle = arr[j].color;
                    initData.context2d.stroke();
                },
                font: function () {
                    // initData.context2d.beginPath();
                    initData.context2d.font = arr[j].fontSize+'px  Verdana';
                    initData.context2d.textAlign = 'center';
                    initData.context2d.textBaseline = 'bottom';
                    initData.context2d.fillStyle = arr[j].color;
                    // if (arr[j].fill) {
                    initData.context2d.fillText(arr[j].context, arr[j].x, arr[j].y);
                    // }
                    // initData.context2d.strokeText(arr[j].context, arr[j].x, arr[j].y);
                    // initData.context2d.lineWidth = 1;
                    // initData.context2d.strokeStyle = 'transparent';
                    // initData.context2d.rect(arr[j].x, arr[j].y, arr[j].w,arr[j].h);
                    // initData.context2d.stroke();
                    $('.drawFont').hide();
                    // initData.context = ""
                    $('.intoFont').html('');
                    $('.intoFontInput').val('');
                    $('.drawFont').attr('data-type','hide');
                },
                signet: function () {
                    let img = new Image();
                    img.src = 'data:image/png;base64,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';
                    img.onload = function(){
                        initData.context2d.drawImage(img, arr[j].x-50, arr[j].y-50,100,100);
                    }
                },
                pen: function () {
                    let lineWidth = arr[j].size;
                    let radius=lineWidth/2;
                    let lineColor =arr[j].color;
                    initData.context2d.beginPath();
                    $.each(arr[j].msgArr,function (index,val) {
                        initData.context2d.lineWidth= lineWidth;
                        initData.context2d.lineTo(val.x, val.y);
                        initData.context2d.strokeStyle = lineColor;
                        initData.context2d.stroke();
                        initData.context2d.beginPath();
                        initData.context2d.arc(val.x, val.y, radius, 0, 360, false);
                        initData.context2d.fillStyle = lineColor;
                        initData.context2d.fill();
                        initData.context2d.beginPath();
                        initData.context2d.moveTo(val.x, val.y);
                        initData.context2d.stroke();
                    })
                },
                eraser: function () {
                    $.each(arr[j].msgArr,function (index,val) {
                        initData.context2d.clearRect(val.x,val.y,arr[j].size,arr[j].size);
                    })
                }
            };
            switch (arr[j].drawType) {
                case 'rect':drawTypeFn.rect(); break;
                case 'line':drawTypeFn.line(); break;
                case 'circle':drawTypeFn.circle(); break;
                case 'delta':drawTypeFn.delta(); break;
                case 'ellipse':drawTypeFn.ellipse(); break;
                case 'polygon': drawTypeFn.polygon(); break;
                case 'font': drawTypeFn.font(); break;
                case 'signet': drawTypeFn.signet(); break;
                case 'pen': drawTypeFn.pen(); break;
                case 'eraser': drawTypeFn.eraser(); break;
            }

        },

        /**
         * 统一绘制方法
         */
        drawArr: function (arr) {
            for (let j in arr) {
                this.drawTypeArr(arr,j)
            }
        },
        /**
         * 鼠标按下执行
         */
        mouseDown: function (e) { // 鼠标按下
            initData.initLeft = e.offsetX?e.offsetX:e.originalEvent.targetTouches[0].pageX - $('#canvas').offset().left;//获取鼠标起始位置
            initData.initTop = e.offsetY?e.offsetY:e.originalEvent.targetTouches[0].pageY - $('#canvas').offset().top;
            initData.msgArr = [];
            initData.point.push({
                x:initData.initLeft,
                y:initData.initTop
            });
            if (initData.drawHistoryArrData.length>0) {
                function getChooseIndex() {
                    for(let i in initData.drawHistoryArrData) {
                        initData.drawArr([initData.drawHistoryArrData[i]]);
                        if (initData.drawOrMove == 'move') {
                            if(initData.context2d.isPointInPath(initData.initLeft,initData.initTop) || initData.context2d.isPointInStroke(initData.initLeft,initData.initTop) ) {
                                initData.drawArr(initData.drawHistoryArrData);
                                initData.relPosX = initData.initLeft - initData.drawHistoryArrData[i].x;
                                initData.relPosY = initData.initTop - initData.drawHistoryArrData[i].y;
                                initData.relPosToX = initData.initLeft - initData.drawHistoryArrData[i].toX;
                                initData.relPosToY = initData.initTop - initData.drawHistoryArrData[i].toY;
                                xx = initData.drawHistoryArrData[i].x;
                                yy = initData.drawHistoryArrData[i].y;
                                txx = initData.drawHistoryArrData[i].toX;
                                tyy = initData.drawHistoryArrData[i].toY;
                                initData.isMove = true;
                                return i;
                            }
                        }
                    }
                    if (initData.drawOrMove == 'move') {
                        return -1;
                    } else {
                        if (initData.drawType=='delta' && initData.clickCount>0 && initData.clickCount<3){
                            return initData.chooseIndex;
                        }else if (initData.drawType=='polygon' && initData.isDrawing){
                            return initData.chooseIndex;
                        }else {
                            return initData.drawHistoryArrData.length;
                        }
                    }
                }
                initData.chooseIndex = getChooseIndex();
                console.log('initData.chooseIndex'+initData.chooseIndex);
            } else {
                if (initData.drawOrMove == 'move') {
                    initData.chooseIndex = -1;
                }
            }
            if ($('.drawFont').attr('data-type') == 'hide') {
                if (this.drawType == 'font') {
                    let x = initData.initLeft;
                    let y = initData.initTop;
                    $('.drawFont').attr('data-type','show');
                    $('.drawFont').css({
                        'left':initData.initLeft+"px",
                        'top':initData.initTop+"px"
                    }).show();
                    $('.intoFontInput').on('blur', function () {
                        initData.context = $('.intoFontInput').val();
                        initData.drawHistoryArrData[initData.chooseIndex] = {
                            drawType: initData.drawType,
                            drawTypeNum: initData.drawTypeNum,
                            fill: initData.isFill?initData.background:'',
                            size: initData.size,
                            fontSize: initData.fontSize,
                            context:initData.context,
                            color: initData.color,
                            x: x,
                            y: y,
                            w: $('.intoFontInput').width(),
                            h: $('.intoFontInput').height()
                        };
                        initData.drawArr(initData.drawHistoryArrData);
                    })
                }
            }
            if (this.drawType == 'signet') {
                initData.drawHistoryArrData[initData.chooseIndex] = {
                    drawType: initData.drawType,
                    drawTypeNum: initData.drawTypeNum,
                    fill: initData.isFill?initData.background:'',
                    size: initData.size,
                    color: initData.color,
                    x: initData.initLeft,
                    y: initData.initTop
                };
                initData.drawArr(initData.drawHistoryArrData);
            }
            initData.clickCount++;
            initData.isDrawing = true;
        },

        /**
         * 鼠标移动执行
         */
        mouseMove: function (e) { // 鼠标移动
            initData.context2d.clearRect(0,0,initData.canvasWidth,initData.canvasHeight);
            let moveX = e.offsetX ? e.offsetX : e.originalEvent.targetTouches[0].pageX - $('#canvas').offset().left;
            let moveY = e.offsetY ? e.offsetY : e.originalEvent.targetTouches[0].pageY - $('#canvas').offset().top;
            let moveWidth = moveX - initData.initLeft ;
            let moveHeight = moveY - initData.initTop ;
            if (initData.isMove) {
                switch (initData.drawHistoryArrData[initData.chooseIndex].drawType) {
                    case 'rect':
                        initData.drawHistoryArrData[initData.chooseIndex] = {
                            drawType: initData.drawHistoryArrData[initData.chooseIndex].drawType,
                            drawTypeNum: initData.drawHistoryArrData[initData.chooseIndex].drawTypeNum,
                            fill: initData.drawHistoryArrData[initData.chooseIndex].fill,
                            size: initData.drawHistoryArrData[initData.chooseIndex].size,
                            color: initData.drawHistoryArrData[initData.chooseIndex].color,
                            x: moveWidth + initData.initLeft  - initData.relPosX,
                            y: moveHeight + initData.initTop - initData.relPosY,
                            w: initData.drawHistoryArrData[initData.chooseIndex].w,
                            h: initData.drawHistoryArrData[initData.chooseIndex].h
                        }; break;
                    case 'line':
                        initData.drawHistoryArrData[initData.chooseIndex] = {
                            drawType: initData.drawHistoryArrData[initData.chooseIndex].drawType,
                            drawTypeNum: initData.drawHistoryArrData[initData.chooseIndex].drawTypeNum,
                            fill: initData.drawHistoryArrData[initData.chooseIndex].fill,
                            size: initData.drawHistoryArrData[initData.chooseIndex].size,
                            color: initData.drawHistoryArrData[initData.chooseIndex].color,
                            x: xx + moveWidth,
                            y: yy + moveHeight,
                            toX: txx + moveWidth,
                            toY: tyy + moveHeight
                        };
                        break;
                    case 'circle':
                        initData.drawHistoryArrData[initData.chooseIndex] = {
                            drawType: initData.drawHistoryArrData[initData.chooseIndex].drawType,
                            drawTypeNum: initData.drawTypeNum,
                            fill: initData.drawHistoryArrData[initData.chooseIndex].fill,
                            size: initData.size,
                            color: initData.color,
                            x: moveWidth + initData.initLeft  - initData.relPosX,
                            y: moveHeight + initData.initTop - initData.relPosY,
                            r: initData.drawHistoryArrData[initData.chooseIndex].r,
                        }; break;
                    case 'delta':
                        initData.drawHistoryArrData[initData.chooseIndex] = {
                            drawType: initData.drawHistoryArrData[initData.chooseIndex].drawType,
                            drawTypeNum: initData.drawTypeNum,
                            fill: initData.drawHistoryArrData[initData.chooseIndex].fill,
                            size: initData.size,
                            color: initData.color,
                            x: moveWidth + initData.initLeft  - initData.relPosX,
                            y: moveHeight + initData.initTop - initData.relPosY,
                            toX: moveWidth + initData.initLeft  - initData.relPosToX,
                            toY: moveHeight + initData.initTop - initData.relPosToY,
                            points: this.points
                        }; break;
                    case 'ellipse':
                        initData.drawHistoryArrData[initData.chooseIndex] = {
                            drawType: initData.drawHistoryArrData[initData.chooseIndex].drawType,
                            drawTypeNum: initData.drawTypeNum,
                            fill: initData.drawHistoryArrData[initData.chooseIndex].fill,
                            size: initData.size,
                            color: initData.color,
                            x: moveWidth + initData.initLeft  - initData.relPosX,
                            y: moveHeight + initData.initTop - initData.relPosY,
                            toX: moveWidth + initData.initLeft  - initData.relPosToX,
                            toY: moveHeight + initData.initTop - initData.relPosToY,
                        }; break;
                    case 'polygon':// 六边形
                        initData.drawHistoryArrData[initData.chooseIndex] = {
                            drawType: initData.drawHistoryArrData[initData.chooseIndex].drawType,
                            drawTypeNum: initData.drawTypeNum,
                            fill: initData.drawHistoryArrData[initData.chooseIndex].fill,
                            size: initData.size,
                            color: initData.color,
                            x: moveWidth + initData.initLeft  - initData.relPosX,
                            y: moveHeight + initData.initTop - initData.relPosY,
                            reg: initData.drawHistoryArrData[initData.chooseIndex].reg,
                            toX: moveWidth + initData.initLeft  - initData.relPosToX,
                            toY: moveHeight + initData.initTop - initData.relPosToY
                        }; break;
                }
            } else {
                if (initData.chooseIndex != -1) {
                    switch (this.drawType) {
                        case 'rect': // 矩形
                            initData.maxPoint = 2;
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                x: initData.initLeft,
                                y: initData.initTop,
                                w: moveWidth,
                                h: moveHeight
                            }; break;
                        case 'line': // 线
                            initData.maxPoint = 2;
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                x: initData.initLeft,
                                y: initData.initTop,
                                toX: moveX,
                                toY: moveY,
                            }; break;
                        case 'circle': //圆
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                x: initData.initLeft,
                                y: initData.initTop,
                                r: Math.sqrt(moveWidth*moveWidth+moveHeight*moveHeight)
                            }; break;
                        case 'delta': // 三角
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                points: JSON.parse(JSON.stringify(initData.point)),
                                x: initData.initLeft,
                                y: initData.initTop,
                                toX: moveX,
                                toY: moveY,
                            }; break;
                        case 'ellipse': // 椭圆
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                x: initData.initLeft,
                                y: initData.initTop,
                                toX: moveX,
                                toY: moveY,
                            }; break;
                        case 'polygon':// 六边形
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                x: initData.initLeft,
                                y: initData.initTop,
                                points:JSON.parse(JSON.stringify(initData.point)),
                                toX: moveX,
                                toY: moveY,
                                isDrawing: true,
                            }; break;
                        case 'pen':
                            initData.msgArr.push({
                                x: moveX,
                                y: moveY
                            })
                            var msg = initData.msgArr.concat();
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                x: initData.initLeft,
                                y: initData.initTop,
                                toX: moveX,
                                toY: moveY,
                                msgArr:msg
                            }; break;
                        case 'eraser':
                            initData.msgArr.push({
                                x: moveX,
                                y: moveY
                            })
                            var msg = initData.msgArr.concat();
                            initData.drawHistoryArrData[initData.chooseIndex] = {
                                drawType: initData.drawType,
                                drawTypeNum: initData.drawTypeNum,
                                fill: initData.isFill?initData.background:'',
                                size: initData.size,
                                color: initData.color,
                                x: initData.initLeft,
                                y: initData.initTop,
                                toX: moveX,
                                toY: moveY,
                                msgArr:msg
                            }; break;
                        // case 'signet': // 印章
                        // 	initData.drawHistoryArrData[initData.chooseIndex] = {
                        // 		drawType: initData.drawType,
                        // 		drawTypeNum: initData.drawTypeNum,
                        // 		fill: initData.isFill?initData.background:'',
                        // 		size: initData.size,
                        // 		color: initData.color,
                        // 		x: initData.initLeft,
                        // 		y: initData.initTop,
                        // 		toX: moveX,
                        // 		toY: moveY,
                        // 	}; break;
                        // case 'delta'
                        // case 'circle'
                        // case 'ellipse'
                        // case 'line'
                        //
                        // case 'signet'
                        // case 'pen'
                        // case 'brush'
                    }
                }
            }
            initData.drawArr(initData.drawHistoryArrData);
        },

        /**
         * 鼠标抬起执行
         */
        mouseUp: function () {
            initData.msgArr = [];
            initData.isMove = false;
            initData.relPosX = 0;
            initData.relPosY = 0;
            initData.clickCount = 0;
            initData.isDrawing = false;
            initData.point.splice(0,initData.point.length);
            $('#canvas').off('mousemove');
            // if(initData.drawType!='delta'){
            //     $('#canvas').off('mousemove');
            // }
        }
    };
})