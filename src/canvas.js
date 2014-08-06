r.define("canvas", {
	inherit : "rulus.ui",
	tag : "canvas",

	initClass : function() {
		this.css({
			position : "absolute",
			top : 0,
			left : 0
		});
	},

	getContext2d : function() {
		return this.obj.getContext("2d");
	}
});
