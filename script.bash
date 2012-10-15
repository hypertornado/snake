#script for starting all compilations needed for front end development

JS_PATH="src/main/webapp/js"

compile_coffeescript(){ 
	coffee -wbl -j "canvas.js" -c *.coffee
}

compile_coffeescript