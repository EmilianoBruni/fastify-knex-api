# config 
ARG IDIR
# development|production
ARG BMODE=development

# 01a - base image
FROM ebruni/pnpm AS base
ARG IDIR
# add node_modules executables to PATH
ENV PATH="/ws/${IDIR}/node_modules/.bin:${PATH}"

# 02a - Install dependencies only when package.json changes
FROM base AS deps
ARG IDIR
ARG BMODE
ENV NODE_ENV=${BMODE}
WORKDIR /ws/${IDIR}
# Install dependencies based on the preferred package manager
COPY --chown=node:node package.json .npmrc* pnpm-lock.yaml* ./
RUN --mount=type=cache,id=fastify-knex_pnpm-store,uid=1001,gid=1001,target=/home/node/pnpm/store [ -e pnpm-lock.yaml ] && pnpm install --frozen-lockfile || pnpm install

# 03a - Rebuild the source code only when needed
FROM base AS builder
ARG IDIR
ARG BMODE
ENV NODE_ENV=${BMODE}
WORKDIR /ws/${IDIR}
COPY --chown=node:node . ./
COPY --chown=node:node --from=deps ws/${IDIR}/pnpm-lock.yaml* .
COPY --chown=node:node --from=deps ws/${IDIR}/node_modules ./node_modules
# RUN pnpm run build

# 04a - Production image
FROM base AS runner
ARG IDIR
ARG BMODE
ENV NODE_ENV=\${BMODE} APP=${APP} SERVICE=${SERVICE}
WORKDIR /ws/${IDIR}

LABEL org.opencontainers.image.authors="Bruni Emiliano <info@ebruni.it>"
LABEL org.opencontainers.image.version=1.0

#COPY --from=builder ws/\${IDIR}/dist ./dist # da decommentare dopo aver aggiunto build sopra
COPY --from=builder ws/${IDIR}/node_modules ./node_modules
COPY --from=builder ws/${IDIR}/package.json ws/${IDIR}/pnpm-lock.yaml* ./

CMD [""]
