//routeing for every rulus obj in the rulus framework
r.require.routing(/rulus[.]*/, function(url){
    return "vendor/rulus/src/" + url;
});

r.ready(function(){ //page ready
    r.require(["rulus/class/rulus.class.autoload", "rulus/rulus.debug"], function(){ //need rulus class for objs
        r.create("mandelbrot"); //create first obj =)
    });
});
