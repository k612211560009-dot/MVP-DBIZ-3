Development environment (Docker)

This file explains how to run the backend and a MySQL dev database using Docker Compose.

Files added:

- `docker-compose.yml` - brings up MySQL (initialized with `MB_schema_v3.sql`) and the backend container
- `Dockerfile` - development container for backend
- `.env.docker` - example environment values used by Docker Compose

Quick start (bash)

1. From the `backend/` folder, copy or edit `.env.docker` with secure values if needed.

2. Start services:

```bash
# run from d:/dbiz/dbiz3/Mainweb/backend
docker compose up --build
```

3. First-run DB initialization

- The MySQL official image will execute any `*.sql` files mounted into `/docker-entrypoint-initdb.d/` on first initialization. The compose file mounts `../MB_schema_v3.sql` into that folder so the schema will be created automatically when the DB initializes.

4. Test backend connectivity

```bash
# once containers are up
# run a quick DB + model load test inside the backend container
docker compose exec backend npm run test:connection
```

5. Accessing services

- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health
- MySQL (TCP): 3306 (mapped from container)

Notes and troubleshooting

- If you change `MB_schema_v3.sql` and want MySQL to re-run the script, remove the `db_data` Docker volume (this will delete DB data):

```bash
# stop services first
docker compose down
# remove the volume
docker volume rm $(docker volume ls -q | grep milkbank_backend_db_data || true)
# or remove by name:
# docker volume rm <your_project>_db_data
# then bring up again
docker compose up --build
```

- Use `.env.docker` to configure credentials and ports. Do NOT commit production secrets.

What's next

- **Added**: `docker-compose.override.yml` with Adminer DB admin UI and debugging tools
- Add seeders and a `db:reset` npm script to automate test-data seeding

## Development Tools (Override)

The project includes `docker-compose.override.yml` which automatically extends the base compose setup:

### Adminer (Database Admin UI)

- **URL**: http://localhost:8080
- **Server**: db
- **Username**: milkbank
- **Password**: milkbank_pass
- **Database**: milkbank_dev

### Node.js Debugging

- Debug port exposed on **9229**
- Enhanced logging with `DEBUG=app:*`
- Use VS Code "Attach to Container" or connect debugger to `localhost:9229`

### Test Data Seeding

```bash
# After containers are running:
docker compose exec backend npm run seed

# Test accounts created:
# Admin: admin@milkbank.com / password123
# Staff: staff@milkbank.com / password123
# Donor: donor1@example.com / password123
```
