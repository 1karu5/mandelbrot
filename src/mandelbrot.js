//define new class called mandelbrot
r.define("mandelbrot", {
    //div for bind method //TODO: find better way
    inherit: "rulus.div",
    
    //init method for the class, gets called on create
    init: function(){
        var w = 800;
        var h = 800;
        
        var mandelCanvas = r.create({
            type: "canvas.mandel",
            width: w,
            height: h
        });
        
        var info = r.create({
            type: "info"
        });
        
        this.append(mandelCanvas, {
            type: "canvas.control",
            width: w,
            height: h
        }, info);
        
        var mandelCTX = mandelCanvas.getContext2d();
        mandelCTX.fillStyle = "rgba(0,0,255,255)";
        
        //TODO: width und height auf window grš§e
        //TODO: create overlaying div with settings
        //TODO: auto iterations settings?
        //TODO: optimization
        
        var master = r.create("master");
        this.bind("calcMandelBrot", function(e, params){
            params = params[0];
            
            var startx = params[0];
            var starty = params[1];
            var width = params[2];
            var height = params[3];
            var imageWidth = params[4];
            var imageHeight = params[5];
            
            
            //render picture with x=0,y=0 and width/height=800
            master.calcImage(startx, starty, width, height, imageWidth, imageHeight, function(data){
                mandelCanvas.clear();
                //zoomfactor 1, offset 0/0
                mandelCanvas.paint(data, 1, 0, 0);
            });
        });
        
        //show first picture
        this.triggerOne("calcMandelBrot", [0, 0, 800, 800, 800, 800]);
    }
});
