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
	docker compose up

# rebuilds the images and application after clearing the app volume. Does not clear de database volume
# use make re after changes to dockerfiles or startup scripts.
re: down
	@echo -e "$(COLOR_BLUE) **** REMOVE APP VOLUME ****$(COLOR_RESET)"
	$(call color_output, docker volume rm transcendence_app)
	docker compose up --build

start:
	docker compose start

stop:
	docker compose stop

down:
	@echo -e "$(COLOR_BLUE) **** REMOVING DOCKER CONTAINERS****$(COLOR_RESET)"
	docker compose down

# cleans only the build files
clean: down
	@echo -e "$(COLOR_BLUE) **** CLEANING BUILD FILES ****$(COLOR_RESET)"
	$(call color_output, rm -rf ./app/backend/dist)
	$(call color_output, rm -rf ./app/frontend/.next)

# cleans all build files, test coverage and docker images and volumes
fclean: cleanvolumes
	@echo -e "$(COLOR_BLUE) **** REMOVING DOCKER IMAGES FRONTEND AND BACKEND****$(COLOR_RESET)"
	$(call color_output, docker rmi frontend)
	$(call color_output, docker rmi backend)
	@echo -e "$(COLOR_BLUE) **** REMOVING TEST COVERAGE****$(COLOR_RESET)"
	$(call color_output, rm -rf ./app/coverage)

cleandatabase: clean
	@echo -e "$(COLOR_BLUE) **** REMOVE DATABASE VOLUMES ****$(COLOR_RESET)"
	$(call color_output, docker volume rm transcendence_database_files)

# cleans also the database volume
cleanvolumes: clean
	@echo -e "$(COLOR_BLUE) **** REMOVE DOCKER VOLUMES ****$(COLOR_RESET)"
	$(call color_output, docker volume rm transcendence_app)
	$(call color_output, docker volume rm transcendence_database_files)

.PHONY:	all run re start stop down clean fclean cleandatabase cleanvolumes backend
