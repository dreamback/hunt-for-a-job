/**
 * 滑动，联动省市县地区选择
 * @author heshimeng1987@qq.com
 */
function IAddress(opts) {
    $.extend(this, {
        data: district,
        step: 45,
        scrollOpt: {
            snap: "li"
        },
        curProvince: null,
        curCity: null,
        curCountry: null,
        $province: null,
        $city: null,
        $country: null,
        valueText: null,
        valueCode: null,
        textInput: null,
        valueInput: null,
        callback: function(){}
    }, opts || {});

    this.init();
};


IAddress.prototype = {
    init: function() {

        this.valueCode = this.valueInput.val();
        var values = [];
        if (this.valueCode) {
            values = this.valueCode.split(',');
            this.curProvince = 'c' + values[0];
            this.curCity = 'c' + values[1];
            this.curCountry = !this.data[this.curProvince].d ? 'c' + values[2] : null;
        } else {
            this.curProvince = 'c10102000';
            this.curCity = 'c10102001';
            this.curCountry = null;
        }

        this.events();
    },
    template: '<div class="iAddress" id="iAddress">' +
        '    <div class="iAddress-box">' +
        '        <p class="iAddress-value" id="textValue"></p>' +
        '        <div class="iAddress-wrap">' +
        '            <div class="iAddress-divide"></div>' +
        '            <div class="iAddress-col" id="iprovince">' +
        '                <ul></ul>' +
        '            </div>' +
        '            <div class="iAddress-col" id="icity">' +
        '                <ul></ul>' +
        '            </div>' +
        '            <div class="iAddress-col" id="icountry">' +
        '                <ul></ul>' +
        '            </div>' +
        '        </div>' +
        '        <div class="iAddress-btns" id="addressBtns">' +
        '            <button data-type="cancel">取消</button>' +
        '            <button data-type="ok">确定</button>' +
        '        </div>' +
        '    </div>' +
        '</div>',
    renderAddress: function() {

        this.address = $(this.template);
        $('body').append(this.address);

        this.$province = $('#iprovince');
        this.$city = $('#icity');
        this.$country = $('#icountry');
        this.$text = $('#textValue');
        this.createProvince(this.curProvince);
        this.createCity(this.curCity);
        this.createCountry(this.curCountry);

        this.address.addClass('active');
    },
    createProvince: function(value) {
        var that = this;

        this.$province.find('ul').html(this.createTpl(this.data));
        this.iProvince = new IScroll('#iprovince', this.scrollOpt);

        if (value) {
            this.iProvince.scrollTo(0, -(that.$province.find('li[data-id=' + value + ']').addClass('cur').index() - 1) * 45);
        } else {
            that.curProvince = that.$province.find('li').eq(1).addClass('cur').data('id');
        }

        this.iProvince.on('scrollEnd', function() {
            that.curProvince = that.$province.find('li').removeClass().eq(this.currentPage.pageY + 1).addClass('cur').data('id');
            that.createCity('', function() {
                that.createCountry();
            });
            setTimeout(function() {
                that.allScrollEnd();
            }, 0);
        });

        setTimeout(function() {
            that.allScrollEnd();
        }, 0);
    },
    createCity: function(value, callback) {
        var that = this;
        if (this.iCity) {
            this.iCity.destroy();
            this.iCity = null;
        }
        this.$city.find('ul').html(this.createTpl(this.data[this.curProvince]));
        this.iCity = new IScroll('#icity', this.scrollOpt);

        if (value) {
            this.iCity.scrollTo(0, -(that.$city.find('li[data-id=' + value + ']').addClass('cur').index() - 1) * 45);
        } else {
            this.iCity.scrollTo(0, 0);
            this.curCity = this.$city.find('li').eq(1).addClass('cur').data('id');
        }


        this.iCity.on('scrollEnd', function() {

            that.curCity = that.$city.find('li').removeClass().eq(this.currentPage.pageY + 1).addClass('cur').data('id');
            that.createCountry();
            that.allScrollEnd();
        });
        setTimeout(function() {
            callback && callback();
        }, 0);

    },
    createCountry: function(value) {
        var that = this;
        if (this.iCountry) {
            this.iCountry.destroy();
            this.iCountry = null;
        }

        this.$country.find('ul').html(this.createTpl(this.data[this.curProvince][this.curCity]));
        this.iCountry = new IScroll('#icountry', this.scrollOpt);

        if (value) {
            this.iCountry.scrollTo(0, -(that.$country.find('li[data-id=' + value + ']').addClass('cur').index() - 1) * 45);
        } else {
            this.iCountry.scrollTo(0, 0);
            this.curCountry = this.$country.find('li').eq(1).addClass('cur').data('id');
        }

        this.iCountry.on('scrollEnd', function() {
            that.curCountry = that.$country.find('li').removeClass().eq(this.currentPage.pageY + 1).addClass('cur').data('id');
            that.allScrollEnd();
        })
    },
    createTpl: function(data) {
        var html = '<li></li>';
        for (var key in data) {
            if (key.length > 2)
                html += '<li data-id=' + key + '>' + data[key].n + '</li>';
        }
        return html + '<li></li>';
    },
    allScrollEnd: function() {
        var text = [],
            code = [];
        text.push(this.data[this.curProvince].n);
        text.push(this.data[this.curProvince][this.curCity].n);
        code.push(this.curProvince);
        code.push(this.curCity);
        if (this.data[this.curProvince].d !== 1) {
            text.push(this.data[this.curProvince][this.curCity][this.curCountry].n);
            code.push(this.curCountry);
        }

        this.valueText = text;
        this.valueCode = code;

        this.$text.html(this.valueText.join('—'));

        console.log(text);
        console.log(code);
    },
    close: function() {
        var that = this;
        this.address.removeClass('active');
        setTimeout(function() {
            that.address.remove();
        }, 310);
    },
    events: function() {
        var that = this;
        this.textInput.on('click', function() {
            that.renderAddress();
            $('#addressBtns').delegate('button', 'click', function() {
                if ($(this).data('type') == 'ok') {
                    that.textInput.html(that.valueText.join('-'));
                    that.valueInput.val(that.valueCode.join(',').replace(/c/ig, ''));
                    that.callback.call(that);
                }
                that.close();
            });
        });
        // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }
}
