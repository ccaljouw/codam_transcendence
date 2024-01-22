
all: run

run: clean
	docker compose up

re: clean
	docker compose up

rebuild: clean
	docker compose up --build

clean:
	docker compose down

fclean: clean
	- docker rmi ft_transcendence-app

prune: fclean
	docker system prune -af

.PHONY:	all clean fclean re rebuild run prune