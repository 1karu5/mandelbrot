show = (function(){
    var w = 800;
    var h = 800;
    
	var worker = r.create("rulus.worker");
	
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("style", "position:fixed;top:0px;left:0px;");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255,0,0,255)";
    
    var body;
    var rdy = function(){
        body = document.getElementsByTagName("body")[0];
        if (body == undefined) {
            setTimeout(rdy, 10);
        }
        else {
            body.appendChild(canvas);
        }
    };
    rdy();
    
    var workerFunction = function(data){
        var w = data[0], h = data[1], xoffset = data[2], yoffset = data[3], zoomfactor = data[4];
        
        var result = [];
        
        //check if pixel is in mandelbrot set
        var isElement = function(a, b){
            var x = 0, x2, y = 0;
            for (var n = 0; n < 30; n++) {//iterations, accuracy of the image
                x2 = x * x - y * y + a;
                y = 2 * x * y + b;
                x = x2;
                if (x * x + y * y > 4) {
                    return false;
                }
            }
            return true;
        };
        var update = function(){
            var a, b;
            //TODO: split the loops for multiple worker
            //iterrate over every pixel in image
            for (var i = 0; i < h; i = i + 1 / zoomfactor) {
                b = i * 3.0 / h - 1.5;
                for (var j = 0; j < w; j = j + 1 / zoomfactor) {
                    a = j * 3.0 / w - 2;
                    if (isElement(a, b)) {
                        setInResult(j, i);
                    }
                }
            }
        };
        var setInResult = function(x, y){
            x = x | 0;
            y = y | 0;
            result[x + (y * w)] = true;
        };
        
        update();
        
        return result;
    };
    
    var paint = function(data, zoomfactor, xoffset, yoffset){
        for (var i = 0; i < data.length; i++) {
            if (data[i]) {
                var x = i % w;
                var y = (i / h) | 0;
                x = x * zoomfactor;
                y = y * zoomfactor;
                ctx.fillRect(x - xoffset, y - yoffset, 1, 1);
            }
        }
    };
    var clearCanvas = function(){
        ctx.clearRect(0, 0, w, h);
    };
    
    //command center :D
    //renders a zoomed part
    //x pos, y pos, width from x, height from y
    return function(x, y, width, height){
        var xoffset = x;
        var yoffset = y;
        
        var zoomfactor = w / width;
        
        //TODO: start multiple worker and split the for loops
        //create and start worker to calc the data
        worker.push(function(res){
            clearCanvas();
            paint(res, zoomfactor, xoffset, yoffset);
        }, workerFunction, [w, h, xoffset, yoffset, zoomfactor]);
    };
    
})();

//TODO: create overlaying div with settings
//TODO: draw rectangle on click and start show on these rectangle
//TODO: auto iterations settings?
//TODO: optimization

//render picture with x=0,y=0 and width/height=800
show(0, 0, 800, 800);
