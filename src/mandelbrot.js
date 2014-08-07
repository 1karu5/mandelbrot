//define new class called mandelbrot
r.define("mandelbrot", {

    //init method for the class, gets called on create
    init: function(){
        var w = 800;
        var h = 800;
        
        var body = r.find(true, "body")[0];
        
        var mandelCanvas = r.create({
            type: "canvas.mandel",
            width: w,
            height: h
        });
        
        var info = r.create({
            type: "info"
        });
        
        body.append(mandelCanvas, {
            type: "canvas.control",
            width: w,
            height: h
        }, info);
        
        var mandelCTX = mandelCanvas.getContext2d();
        mandelCTX.fillStyle = "rgba(0,0,255,255)";
        
        
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
