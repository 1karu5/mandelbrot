//routeing for every rulus obj in the rulus framework
r.require.routing(/rulus[.]*/, function(url){
    return "vendor/rulus/src/" + url;
});

r.require(["rulus/class/rulus.class.autoload", "rulus/rulus.helper", "rulus/rulus.domReady", "rulus/rulus.log", "rulus/rulus.class", "rulus/class/rulus.class.autoload", "rulus/rulus.debug", "rulus/rulus.ui"], function(){//need rulus class for objs
    r.ready(function(){//page ready
        //create first obj =)
        r.find("body")[0].append(r.create("mandelbrot"));
    });
});
