COMPILE_FLAGS=-b -m -n
PYTHON_HOME=/usr/local
DEPLOY_DIR=${HOME}/Sites/snake

build:     build/snake.js

build/snake.js: snake.py
	transcrypt $(COMPILE_FLAGS) snake.py
	mkdir -p build
	cp -r __target__/* build/

clean:
	rm -rf __target__
	rm -rf /__javascript__
	rm -rf build
	rm -f snake.zip

deploy: build LICENSE
	mkdir -p $(DEPLOY_DIR)
	cp -rf __target__/ build/
	cp -r assets $(DEPLOY_DIR)
	cp -r build $(DEPLOY_DIR)
	cp *.html $(DEPLOY_DIR)
	cp *.png $(DEPLOY_DIR)
	cp favicon.ico $(DEPLOY_DIR)
	cp LICENSE $(DEPLOY_DIR)
	cp site.webmanifest $(DEPLOY_DIR)
	cp style.css $(DEPLOY_DIR)
	cp sw.js $(DEPLOY_DIR)

zip: build
	cp snake.html index.html
	zip -r snake.zip build assets *.html *.png *.json *.css LICENSE build/index.html
	rm -f index.html

setup:
	virtualenv venv --python=${PYTHON_HOME}/bin/python3
	venv/bin/python -m pip install transcrypt mypy
	chmod 744 venv/bin/activate
	echo "Enter virtual environment with:  . venv/bin/activate"