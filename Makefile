COLOR_RESET=\033[0m
COLOR_GREEN=\033[32m
COLOR_RED=\033[31m
COLOR_BLUE=\033[34m

define color_output
  @output=`$(1) 2>&1`; \
  if [ $$? -eq 0 ]; then \
    echo -e "$(COLOR_GREEN)$(1): $$output$(COLOR_RESET)"; \
  else \
    echo -e "$(COLOR_RED)$(1): $$output$(COLOR_RESET)"; \
  fi
endef

all: run

run: clean
	@echo -e "$(COLOR_BLUE) **** CREATE FOLDERS AND DOCKER_COMPOSE UP ****$(COLOR_RESET)"
	$(call color_output, mkdir -p ./app/postgres_db)
	docker compose up

re: fclean
	@echo -e "$(COLOR_BLUE) **** CREATE FOLDERS AND DOCKER_COMPOSE UP ****$(COLOR_RESET)"
	$(call color_output, mkdir -p ./app/postgres_db)
	docker compose up --build

start:
	docker compose start

stop:
	docker compose stop

clean: 
	@echo -e "$(COLOR_BLUE) **** REMOVING DOCKER CONTAINERS****$(COLOR_RESET)"
	docker compose down
	@echo -e "$(COLOR_BLUE) **** CLEANING BUILD FILES ****$(COLOR_RESET)"
	$(call color_output, rm -rf ./app/backend/dist)
	$(call color_output, rm -rf ./app/frontend/.next)

fclean: clean
	@echo -e "$(COLOR_BLUE) **** REMOVING DOCKER IMAGES****$(COLOR_RESET)"
	@$(call color_output, docker rmi rmi transcendence-backend)
	@$(call color_output, docker rmi rmi transcendence-frontend)
	@echo -e "$(COLOR_BLUE) **** REMOVING NODE MODULES AND TEST COVERAGE****$(COLOR_RESET)"
	$(call color_output, rm -rf ./app/node_modules)
	$(call color_output, rm -rf ./app/coverage)

prune: fclean
	@echo -e "$(COLOR_BLUE) **** DOCKER SYSTEM PRUNE REMOVING ALL CONTAINERS IMAGES AND VOLUMES ****$(COLOR_RESET)"
	docker system prune -af
	docker volume prune -af
	@echo -e "$(COLOR_BLUE) **** REMOVE DATABASE DATA ****$(COLOR_RESET)"
	$(call color_output, rm -rf ./app/postgres_db)

.PHONY:	all run re start stop clean fclean prune backend
