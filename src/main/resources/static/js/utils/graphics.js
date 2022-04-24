class graph {
    constructor() {
    }
    reloadDrawImage(){
    }
    drawImage(){
    }
}
class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
    };
};
class Arc extends graph{
    constructor(x,y,radius,startAngle,endAngle,context) {
        super();
        this.x = x
        this.y = y
        this.radius = radius
        this.startAngle = startAngle
        this.endAngle = endAngle
        this.flag = true
        this.context = context
    }
    drawImage(x,y) {
        this.x = x;
        this.y = y;
        this.context.fillStyle='blue';
        this.context.strokeStyle='blue';
        this.context.beginPath();
        this.context.arc(this.x,this.y,this.radius,this.startAngle,this.endAngle);
        this.context.fill();
    }
    reloadDrawImage() {
        this.context.lineWidth='0'
        this.context.fillStyle='blue';
        this.context.strokeStyle='blue';
        this.context.beginPath();
        this.context.arc(this.x,this.y,this.radius,this.startAngle,this.endAngle);
        this.context.fill();
        // this.context.stroke();

    }
    isHover(x,y){
        return this.context.isPointInPath(x,y);
    }
}
class Sketch extends graph{
    constructor(x,y,point,context,imageData) {
        super();
        this.x = x
        this.y = y
        this.point = point
        this.context = context
        this.imageData = imageData
    };
    drawImage(){
        this.context.beginPath();
        this.context.strokeStyle = 'red';
        this.context.moveTo(this.x,this.y);
        this.draw(this.context);

    };
    reloadDrawImage(){
        this.context.beginPath();
        this.context.strokeStyle = 'blue';
        // context.rect(this.x,this.y,5,5);
        this.context.moveTo(this.x,this.y);
        this.draw(this.context);
    };
    draw(){
        this.context.lineWidth=2.5;
        this.context.lineCap='round';
        if (this.point.length>1){
            for (let i=0; i<this.point.length; i++){
                this.context.lineTo(this.point[i].x,this.point[i].y);
                // context.rect(this.point[i].x,this.point[i].y,5,5);
                this.context.stroke();
            };
            this.context.closePath();
        };
    };
};
class Line extends graph{
    constructor(x,y,zx,zy,sArc,eArc,context,imageData) {
        super();
        this.x = x
        this.y = y
        this.zx = zx
        this.zy = zy
        this.sArc = sArc
        this.eArc = eArc
        this.context = context
        this.imageData = imageData
    }
    drawImage(){
        this.context.fillStyle='red';
        this.context.strokeStyle='red';
        this.context.lineWidth = 2.5;
        this.draw(this.context);
    }
    draw(x,y,zx,zy){
        this.context.beginPath();
        this.context.font='14px Arial';
        this.context.moveTo(x,y);
        this.context.lineTo(zx,zy);
        this.context.stroke();
        let //hudu = Math.atan2(mouse.y-y,mouse.x-x),
            msg = '  x:'+this.zx+'y:'+this.zy,//+'弧度:'+hudu+'(rad)',
            l1 = Math.sqrt(Math.pow((zx-x),2)+Math.pow((zy-y),2))*0.20;
        msg = msg+"线长:"+l1.toFixed(2)+"mm";
        this.context.fillText(msg,zx,zy);
    }
    reloadDrawImage(){
        this.context.fillStyle='blue';
        this.context.strokeStyle='blue';
        this.context.lineWidth = 2.5;
        this.sArc.reloadDrawImage(this.context);
        if (this.flag){
            // arcs.push(this.sArc);
        }
        this.eArc.reloadDrawImage(this.context);
        if (this.flag){
            // arcs.push(this.eArc);
        }
        this.draw(this.x,this.y,this.zx,this.zy);
        this.flag = false;
    };
    redraw(x,y){
        this.sArc.drawImage(x,y);
        this.sArc.drawImage(this.zx,this.zy);
        this.draw(this.zx,this.zy,x,y);
    };

}

