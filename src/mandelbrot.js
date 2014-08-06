//define new class called mandelbrot
r.define("mandelbrot", {

    //init method for the class, gets called on create
    init: function(){
        var w = 800;
        var h = 800;
        
        //create first canvas for mandelbrot
        //TODO: create own obj        
        var mandelCanvas = document.createElement("canvas");
        mandelCanvas.setAttribute("style", "position:absolute;top:0px;left:0px;");
        mandelCanvas.width = w;
        mandelCanvas.height = h;
        var mandelCTX = mandelCanvas.getContext("2d");
        mandelCTX.fillStyle = "rgba(0,0,255,255)";
        
        //TODO: create own obj
        //create 2nd obj for HUD
        var controlCanvas = document.createElement("canvas");
        controlCanvas.setAttribute("style", "position:absolute;top:0px;left:0px;background-color:transparent;");
        controlCanvas.width = w;
        controlCanvas.height = h;
        var controlCTX = controlCanvas.getContext("2d");
        controlCTX.fillStyle = "rgba(255,0,0,255)";
        //mouse controls for HUD
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
        })();
        
        
        //append canvases
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(mandelCanvas);
        body.appendChild(controlCanvas);
        
        //turn 1 dim array in 2 dim data for x/y pixels
        //TODO: move in master and maybe buggy? 
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
        
        
        //TODO: create overlaying div with settings
        //TODO: auto iterations settings?
        //TODO: optimization
        
        //render picture with x=0,y=0 and width/height=800
        var master = r.create("master");
        master.calcImage(0, 0, 800, 800, 800, 800, function(data){
            clearCanvas();
            //zoomfactor 1, offset 0/0
            paint(data, 1, 0, 0);
        });
    }
});


