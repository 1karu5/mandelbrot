/**
 * @module rulus.worker
 * @copyright Copyright (C) 2009-2014 Rulus GmbH. All rights reserved.
 * @license Released under the MIT license
 * @author @1karu5
 */
(function(UNDEFINED){
    //the worker script as function
    var workerScript = function(){
        onmessage = function(e){
            //convert the given string back to function
            var functionToCall = new Function("return " + e.data.func)();
            
            postMessage({
                type:"result",
                id: e.data.id,
                //call the function with the data
                value: functionToCall(e.data.data)
            });
        };
    };
    //fallback for older Browsers    
    var fallback = function(that, callback, func, data){
       r.timer(function(){
            callback.call(that, func(data));
        }, 5);
    };
    /**
     * This class defines a WebWorker object type.
     * It allows to create real Threads and push work to them
     *
     * @class rulus.worker
     * @example
     * // create one rulus.worker (is the first one ? -> r.worker)
     * r.create("rulus.worker");
     * // the callback which get the result of your work
     * var callback = function(result){
     *     r.log.info(result);
     * };
     * // calc some fibonaccis
     * var workToDo = function(data){
     *     // your work for the Thread here
     *     // e.g. calculate fibonacci numbers
     *     var fib = function(a){
     *        if(a>2){
     *            return fib(a-2)+fib(a-1);
     *        }else{
     *           return a;
     *        }
     *     };   
     *     return fib(data);
     * };
     *
     * // the data passed to your function, could also be JSON 
     * var data = 45;
     *
     * // let's start working...
     * r.worker.push(callback,workToDo,data);
     *    
     * @example
     * // also possible
     * var w1 = r.create("rulus.worker");
     * var w2 = r.create("rulus.worker");
     * // two additional Threads
     * w1.push(callback,workToDo,data);
     * w2.push(callback,workToDo,data);
     */
    r.define("rulus.worker", {
       /**
        * init the worker, one worker per r.create("rulus.worker");
        * 
        * @function init#rulus.worker
        * @constructor
        */
       init:function(){
            if (typeof(Worker) !== UNDEFINED) {
                var that= this;
                that.callbacks = [];
                
                //convert workerScript to String, add ( and )() to start that function
                //create an Blob with that "function string" and initialize the worker through createObjectURL with that script
                //no need for an additional scriptfile with that way
                that.rulusWorker = new Worker(window.URL.createObjectURL(new Blob(["(" + workerScript.toString() + ")()"], {
                    type: "text/javascript"
                })));
                
                that.rulusWorker.addEventListener("message", function(e){
                    if(e.data){
                        var data = e.data;
                        if(data.type == "console" ){
                              console.log.apply(window,["Log from Worker: "].concat(JSON.parse(data.args)));
                        }else if (data.type== "result"){
                            if (that.callbacks[e.data.id]) {
                                that.callbacks[e.data.id][1].call(that.callbacks[e.data.id][0], e.data.value);
                            }
                            delete that.callbacks[e.data.id];
                        }
                    }
                });
                
                that.rulusWorker.addEventListener("error", function(e){
                    console.log("Error in the worker: ", e);
                });
                
               
            }
       },
       /**
        * Push new functions to the worker
        *
        * @function push#rulus.worker
        * @param {function} callback
        * @param {function} func function for the worker
        * @param {object} data Passed as first argument to the func
        * @example
        * r.worker.push(function(a){r.log.info(a)},function(a){return a+1},5);
        * r.worker.push(function(a){r.log.info(a)},function(a){return a["t"]+1},{t:5});
        */
        push: function(callback, func, data){
            var that=this;
            if (that.rulusWorker) {
                //add callback to array
                that.callbacks.push([that, callback]);
                
                //post the function and data to our worker
                that.rulusWorker.postMessage({
                    id: that.callbacks.length - 1,
                    func: func.toString(),
                    data: data
                });
            }
            else {
                console.log("Worker is not supported");
                fallback(that, callback, func, data);
            }
        }
    });
    
    r.worker = r.create("rulus.worker");
})();
