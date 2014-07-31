show = (function() {
    var zoomfactor = 1, xoffset = 0, yoffset = 0;
    var w = 800;
    var h = 800;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("style", "position:fixed;top:0px;left:0px;");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255,0,0,255)";

    var body;
    var rdy = function() {
        body = document.getElementsByTagName("body")[0];
        if (body == undefined) {
            setTimeout(rdy, 10);
        }
        else {
            body.appendChild(canvas);
        }
    };
    rdy();

    //testen ob der pixel zur mandelbrot menge gehört
    var isElement = function(a, b) {
        var x = 0, x2, y = 0;
        for (var n = 0; n < 30; n++) {//INTERATIONEN, genauigkeit des bildes
            x2 = x * x - y * y + a;
            y = 2 * x * y + b;
            x = x2;
            if (x * x + y * y > 4) {
                return false;
            }
        }
        return true;
    };
    var update = function() {
        var a, b;
        clearCanvas();
        //iterrate over every pixel in image
        //TODO: use rulus worker here =)
        for (var i = 0; i < h; i = i + 1 / zoomfactor) {
            b = i * 3.0 / h - 1.5;
            for (var j = 0; j < w; j = j + 1 / zoomfactor) {
                a = j * 3.0 / w - 2;
                if (isElement(a, b)) {
                    setPixel(j, i);
                }
            }
        }
    };
    var setPixel = function(x, y) {
        x = x * zoomfactor;
        y = y * zoomfactor;

        ctx.fillRect(x - xoffset, y - yoffset, 1, 1);
    };
    var clearCanvas = function() {
        ctx.clearRect(0, 0, w, h);
    };
    
    //setInterval(update, 1000);
    
    
    //command center :D
    //renders a zoomed part
    //x pos, y pos, width from x, height from y
    return function(x, y, width, height) {
        xoffset = x;
        yoffset = y;

        zoomfactor = w / width;
        update();
    };

})();
show(0,0,800,800);
