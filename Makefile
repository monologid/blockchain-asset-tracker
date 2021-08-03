.PHONY:  rebuild
rebuild:
	docker container rm -f bigchaindb && docker-compose up --force-recreate --no-deps 
