var gulp = require('gulp');
var typescript = require('gulp-tsc');

gulp.task('compile', function(){
    gulp.src(['src/**/*.ts'])
        .pipe(typescript({
            target: 'ES5',
            declaration: true
        }))
        .pipe(gulp.dest('dest/'))
});

var fs = require('fs');
gulp.task('template', function() {
    fs.readFile('templates/template.handlebars', 'utf8', function(err, str) {
        var commentStart = "{{!type";
        var commentEnd = "}}";

        var commentStartIndex = str.indexOf(commentStart);
        var commentEndIndex = str.indexOf(commentEnd);
        var typeDeclarations = str.substring(commentStartIndex + commentStart.length, commentEndIndex).trim();
        typeDeclarations = "class Template {\n\t" + typeDeclarations + "\n}";
        fs.writeFile('templates/Template.ts', typeDeclarations, 'utf8');
    });

});