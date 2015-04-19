function ScrollLoad(opts) {
    this.url = opts.url;
    this.data = opts.data;
    this.template = opts.template;
    this.dataType = opts.dataType;
    this.view = $('#' + opts.view);
    this.complete = opts.complete;
    this.target = $('#' + opts.target);
    this.winHeight = window.innerHeight;
    this.loading = false; //正在异步请求，防止叠加异步请求。
    this.finish = false; //没有数据了
    this.filter = opts.filter;
    this.inData = opts.inData || {};
    this.scrollHandler;

    this.init();
};
ScrollLoad.prototype = {
    init: function() {
        --this.data.pageNo;
        this.isView() && !this.loading && this.load();
        this.events();
    },
    isView: function() {
        var viewTop;
        if (document.documentElement.getBoundingClientRect) {
            viewTop = this.view[0].getBoundingClientRect().top;
        } else {
            viewTop = this.view.offset().top - $(window).scrollTop();
        }
        return (this.winHeight - viewTop) > 0 ? true : false;
    },
    events: function() {
        var that = this,
            timeout = null;
        this.scrollHandler = function() {
            if(that.finish){
                $(window).off('scroll', that.scrollHandler);
                return;
            }
            timeout && clearTimeout(timeout);
            timeout = setTimeout(function() {
                that.isView() && !that.loading && that.load();
            }, 100);
        };
        $(window).on('scroll', this.scrollHandler)
            .on('orientationchange resize', function() {
                that.winHeight = window.innerHeight;
            });
        this.view.bind('click', function() {
            !that.finish && !that.loading && that.load();
        });
    },
    load: function() {
        this.loading = true;
        this.view.val('等待也是生活的一部分...');
        $(window).off('scroll', this.scrollHandler);
        var that = this,
            stop;
        ++this.data.pageNo;
        $.ajax({
            url: this.url,
            dataType: this.dataType,
            data: this.data,
            success: function(data) {
                var counts = data.totalCount;
                that.loading = false;
                if (that.filter) {
                    stop = that.filter.call(that, data);
                    if (stop === false) {
                        that.view.val('没有更多了~');
                        that.finish = true;
                        return;
                    } else {
                        data = stop || data;
                    }
                }
                if (!data) {
                    that.view.val('没有更多了~');
                    that.finish = true;
                    return;
                }
                data = {
                    data: data
                };
                $.extend(data, that.inData);
                // console.log(data.data.length);
                if (!data.data.length || !data.data) {
                    //如果数据长度小于翻页的大小，则说明没有下一页了。
                    that.view.val('没有更多了~');
                    that.target.append(template(that.template, data));
                    that.finish = true;
                    return;
                }
                that.target.append(template(that.template, data));
                that.complete && that.complete.call(that, data);
                // if(counts == null || counts <= 8){
                //      that.view.val('');
                //       that.finish = true;
                //       return;
                // }else{
                //       that.view.val('点击加载更多');   
                // }
               
                $(window).on('scroll', that.scrollHandler);
            }
        });
    },
    destroy: function(){
        this.view.unbind('click');
        $(window).off('scroll', this.scrollHandler);
    }
};
