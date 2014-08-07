(function(){
	var top = 0;
	var left = 0;
r.define("info", {
	inherit : "rulus.div",

	initClass : function() {
		this.css({
			position : "absolute",
			top : top,
			left : left,
			"background-color" : "red",
			width : 200,
			height : 100
		});
	},
	init : function(){
		var pressed = false;
		this.bind({
			mousedown : function(){
				pressed = true;
			},
			mouseup : function(){
				pressed = false;
			},
			mousemove : function(e){
				console.log(e);
			}
		});
	}
});

})();