(function() {
    r.define("info", {
        inherit : "rulus.div",

        initClass : function() {
            this.css({
                position : "absolute",
                top : 0,
                left : 0,
                "background-color" : "red",
                width : 200,
                height : 100
            });
        },
        init : function() {
            var pressed = false;
            var xBeimKlick;
            var yBeimKlick;
            this.bind({
                mousedown : function(e) {
                    pressed = true;
                    xBeimKlick = e.clientX;
                    yBeimKlick = e.clientY;
                    console.log(xBeimKlick);
                    console.log(yBeimKlick);
                },
                mouseup : function(e) {
                    pressed = false;
                },
                mousemove : function(e) {
                    if (pressed) {
                        this.style({
                            "top" : e.clientY,
                            "left" : e.clientX
                        });
                    }
                }
            });
        }
    });

})();
