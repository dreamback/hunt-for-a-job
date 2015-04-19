function PostUser(opts) {
    $.extend(this, {
        textareaInput: null,
        translateVoice: null,
        genderRadio:null,
        genderInput:null
    }, opts || {});
};

PostUser.prototype = {
    init: function() {

        this.genderInput = $(this.genderInput);
        this.events();
        this.weixin();
        this.gender();
    },
    events: function() {
        var that = this;
        // 推荐语
        var textInput = $(this.textareaInput),
            textarea = textInput.find('textarea'),
            counter = textInput.find('.i');
        textInput.on('click', function() {
            textarea.css({
                height: 88,
                marginBottom:10
            });
            setTimeout(function(){textarea.focus()},300);
        });
        textarea.on('blur', function() {
            if (!textarea.val()) {
                textarea.css({
                    height: 0,
                    marginTop: 0
                });
            }
        }).on('input', function() {
            var val = $(this).val(),
                len = val.length;
            if (len > 60) {
                len = 60;
                textarea.val(val.substring(0, 60));
            }
            counter.html(len);
        });
        // 性别
        $(this.genderRadio).on('click', function(){
            that.gender($(this).data('sex'));
        });
    },
    gender: function(value){
        if(value!==undefined){
            this.genderInput.val(value);
            $(this.genderRadio).removeClass('on').eq(value).addClass('on');
            return;
        }
        value=this.genderInput.val();
        value!==''&&$(this.genderRadio).removeClass('on').eq(value).addClass('on');
    },
    weixin: function() {
        var that = this,
            voice = {
                localId: ''
            },
            myModal;

        $(this.translateVoice).on('click', function(e) {
        	e.stopPropagation();
            myModal = new Modal({
                title: false,
                content: '正在录音...',
                okText: '结束',
                ok: function() {
                    wx.stopRecord({
                        success: function(res) {
                            voice.localId = res.localId;
                            //识别音频并返回识别结果
                            wx.translateVoice({
                                localId: voice.localId,
                                complete: function(res) {alert(1)
                                    if (res.hasOwnProperty('translateResult')) {
                                        $(this.textareaInput + ' textarea').css({
                                            height: 48
                                        }).val(res.translateResult);
                                        // alert('识别结果：' + res.translateResult);
                                    } else {
                                        // alert('无法识别');
                                    }
                                    myModal.remove();
                                }
                            });
                        },
                        fail: function(res) {
                            // alert(JSON.stringify(res));
                        }
                    });
                    this.setContent('正在语音转译...');
                    myModal.remove();
                    return false;
                },
                cancel: function() {
                    wx.stopRecord();
                },
                init: function() {
                    wx.startRecord();
                    // 监听录音自动停止
                    wx.onVoiceRecordEnd({
                        complete: function(res) {
                            voice.localId = res.localId;
                        }
                    });
                }
            });
        });


    }
};
