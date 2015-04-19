	window.syscode = {};
	syscode.district = {
	    "c10102000": {
	        "n": "北京",
	        "d": 1
	    },
	    "c10104000": {
	        "n": "天津",
	        "d": 1
	    },
	    "c10103000": {
	        "n": "上海",
	        "d": 1
	    },
	    "c10105000": {
	        "n": "重庆",
	        "d": 1
	    },
	    "c10101000": {
	        "n": "广东"
	    },
	    "c10118000": {
	        "n": "江苏"
	    },
	    "c10131000": {
	        "n": "浙江"
	    },
	    "c10127000": {
	        "n": "四川"
	    },
	    "c10107000": {
	        "n": "福建"
	    },
	    "c10124000": {
	        "n": "山东"
	    },
	    "c10115000": {
	        "n": "湖北"
	    },
	    "c10112000": {
	        "n": "河北"
	    },
	    "c10125000": {
	        "n": "山西"
	    },
	    "c10121000": {
	        "n": "内蒙古"
	    },
	    "c10120000": {
	        "n": "辽宁"
	    },
	    "c10117000": {
	        "n": "吉林"
	    },
	    "c10114000": {
	        "n": "黑龙江"
	    },
	    "c10106000": {
	        "n": "安徽"
	    },
	    "c10119000": {
	        "n": "江西"
	    },
	    "c10113000": {
	        "n": "河南"
	    },
	    "c10116000": {
	        "n": "湖南"
	    },
	    "c10109000": {
	        "n": "广西"
	    },
	    "c10111000": {
	        "n": "海南"
	    },
	    "c10110000": {
	        "n": "贵州"
	    },
	    "c10130000": {
	        "n": "云南"
	    },
	    "c10128000": {
	        "n": "西藏"
	    },
	    "c10126000": {
	        "n": "陕西"
	    },
	    "c10108000": {
	        "n": "甘肃"
	    },
	    "c10123000": {
	        "n": "青海"
	    },
	    "c10122000": {
	        "n": "宁夏"
	    },
	    "c10129000": {
	        "n": "新疆"
	    },
	    "c10132000": {
	        "n": "澳门",
	        "d": 1
	    },
	    "c10133000": {
	        "n": "香港"
	    },
	    "c10134000": {
	        "n": "台湾",
	        "d": 1
	    },
	    "c10200000": {
	        "n": "国外",
	        "d": 1
	    }
	};

	function Address(opts) {
	    $.extend(this, {
	        province: null, //省
	        city: null, //市
	        country: null, //县
	        valueInput: null, //隐藏域表单
	        value: null,
	        pValue: null,
	        cValue: null,
	        tValue: null
	    }, opts || {});
	    this.init();
	};

	Address.prototype = {
	    init: function() {
	        this.value = this.valueInput.val();
	        if (!/(00[^0-1])$/.test(this.value)) {
	            this.tValue = this.value;
	        }
	        //非国外
	        if (!/0000$/.test(this.value) || !this.value) {
	            this.createProvince();
	        }

	        this.events();
	    },
	    createProvince: function() {
	        var tpl = '<option value="-1">-省/直辖市-</option>';
	        this.pValue = this.value.replace(/\d{3}$/, '000');
	        for (var key in syscode.district) {
	            tpl += '<option value="' + key + '"' + ((key != 'c' + this.pValue) ? '' : ' selected') + '>' + syscode.district[key].n + '</option>';
	        }
	        tpl = tpl.replace(/value="c/g, 'value="');
	        this.province.html(tpl);
	        //如果有市节点，则生成二级
	        if (this.city) {
	            this.createCity();
	        }
	    },
	    createCity: function() {

	        this.cValue = this.value.replace(/\d{3}$/, '001');
	        if (this.pValue == -1) {
	            this.city.html('<option value="-1">-市/区-</option>');
	            this.country && this.country.html('<option value="-1">-县-</option>') && this.country.css('visibility','visible');
	            return;
	        }

	        function create() {
	        	var tpl = '<option value="-1">-市/区-</option>';
	            for (var key in syscode.district['c' + this.pValue]) {
	                if (/c\d{8}/.test(key)) {
	                    tpl += '<option value="' + key + '"' + ((key != 'c' + this.cValue) ? '' : ' selected') + '>' + syscode.district['c' + this.pValue][key].n + '</option>';
	                }
	            }
	            tpl = tpl.replace(/value="c/g, 'value="');
	            this.city.html(tpl);
	            if (this.country && syscode.district['c' + this.pValue].d !== 1) {
	                this.country.css({
	                    visibility: 'visible'
	                });
	                this.createCountry();
	            } else if (this.country && syscode.district['c' + this.pValue].d == 1) {
	                this.country.css({
	                    visibility: 'hidden'
	                });
	            }
	        };

	        if (!syscode.district['c' + this.pValue]['c' + this.cValue]) {
	            this.load('c' + this.pValue + '.js', create);
	        } else {
	            create.call(this);
	        }
	    },
	    createCountry: function() {
	        var tpl = '<option value="-1">-县-</option>';
	        for (var key in syscode.district['c' + this.pValue]['c' + this.cValue]) {
	            if (/c\d{8}/.test(key)) {
	                tpl += '<option value="' + key + '">' + syscode.district['c' + this.pValue]['c' + this.cValue][key].n + '</option>';
	            }
	        }
	        tpl = tpl.replace(/value="c/g, 'value="');
	        this.country.html(tpl);
	    },
	    events: function() {
	        var that = this;
	        this.province.on('change', function() {
	            that.pValue = $(this).val();
	            if (that.city) {
	                that.createCity();
	            } else {
	                that.valueInput.val(that.pValue);
	            }
	        });
	        if (this.city) {
	            this.city.on('change', function() {
	                that.cValue = $(this).val();
	                //如果三级，且当前没选国外，着生成三级
	                //如果只有二级，或当前选择了国外，直接设置最终值
	                if (that.country && that.pValue !== '10200000') {
	                    that.createCountry();
	                } else {
	                    that.valueInput.val(that.cValue);
	                }
	            });
	        }
	        if (this.country) {
	            this.country.on('change', function() {
	                that.valueInput.val($(this).val());
	            });
	        }
	    },
	    load: function(url, cb) {
	        var that = this;
	        $.ajax({
	            url: url,
	            cache: true,
	            dataType: 'script',
	            success: function() {
	                cb.call(that)
	            }
	        });
	    },
	    check: function() {
	        if (this.province && this.province.val() < 1) {
	            return false;
	        }
	        if (this.city && this.city.val() < 1) {
	            return false;
	        }
	        if (this.country &&
	            (this.country.css('visibility') == 'visible') &&
	            this.country.val() < 1) {
	            return false;
	        }
	        return true;
	    }
	};
