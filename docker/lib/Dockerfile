# config 
ARG IDIR
# dev|prod
ARG BMODE

# 01a - base image
FROM node:18-alpine AS base
ARG IDIR
# set PNPM_HOME and PATH for root user so corepack can be used
ENV PNPM_HOME="/pnpm" PATH="/pnpm:$PATH" TZ="Europe/Rome"
RUN apk add --no-cache tzdata sudo shadow git && \
    corepack enable && \
    pnpm install -g pm2 && \
    # cosi da far si che l'utente node del container abbia lo stesso id dell'utente bruni 
    # per il debug quando montiamo il filesystem del container con quello dell'host
    usermod -u 1001 node && groupmod -g 1001 node && \
    # per far si che node possa usare sudo senza password
    echo '%node ALL=(ALL) NOPASSWD: ALL' > /etc/sudoers.d/node
# from now on we will use the user node
USER node
# set PNPM_HOME and PATH for node user so we can mount store volume inside the home directory
ENV PNPM_HOME="/home/node/pnpm" 
ENV PATH="${PNPM_HOME}:$PATH"
# set the pnpm store directory
RUN pnpm config set store-dir /home/node/pnpm/store 
# add node_modules/.bin to /home/bruni/.vscode-server/bin/0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2/bin/remote-cli:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games
ENV PATH="/ws/${IDIR}/node_modules/.bin:$PATH"

# 02a - Install dependencies only when package.json changes
FROM base AS deps
WORKDIR /ws/${IDIR}
# Install dependencies based on the preferred package manager
COPY package.json ./
RUN pnpm i

# 03a - Rebuild the source code only when needed
FROM base AS builder
ARG IDIR
WORKDIR /ws/${IDIR}
COPY * .
#COPY --from=deps ws/${IDIR}/node_modules ./node_modules

# 04a - Production image, copy all the files and run next
FROM base AS runner
ARG IDIR
ARG BMODE
WORKDIR /ws/${IDIR}

LABEL org.opencontainers.image.authors="Bruni Emiliano <info@ebruni.it>"
LABEL org.opencontainers.image.version=1.0

COPY --from=builder ws/${IDIR}/. .
#COPY --from=builder ws/${IDIR}/node_modules ./node_modules

CMD [""]
