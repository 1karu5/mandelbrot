r.define("canvas", {
    inherit: "rulus.ui",
    tag: "canvas",
    
    initClass: function(){
        this.css({
            position: "absolute",
            top: 0,
            left: 0
        });
    },
    
    width: function(w){
        if (w == undefined) {
            return this.attr("width");
        }
        this.attr("width", w);
    },
    
    height: function(h){
        if (h == undefined) {
            return this.attr("height");
        }
        this.attr("height", h);
    },
    
    //clear canvas
    clear: function(){
        this.getContext2d().clearRect(0, 0, this.width(), this.height());
    },
    //return context
    getContext2d: function(){
        if (!this.settings.context2d) {
            this.settings.context2d = this.obj.getContext("2d");
        }
        return this.settings.context2d;
    }
});
