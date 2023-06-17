install:
	npm install -g yarn netlify-cli
	yarn
	netlify login

dev:
	netlify dev

.PHONY: install