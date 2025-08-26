.PHONY: all create-env install format lint clean shell

all: install format lint

VENV := venv
PYTHON := python3.11
VENV_PY := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
BLACK := $(VENV)/bin/black
ISORT := $(VENV)/bin/isort
PYLINT := $(VENV)/bin/pylint

create-env:
	@echo "Creating virtualenv with Python $(PYTHON)"
	@if ! command -v $(PYTHON) >/dev/null; then \
		echo "Python $(PYTHON) not found"; exit 1; \
	fi
	@if [ ! -d $(VENV) ]; then \
		$(PYTHON) -m venv $(VENV); \
	else \
		echo "Virtualenv already exists."; \
	fi

install: create-env
	@echo "Creating virtual environment if needed"
	@if [ ! -d $(VENV) ]; then \
		python3 -m venv $(VENV); \
	fi

	@echo "Upgrading pip"
	$(PIP) install --upgrade pip

	@echo "Testing availability of requirements-dev.txt"
	@if [ ! -f requirements-dev.txt ]; then \
		echo "Missing requirements-dev.txt" >&2; \
		exit 1; \
	fi
	@echo "Installing packages for Dev"
	$(PIP) install -r requirements-dev.txt

	@echo "Installing pre-commit"
	$(PIP) install pre-commit

format:
	@echo "Correcting with black"
	- $(BLACK) . --extend-exclude="venv/*" --skip-magic-trailing-comma --line-length=79

	@echo "Correcting with isort"
	- $(ISORT) . --skip-glob=venv --profile=black --line-length=79

lint:
	@echo "Linting Gauss repo"
	- $(PYLINT) ./ --ignore=venv
	@echo "We allow make to continue despite pylint errors and threshold"

precommit:
	@echo "Installing pre-commit git hooks"
	$(VENV)/bin/pre-commit install

check: format lint
	@echo "All checks passed!"

clean:
	@echo "Removing virtual environment"
	rm -rf $(VENV)

shell:
	@echo "Starting shell with virtualenv activated"
	@bash --rcfile <(echo "source $(VENV)/bin/activate")

help:
	@echo "Usage:"
	@echo "  make all         - install, format, lint"
	@echo "  make create-env  - create virtual environment"
	@echo "  make install     - install dependencies"
	@echo "  make format      - run black and isort"
	@echo "  make lint        - run pylint"
	@echo "  make clean       - remove virtual environment"
	@echo "  make shell       - open shell with venv activated"