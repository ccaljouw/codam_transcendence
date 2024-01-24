
all: run

run:
	docker compose up

backend:
	docker compose up backend

coverage:
	docker compose up nginx

re: clean
	docker compose up

rebuild: clean
	docker compose up --build

clean:
	docker compose down

fclean: clean
	- docker rmi transcendence-backend
	- docker rmi transcendence-frontend
	- rm -r app/backend/dist
	- rm -r app/frontend/.next
	- rm -r app/node_modules
	- rm -r app/coverage

prune: fclean
	docker system prune -af

.PHONY:	all clean fclean re rebuild run prune backend coverage