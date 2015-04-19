function avatorEditor(opts) {
    $.extend(this, {
        editor: null,
        img:null,
    }, opts || {});
    this.init();
};

avatorEditor.prototype = {
    init: function() {
    	this.editor = document.getElementById(this.editor);
    	this.img = this.editor.getElementsByTagName('img')[0];

    },
    hammer: function(){
    	var that = this;
		var mc = new Hammer.Manager(this.editor);

		// create a pinch and rotate recognizer
		// these require 2 pointers
		var pinch = new Hammer.Pinch();
		var rotate = new Hammer.Rotate();

		// we want to detect both the same time
		pinch.recognizeWith(rotate);

		// add to the Manager
		mc.add([pinch, rotate]);


		mc.on("pinch rotate", function(ev) {
			var scale = ev.scale;
			
		});
    }
}
