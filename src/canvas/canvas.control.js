r.define("canvas.control", {
    inherit: "canvas",
    
    initClass: function(){
        this.css({
            "background-color": "transparent"
        });
    },
    
    init: function(){
        var context2d = this.getContext2d();
        
        context2d.fillStyle = "rgba(255,0,0,255)";
        
        
        //mouse controls for HUD
        var pressed = false;
        var xstart, ystart;
        var xend, yend;
        this.bind("mousedown", function(e){
            this.clear();
            pressed = true;
            xstart = e.pageX;
            ystart = e.pageY;
            console.log(xstart, ystart);
        });
        this.bind("mousemove", function(e){
            if (pressed) {
                this.clear();
                xend = e.pageX - xstart;
                yend = e.pageY - ystart;
                context2d.lineWidth = 1;
                context2d.strokeRect(xstart, ystart, xend, yend);
            }
        });
        this.bind("mouseup", function(e){
            pressed = false;
            this.clear();
            console.log(xstart, ystart, xend, yend);
            //TODO: trigger show here
            this.triggerUp("calcMandelBrot", [xstart, ystart, xend, yend]);
            //show(xstart, ystart, xend, yend);
        });
        
    }
});
