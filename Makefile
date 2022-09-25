COMPILE_FLAGS=-b -m -n
PYTHON_HOME=/usr/local/opt/python@3.8
DEPLOY_DIR=${HOME}/Sites/bedlam

build:     build/snake.js

build/snake.js: snake.py
	transcrypt $(COMPILE_FLAGS) snake.py
	mkdir -p build
	cp -r __target__/* build/

clean:
	rm -rf __target__
	rm -rf /__javascript__
	rm -rf build

deploy: build LICENSE
	mkdir -p $(DEPLOY_DIR)
	cp -rf __target__/ build/
	cp *.html $(DEPLOY_DIR)
	cp -r build $(DEPLOY_DIR)
	cp -r assets $(DEPLOY_DIR)
	cp LICENSE $(DEPLOY_DIR)
	cp *.png $(DEPLOY_DIR)
	cp style.css $(DEPLOY_DIR)
	cp *.json $(DEPLOY_DIR)
	cp *.js $(DEPLOY_DIR)

setup:
	virtualenv venv --python=${PYTHON_HOME}/bin/python3
	venv/bin/python -m pip install transcrypt mypy
	echo "Enter virtual environment with:  . venv/bin/activate"
