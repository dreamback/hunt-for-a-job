var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    pngcrush = require('imagemin-pngcrush'),
    spriter = require('gulp-css-spriter');

gulp.task('minify-css', function() {
    gulp.src(['src/css/**/*.css', '!src/css/**/*.sprite.css'], {
            base: 'src'
        })
        .pipe(minifyCSS({
            keepBreaks: true,
            noAdvanced: true
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('uglify', function() {
    gulp.src('src/js/**/*.js', {
            base: 'src'
        })
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});

gulp.task('imagemin', function() {
    gulp.src(['src/images/**/*', '!src/images/sprite/**/*'], {
            base: 'src'
        })
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('sprite', function() {
    var timestamp = +new Date();
    //需要自动合并雪碧图的样式文件
    return gulp.src('src/css/**/*.sprite.css',{base:'src'})
        .pipe(spriter({
            // 生成的sprite的位置
            'spriteSheet': 'dist/images/sprite/' + timestamp + '.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../images/sprite/' + timestamp + '.png'
        }))
        .pipe(minifyCSS({
            keepBreaks: true,
            noAdvanced: true
        }))
        //产出路径
        .pipe(gulp.dest('dist'));
});


gulp.task('css', function() {

	var timestamp = +new Date();
	//需要自动合并雪碧图的样式文件
    return gulp.src('./src/css/base.sprite.css')
        .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': './dist/images/sprite'+timestamp+'.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': '../images/sprite'+timestamp+'.png'
        }))
        .pipe(minifyCSS())
        //产出路径
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch(['src/css/**/*.css', '!src/css/**/*_sprite.css'], ['minify-css']);
    gulp.watch('src/js/**/*.js', ['uglify']);
    gulp.watch(['src/images/**/*', '!src/images/sprite/**/*'], ['minimage']);
    gulp.watch('src/css/**/*.sprite.css',['sprite']);
});

gulp.task('default', ['minify-css', 'uglify', 'minimage', 'sprite']);
gulp.task('mincss', ['minify-css']);
gulp.task('minjs', ['uglify']);
gulp.task('minimage', ['imagemin']);

