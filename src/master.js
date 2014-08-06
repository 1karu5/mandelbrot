//closure -> dont pollute global namespace
(function(){
    //this whole function gets passed in the worker
    var workerFunction = function(data){
        //params
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
        //2 dim data in 1 dim array
        var setInResult = function(x, y){
            x = x | 0;
            y = y | 0;
            result[x + (y * w)] = true;
        };
        
        //callculation
        var a, b;
        //TODO: better zooming, dont iterrate over every pixel/dont start at 0
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
        
        return result;
    };
    
    //array of workers
    var worker = [];
    
    
    r.define("master", {
    
        /**
         * calc a new image with the left upper corner startx/starty and the width and height
         * @param {Object} startx
         * @param {Object} starty
         * @param {Object} width
         * @param {Object} height
         * @param {Object} callback with result
         */
        //TODO: remove imageWidth/Height
        calcImage: function(startx, starty, width, height, imageWidth, imageHeight, callback){
            var zoomfactor = imageWidth / width;
            
            //TODO: support more workers
            for (var i = 0; i < worker.length; i++) {
                worker[i].push(function(res){
                    //TODO: return array as 2 dim data, convert it back
                    callback(res, zoomfactor, startx, starty);
                }, workerFunction, [imageWidth, imageHeight, startx, starty, zoomfactor]);
            }
        },
        
        //TODO: dont create new workers every time
        setWorkerAmount: function(newAmount){
            var arr = [];
            for (var i = 0; i < newAmount; i++) {
                arr.push(r.create("rulus.worker"));
            }
            worker = arr;
        },
        
        init: function(){
            //TODO: change that
            this.setWorkerAmount(1);
        }
    });
})();
