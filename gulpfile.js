var	 gulp    	= require('gulp'),
 		 jshint     = require('gulp-jshint'),
		 jsUglify   = require('gulp-uglify'),
		 htmlmin 		= require('gulp-htmlmin'),
	 	 cssnano 		= require('gulp-cssnano'),
		 rimraf 		= require('gulp-rimraf'),
		 changed 		= require('gulp-changed'),
		 connect		= require('gulp-connect'),
		 gJade 			= require('gulp-jade'),
		 sass 			= require('gulp-sass'),
     svgmin = require('gulp-svgmin'),
		 gulpif = require('gulp-if'),


		 inputDir 	='src/',
		 outputDir  ='dist/',

		 compress		 =false,
		 jsTest			 =false,

		 input      ={'html'			:inputDir+'/*.html',
		 							'javascript':inputDir+'/js/*.js',
									'css'				:inputDir+'/css/*.css',
									'jade'			:inputDir+'/*.jade',
									'sass'			:inputDir+'/sass/*.sass',
                	'svg'			:inputDir+'/img/*.svg'

								},
		 output     ={'html'			:outputDir+'/',
		 							'javascript':outputDir+'/js/',
									'css'				:outputDir+'/css/',
									'jade'			:outputDir+'/',
									'sass'			:outputDir+'/css/',
	                'svg'			 :outputDir+'/img/'
                };

copyIgnore	=['!'+input.html,'!'+input.javascript,'!'+input.css];
copyIgnore.push(inputDir+'/**');

function errorLog(error){
	console.log.bind(error);
	this.emit('end');
}

	gulp.task('sync', function () {
	  return gulp.src(copyIgnore)
	    .pipe(gulp.dest(outputDir));
	});

	gulp.task('html-minify',function(){
		return  gulp.src(input.html)
		.pipe(changed(output.html))
		.pipe(gulpif(compress,htmlmin({collapseWhitespace: true}) ))
		.on('error',errorLog)
		.pipe(gulp.dest(output.html))
		.pipe(connect.reload());
	});

	gulp.task('js-minify',function(){
	  return  gulp.src(input.javascript)
			  	.pipe(changed(input.javascript))
					.pipe(gulpif(jsTest, jshint() ))
					.pipe(gulpif(jsTest, jshint.reporter('default') ))
					 .pipe(gulpif(compress,jsUglify() ))

			     .pipe(gulp.dest(output.javascript))
					.pipe(connect.reload());
	});

	gulp.task('css-minify',function(){
	  return  gulp.src(input.css)
			  	.pipe(changed(input.css))
			    .pipe(gulpif(compress,cssnano() ))
					.on('error',errorLog)
			    .pipe(gulp.dest(output.css))
					.pipe(connect.reload());
	});

	gulp.task('jade', function() {
	  gulp.src(input.jade)
			.pipe(changed(input.jade))
	    .pipe(gJade({
				pretty:!compress
			}))
	    .pipe(gulp.dest(output.jade))
			.pipe(connect.reload());
	});

	gulp.task('sass', function () {
	  return gulp.src(input.sass)
			.pipe(changed(input.sass))
	    .pipe(sass().on('error', sass.logError))
			.pipe(gulpif(compress,cssnano() ))
			.pipe(gulp.dest(output.sass))
			.pipe(connect.reload());
	});

	gulp.task('clear', function () {
		 return gulp.src(outputDir, { read: false })
		 .pipe(rimraf());
	});

	gulp.task("server", function() {
				connect.server({
				  root: outputDir,
				  port: 8080,
					livereload: true
				});
	});

  gulp.task('jade-sass-watch',function(){
    gulp.watch(input.javascript,['js-minify']);
    gulp.watch(input.jade,['jade']);
    gulp.watch(input.sass,['sass']);
  });
  gulp.task('svg-minify', function () {
      return gulp.src(input.svg)
          .pipe(svgmin())
          .pipe(gulp.dest(output.svg));
  });
	gulp.task('watch',function(){
    gulp.watch(input.html,['html-minify']);
    gulp.watch(input.javascript,['js-minify']);
	  gulp.watch(input.css,['css-minify']);
	});


	gulp.task('default',['html-minify','js-minify','css-minify','watch','server']);
	gulp.task('jade-sass',['jade','sass','js-minify','jade-sass-watch','server']);
	gulp.task('deploy',['clear','sync','html-minify','js-minify','css-minify']);
	gulp.task('clean',['clean','sync']);
