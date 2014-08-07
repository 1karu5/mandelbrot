r.define("canvas.mandel", {
    inherit: "canvas",
    
    //turn 1 dim array in 2 dim data for x/y pixels and paint it
    //TODO: maybe buggy?
    paint: function(data, zoomfactor, xoffset, yoffset){
        var context2d = this.getContext2d(), w = this.width(), h = this.height();
        for (var i = 0; i < data.length; i++) {
            if (data[i]) {
                var x = i % w;
                var y = (i / h) | 0;
                x = x * zoomfactor;
                y = y * zoomfactor;
                context2d.fillRect(x - xoffset, y - yoffset, 1, 1);
            }
        }
    }
    
});
