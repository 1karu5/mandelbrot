//routeing for every rulus obj in the rulus framework
r.require.routing(/rulus[.]*/, function(url){
    return "vendor/rulus/src/" + url;
});

r.ready(function(){//page ready
    r.require(["rulus/class/rulus.class.autoload", "rulus/rulus.debug", "rulus/rulus.ui"], function(){//need rulus class for objs
        //create first obj =)
        r.find(true, "body")[0].append(r.create("mandelbrot"));
    });
});
