show = (function(){
    var w = 800;
    var h = 800;
    
    var worker = r.create("rulus.worker");
    
    var mandelCanvas = document.createElement("canvas");
    mandelCanvas.setAttribute("style", "position:absolute;top:0px;left:0px;");
    mandelCanvas.width = w;
    mandelCanvas.height = h;
    var mandelCTX = mandelCanvas.getContext("2d");
    mandelCTX.fillStyle = "rgba(0,0,255,255)";
    
    var controlCanvas = document.createElement("canvas");
    controlCanvas.setAttribute("style", "position:absolute;top:0px;left:0px;background-color:transparent;");
    controlCanvas.width = w;
    controlCanvas.height = h;
    var controlCTX = controlCanvas.getContext("2d");
    controlCTX.fillStyle = "rgba(255,0,0,255)";
    
    //mouse controls
    (function(){
        var pressed = false;
        var xstart, ystart;
        var xend, yend;
        controlCanvas.addEventListener("mousedown", function(e){
            controlCTX.clearRect(0, 0, w, h);
            pressed = true;
            xstart = e.pageX;
            ystart = e.pageY;
            console.log(xstart, ystart);
        });
        controlCanvas.addEventListener("mousemove", function(e){
            if (pressed) {
                controlCTX.clearRect(0, 0, w, h);
                controlCTX.lineWidth = 1;
                xend = e.pageX - xstart;
                yend = e.pageY - ystart;
                controlCTX.strokeRect(xstart, ystart, xend, yend);
            }
        });
        controlCanvas.addEventListener("mouseup", function(e){
            pressed = false;
            controlCTX.clearRect(0, 0, w, h);
            console.log(xstart, ystart, xend, yend);
            show(xstart, ystart, xend, yend);
        });
    })()
    
    var body;
    var rdy = function(){
        body = document.getElementsByTagName("body")[0];
        if (body == undefined) {
            setTimeout(rdy, 10);
        }
        else {
            body.appendChild(mandelCanvas);
            body.appendChild(controlCanvas);
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
                mandelCTX.fillRect(x - xoffset, y - yoffset, 1, 1);
            }
        }
    };
    var clearCanvas = function(){
        mandelCTX.clearRect(0, 0, w, h);
    };
    
    //command center :D
    //renders a zoomed part
    //x pos, y pos, width from x, height from y
    var show = function(x, y, width, height){
        console.log(arguments);
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
    return show;
    
})();

//TODO: create overlaying div with settings
//TODO: draw rectangle on click and start show on these rectangle
//TODO: auto iterations settings?
//TODO: optimization

//render picture with x=0,y=0 and width/height=800
show(0, 0, 800, 800);
