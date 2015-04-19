function Home(opts) {
    $.extend(this, {
        curTag: 0,
        emptyFriendHTML: '<div class="empty-data center">' +
            '    <div>' +
            '        <i class="icon-empty icon-empty-friend"></i>' +
            '        <p>暂时没有好友动态</p>' +
            '        <a href="" class="btn">去添加更多好友</a>' +
            '    </div>' +
            '</div>',
        emptyCollectHTML: '<div class="empty-data center">' +
            '    <div>' +
            '        <i class="icon-empty icon-empty-collect"></i>' +
            '        <p>您还没有收藏的对象</p>' +
            '        <a href="/square/list.do" class="btn">去首页看看</a>' +
            '    </div>' +
            '</div>'
    }, opts || {});
};

Home.prototype = {
    init: function() {
        this.curTab = this.hash();
        this.scrollLoad();
        this.filterTab();
        this.events();
    },
    filterTab: function() {
        var tabs = $('#filterTab li'),
            that = this,
            index,
            matchersList = $('#matchersList');
        tabs.removeClass('active').eq(this.curTab).addClass('active');
        tabs.on('click', function() {
            index = $(this).index();
            if ($(this).hasClass('active')) return;
            tabs.removeClass('active').eq(index).addClass('active');
            that.hash(index);
            matchersList.html('');
            that.scrollLoad();
            setTimeout(function() {
                that.topNavFixed();
            }, 10);
        })
    },
    /**
     * 获取/设置url中的描点
     * 0 全部
     * 1 朋友圈
     * 2 手册
     */
    hash: function(value) {
        if (undefined === value) {
            return location.hash.replace('#', '') || 0;
        }
        location.hash = '#' + value;
        this.curTab = value;
    },
    scrollLoad: function() {
        var that = this;
        $("#types").val(this.curTab);
        this.myscrollLoad && this.myscrollLoad.destroy();
        this.myscrollLoad = new ScrollLoad({
            url: '/square/listContact.do',
            data: {
                types: this.curTab, //当前选项卡类型
                pageNo: 1,
                pageSize: 8
            },
            dataType: 'json',
            template: 'matchersListTpl',
            target: 'matchersList',
            view: 'scrollLoadView',
            inData: {
                id: 234234
            }, //自定义模版变量，不能为data
            filter: function(data) {
                if (data == null || data.totalCount == null || data.totalCount <= 8) {
                    $("#scrollLoadView").val("");
                }
                if (data == null || data.list == null || data.list.length <= 0) {
                    if (this.data.pageNo == 1) {
                        this.target.html(
                            that.curTab == 1 ? that.emptyFriendHTML :
                            that.curTab == 2 ? that.emptyCollectHTML : '');
                    }
                    return false;
                } else {
                    return data.list;
                }
                //data = []; // 修改异步返回的值
                // return false;将停止插入数据
            },
            complete: function(data) {
                that.swiper(this, data);
            }
        });
    },
    getLastCuserIndex: function(list) {
        for (var i = list.length - 1; i >= 0; i--) {
            if (list[i].isCollection)
                return i;
        }
    },
    swiper: function(swipe, data) { 
        var maxWidth = $(window).width(),
            that = this;
        swipe.target.children().last().find('.swipe-wrap').each(function(index) {
            var tabsWrap = $(this).find('.swipe-tab ul'),
                tabs = tabsWrap.find('li'),
                startSlide = that.getLastCuserIndex(data.data[index].cuserList);
            tabs.eq(0).addClass('active');

            tabsWrap.css({
                width: 42 * tabs.size(),
                visibility: 'visible'
            });
            (function(elem, tabs, tabsWrap, fixed, startSlide) {
                var mySwipe = Swipe($(elem).find('.swipe-content-in')[0], {
                    startSlide: startSlide || 0,
                    stopPropagation: true,
                    callback: function(index, elem) {
                        tabs.removeClass('active').eq(tabs.size() < 3 ? index % 2 : index).addClass('active');
                        var hnId = tabs.children(".chnId").val();
                        var publishTab = tabs.children(".ctab").val();
                        if(publishTab != null && publishTab !== undefined && publishTab !== ''){
                            $("#hn"+hnId).text("在帮" + publishTab + "找对象");
                        }
                        if (fixed && index > 4) {
                            tabsWrap.css({
                                transform: 'translate(-' + ((index - 4) * 42) + 'px, 0) translateZ(0)',
                                webkitTransform: 'translate(-' + ((index - 4) * 42) + 'px, 0) translateZ(0)'
                            });
                        } else {
                            tabsWrap.css({
                                transform: 'translate(0, 0) translateZ(0)',
                                webkitTransform: 'translate(0, 0) translateZ(0)'
                            });
                        }
                    }
                });

                tabs.on('click', function() {
                    var hnId = $(this).children(".chnId").val();
                    var publishTab = $(this).children(".ctab").val();
                    if(publishTab != null && publishTab !== undefined && publishTab !== ''){
                        $("#hn"+hnId).text("在帮" + publishTab + "找对象");
                    }
                    mySwipe.slide($(this).index(), 500);
                }).removeClass('active').eq(startSlide).addClass('active');
            })(this, tabs, tabsWrap, 42 * tabs.size() + 40 > maxWidth, startSlide);

        });
    },
    events: function() {
        $('#matchersList').delegate('.btn', 'click', function(e) {
            var types = $("#types").val();
            var that = $(this);
            e.stopPropagation();
            switch ($(this).data('type')) {
                case 'favorite':
                    $.ajax({
                        type: "POST",
                        async: false,
                        cache: false,
                        url: "/square/collection.do",
                        data: {
                            "hnId": $(this).data('hnid'),
                            "cId": $(this).data('id')
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.status == 1) {
                                new Modal({
                                    model: 'popup',
                                    type: 'success',
                                    content: "收藏成功"
                                });
                                that.children().removeClass('icon-collect').addClass('icon-collected');
                            } else if (data.status == 2) {
                                new Modal({
                                    model: 'popup',
                                    type: 'success',
                                    content: "取消成功"
                                });
                                that.children().removeClass('icon-collected').addClass('icon-collect');
                                if (types == 2) {
                                    //var parentObj = $(this).parent().parent().parent().parent().parent().parent().parent();
                                    // parentObj.remove();
                                    //parentObj.prev().remove();
                                    //location.href = "/square/list.do#2";
                                }

                            } else {
                                new Modal({
                                    model: 'popup',
                                    type: 'warning',
                                    content: "收藏失败，" + data.msg
                                });

                            }
                        },
                        error: function(e) {
                            new Modal({
                                model: 'popup',
                                type: 'danger',
                                content: '服务器出现未知错误，请重试或反馈问题！'
                            });
                        }
                    });
                    break;
                case 'share':
                    alert('分享按钮');
                    break;
            }
        });
        this.topNavFixed();
        // 我的单身好友
        var myInfo = $('#myInfo'),
            singles = $('#singleFirends'),
            close = $('#closeSingle');
        $('#openList').on('click', function() {
            if (myInfo.hasClass('active')) return;
            myInfo.addClass('active');
            singles.css({
                display: 'block'
            });
            setTimeout(function() {
                singles.addClass('active');
            }, 10);
            if (!!(window.history && history.pushState)) {
                history.pushState({
                    dialog: 1
                }, "title", "?singlefriends");
                window.onpopstate = function(e) {
                    close.click();
                }
            }

        });

        $(document).on('click', function(e) {
            if ($(e.target).attr('id') == 'singleFirends' || $(e.target).attr('id') == 'closeSingle') {
                myInfo.removeClass('active');
                singles.removeClass('active');
                setTimeout(function() {
                    singles.css({
                        display: 'none'
                    });
                }, 310);
                window.onpopstate = null;
            }
        });

    },
    topNavFixed: function() {
        var topNavFixed = $('#topNavFixed'),
            startPos = 0,
            endPos = 0,
            timeout = null,
            $win = $(window),
            setNav = function(direction, pos) {
                // timeout && clearTimeout(timeout);
                // timeout = setTimeout(function(){
                topNavFixed.css({
                    webkitTransform:'-webkit-translate(0,'+direction * 52+'px) translateZ(0)',
                    transform: 'translate(0,'+direction * 52+'px) translateZ(0)'
                });
                startPos = pos;
                // },5);
            };

        $(window).on('scroll', function(e) {
            if (window.onpopstate !== null) {
                setNav(0, endPos);
                return;
            }
            endPos = $win.scrollTop();
            if (endPos - startPos > 52) {
                setNav(-1, endPos);
            } else if (endPos - startPos < -52 || endPos <= 52) {
                setNav(0, endPos);
            }
            // console.log('s='+startPos+',e='+endPos)
        });
    }
};
