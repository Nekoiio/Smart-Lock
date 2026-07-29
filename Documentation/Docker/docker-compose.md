# Make a safe and approproate docker 

---
## Step 1: List every service that needs to run

Write down, in plain English, every distinct "thing" your app needs running simultaneously. For us right nowge queue, frontend, etc. Each one becomes a top-level entry under ``services:``.

## Step 2: For each service, answer — "image or build?"
If it's an existing, publicly published thing (Postgres, Redis, nginx) → use image: postgres:16 (name + version tag). Someone else already wrote the Dockerfile; you're just pulling it.
If it's your own code → use ``build: ./path-to-that-code``, which tells Compose "look for a Dockerfile in this folder and build an image from it." This is the signal for "do I need a Dockerfile for this service" — yes, if you wrote build:, no if you wrote image:.
## Step 3: For each service, ask — "does anything outside Docker need to reach this?"
If yes (your Postgres needs to be reachable by Prisma CLI running on your actual machine, your backend needs to be reachable by a browser or an ESP32) → add a ``ports: mapping: "<host_port>:<container_port>``".
If no (a service that only ever talks to other containers, never to your host machine or the outside world) → skip ports: entirely. It'll still be reachable by other containers via the internal network regardless.
## Step 4: For each service, ask — "does it need configuration/secrets?"

Add an environment: block for anything the service reads as an env var at startup — connection strings, passwords, API keys, feature flags. Ask yourself for each value: "is this the same in every environment, or does it change?" If it changes (a password, a URL), it belongs here, not hardcoded into the Dockerfile.

Critical sub-question for this step, specific to Compose: for any URL/address pointing at another service in this same file, use that service's name as the hostname, not localhost. This is the step people mess up most — go through your environment variables and check: "does this value reference another container? If so, did I use the service name instead of localhost?"

## Step 5: Figure out startup order and dependencies

Ask: "does this service crash or misbehave if it starts before another one is actually ready?" If yes, add depends_on:. Then ask the harder question: "is 'the container process started' actually the same as 'this service is ready to accept requests'?" Usually no, especially for databases — so add a healthcheck: and use depends_on: condition: service_healthy rather than the plain (weaker) depends_on: form.

## Step 6: Figure out what needs to survive a container being deleted

Ask, service by service: "if I delete and recreate this container, do I lose something I care about?" Databases: yes, always. Your backend's own code: no (it's rebuilt from source every time anyway). For anything where the answer is yes, add a named volumes: entry and mount it to wherever that service stores its data internally (for Postgres specifically, that's always /var/lib/postgresql/data — a fact you just look up/remember per-technology, not something you derive).

## Step 7: Write it, then trace through it out loud

Before running it, literally read your own file top to bottom and narrate: "service X starts first because Y depends on it being healthy. Service Y then starts, connects to X using the hostname x, on the internal network. From my host machine, I can reach Y directly because I mapped its port. I can't reach X directly unless I also mapped its port." If that narration doesn't make sense to you, something in the file is probably wrong.