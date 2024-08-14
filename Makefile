all: run

run:
	mkdir -p app/postgres_db
	docker compose up

backend:
	docker compose up backend

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
	- rm -r app/postgres_db

prune: fclean
	docker system prune -af
	docker volume prune -f

.PHONY:	all clean fclean re rebuild run prune backend
