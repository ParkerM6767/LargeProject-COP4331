# LargeProject-COP4331

## Setup

1. Install [Docker](https://docs.docker.com/engine/install/)
2. Create a `.env` file based off of `.env.example`
3. Run `docker compose up -d`

The frontend runs by default on port `5173`, and the backend runs on port `8000`. Any edits to the files should automatically reflect in the programs.

To stop the server, run `docker compose down`. Specific services can be stopped or started by adding the name (currently `frontend` or `backend`)
