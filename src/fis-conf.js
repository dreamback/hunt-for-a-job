fis.config.merge({
    project: {
        include: ['**'],
        exclude: ['js/widget/highlighter/**'],
    },
    setting: {
        optimizer: {
            'clean-css': {
                keepBreaks: true
            }
        },
        sprite: {
            csssprites: {
                // scale: 0.5
                margin:10
            }
        }
    },
    modules: {
        spriter: 'csssprites'
    },
    roadmap: {
        domain: {
            //widget目录下的所有css文件使用 http://css1.example.com 作为域名
            //'css/**.css': 'http://images.zastatice.com',
            //所有的js文件使用 http://js1.example.com 或者  http://js2.example.com 作为域名
           // 'js/**.js': 'http://images.zastatice.com',
           // 'image': 'http://images.zastatice.com'
        	'**.js' : 'http://10.10.121.41/v2',
			'**.css' : 'http://10.10.121.41/v2',
			'image' : 'http://10.10.121.41/v2'
        },
        path: [{
            reg: /\/css\/.*\.sprite\.css/i,
            useSprite: true
        }]
    }
});

