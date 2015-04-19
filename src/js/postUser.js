function PostUser(opts) {
    $.extend(this, {
        uploadFiles: null,
        textareaInput: null,
        translateVoice: null
    }, opts || {});
};

PostUser.prototype = {
    init: function() {
        this.events();
        this.weixin();
    },
    events: function() {
        var that = this;
        $(this.uploadFiles).find('input').change(function(e) {
            that.readFile(e.target.files[0], $(this).parent()[0]);
        });
        // 推荐语
        var textInput = $(this.textareaInput),
            textarea = textInput.find('textarea'),
            counter = textInput.find('.i');
        textInput.on('click', function() {
            textarea.css({
                height: 48,
                marginTop: 5
            }).focus();
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


    },
    readFile: function(file, target) {
        var reader = new FileReader();

        reader.onload = function(e) {
            target.style.backgroundImage = 'url(' + reader.result + ')';
            target.style.backgroundSize = 'cover';
            target.style.webkitBackgroundSize = 'cover';
        }

        reader.readAsDataURL(file);
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
