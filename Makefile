include dev/.env
NAME ?= $(shell bash -c 'read -p "Username: " username;)

.PHONY: up
up:
	@docker compose up

.PHONY: down
down:
	@docker compose down

.PHONY: build
build:
	cd .\.tf\ && \
	terraform init && \
	terraform plan && \
	terraform apply -auto-approve

.PHONY: rebuild
rebuild:
	@docker-compose down --remove-orphans
	@docker-compose build --no-cache
.PHONY: install
install:
	docker exec sentilabelling npm i
.PHONY: migrate
migrate:
	npx prisma generate
	docker exec sentilabelling npx prisma generate
	@echo docker exec sentilabelling npx prisma migrate dev --name
deploy:
	docker exec -ti sentilabelling /bin/bash  && \
	npx prisma generate && \
	npx prisma migrate deploy
