//$(".list img").lazyload();
;(function($) {
  $.fn.lazyload = function(threshold, callback) {
    var $w = $(window),
        th = threshold || 0,
        attrib = "data-src",
        images = this,
        loaded;

    this.one("lazyload", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback.call(this);
      }
    });

    function lazyload() {
      var inview = images.filter(function() {
        var $e = $(this);
        // if ($e.is(":hidden")) return;
        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("lazyload");
      images = images.not(loaded);
    }

    $w.scroll(lazyload);
    $w.resize(lazyload);
    lazyload();
    return this;
  };
})(window.jQuery || window.Zepto);