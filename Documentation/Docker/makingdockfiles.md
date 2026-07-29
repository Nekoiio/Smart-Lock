# Creating dockerfiles for isolation
---
## Steps
1.  **Base image — what does your code need to run?**
    - Our backend is Node/TypeScript . We need an image that already has Node.js installed. Docker Hub has official node images in various sizes — node:20-alpine is a good choice (Alpine = a minimal Linux distro, much smaller image size than the default)

1. **Working directory — where should everything live inside the container?**
    - Containers start empty (aside from the base image). You want a consistent folder to work in, e.g. /app. This is WORKDIR.

1. **Install dependencies — but think about order for caching**
    - Docker builds in layers, and caches each layer — if a layer hasn't changed, Docker reuses the cached version instead of redoing it. npm install is slow; your actual source code changes far more often than your package.json does. So: copy only package.json and package-lock.json first, run npm install, and then copy the rest of your source code afterward. That way, editing a .ts file doesn't force npm to reinstall everything on every rebuild — only changing dependencies does.

1. **Copy the rest of your source code**
    - After dependencies are installed, copy everything else in.

1. **Anything that needs to run at build time, not runtime?**
    - Think back to what you had to run manually after cloning/pulling this project — is there a Prisma-related command that generates code from schema.prisma? That needs to happen inside the image build too, or the generated client won't exist when the container starts.

1. **Expose the port your app listens on**
    - Just documentation/metadata for Docker (EXPOSE) — doesn't actually do the port mapping (that's ports: in Compose), but it's good practice to declare it.

1. **The actual startup command**
    - What command did you run manually every morning to start your backend? That's your CMD.

