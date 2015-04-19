/**
 * 重写，下拉框
 * @author heshimeng1987@qq.com
 */

function ISelector(opts) {
    $.extend(this, {
        data: [],
        target: null,
        value: null,
        hiddenInput: null,
        $selector: null,
        defaultValue:null,
        callback: function() {},
        showCallback: function(){}
    }, opts || {});

    this._iscroll = null;

    this.init();
};

ISelector.prototype = {
    init: function() {
        this.target = $(this.target);
        var li = '',
            that = this;
        $.each(this.data, function() {
            li += '<li' + (this[0] != that.value ? '' : ' class="active"') + ' data-val="' + this[0] + '">' + this[1] + '</li>';
        });
        this.$selector = $(this.template.replace('{data}', li));

        for (var i = 0, len = this.data.length; i < len; i++) {
            if (this.data[i][0] === this.value) {
                this.target.removeClass('input-default').text(this.data[i][1]);
                break;
            }
        }

        this.events();
    },
    show: function() {
        var that = this;

        this.$hiddenInput = $(this.hiddenInput);
        if (0 == this.$hiddenInput.size()) {
            this.$hiddenInput = $('<input name="'+this.hiddenInput.replace('#', '')+'" type="hidden" id="' + this.hiddenInput.replace('#', '') + '" value="' + (this.value!==null?this.value:'') + '" />');
            $(document.body).append(this.$hiddenInput);

        } else {
            this.value = this.$hiddenInput.val();
            this.$hiddenInput.val(this.value);
        }

        $(document.body).append(this.$selector);
        if (!!(window.history && history.pushState)) {
            history.pushState({
                selector: 1
            }, "title", "?selector");
            window.onpopstate = function(e) {
                that.remove();
            }
        }
        setTimeout(function() {
            that.$selector.addClass('active');
        }, 10);

        if (this.data.length > 6) {
            this._iscroll = new IScroll(this.$selector.find('.ISelector-IScroll')[0], {
                click: true
            });
            this.value!==null&&this.value!==''&&this._iscroll.scrollToElement(document.querySelector('.ISelector-IScroll li[data-val="' + this.value + '"]'), 1000);
            this.value===null&&this.value===''&&this.defaultValue&&this._iscroll.scrollToElement(document.querySelector('.ISelector-IScroll li[data-val="' + this.defaultValue + '"]'), 1000);
            this.showCallback(this._iscroll, this);
        }
        return this;
    },
    remove: function() {
        var that = this;
        this.$selector.removeClass('active');
        setTimeout(function() {
            that.$selector.remove();
        }, 310);
        window.onpopstate = null;
    },
    events: function() {
        var that = this;
        this.target.on('click', function() {
            that.show();
        });
        this.$selector.delegate('li[data-val]', 'click', function() {
                that.callback.call(that);
                that.$hiddenInput.val($(this).data('val'));
                that.remove();
                that.target.removeClass('input-default').text($(this).text());
                $(this).addClass('active').siblings().removeClass('active');
            })
            .delegate('a[btn]', 'click', function() {
                that.remove();
            });
    },
    template: '<div class="ISelector">' +
        '    <div class="ISelector-box">' +
        '        <div class="ISelector-IScroll">' +
        '           <ul>{data}</ul>' +
        '        </div>' +
        '        <a btn class="ISelector-btn">取消</a>' +
        '    </div>' +
        '</div>'
};
