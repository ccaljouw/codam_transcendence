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


all: update-env run

run: clean
	docker compose up

update-env:
	@echo "Removing existing .env file (if present)..."
	@rm -f .env
	@echo "Creating new .env file..."
	@NEW_HOST=$(shell hostname || echo ""); \
	if [ -n "$$NEW_HOST" ]; then \
		echo "HOST=$${NEW_HOST}" > .env; \
		echo "FRONTEND_URL=\"http://$${NEW_HOST}:3000\"" >> .env; \
		echo "BACKEND_URL=\"http://$${NEW_HOST}:3001\"" >> .env; \
		echo "FRONTEND_URL_LOCAL=\"http://localhost:3000\"" >> .env; \
		echo "NEXT_PUBLIC_FRONTEND_URL=\"http://$${NEW_HOST}:3000\"" >> .env; \
		echo "NEXT_PUBLIC_BACKEND_URL=\"http://$${NEW_HOST}:3001\"" >> .env; \
		echo "Created new .env with HOST=$$NEW_HOST"; \
	else \
		echo "Failed to retrieve host IP."; \
	fi

# rebuilds the images and application after clearing the app volume. Does not clear de database volume
# use make re after changes to dockerfiles or startup scripts.
re: clean update-env
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
	$(call color_output, docker volume rm database_files)

cleannodemodules: clean
	@echo -e "$(COLOR_BLUE) **** REMOVE NODE_MODULES VOLUMES ****$(COLOR_RESET)"
	$(call color_output, docker volume rm node_modules)

# cleans also the database volume
cleanvolumes: cleandatabase cleannodemodules

.PHONY:	all run re start stop down clean fclean cleanvolumes cleandatabase cleannodemodules update-env
