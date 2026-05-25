FROM node:22.21.1-bullseye-slim AS base

ARG WORKDIR=/app
WORKDIR ${WORKDIR}
ENV YARN_PATH="${WORKDIR}/node_modules"
ARG VERSION=unknown
ARG BRANCH=unknown
ARG COMMIT=unknown
ARG NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base AS build
ENV NODE_ENV=dev
COPY package.json yarn.lock ./
RUN yarn install

# Building image used in testing
FROM build AS test
COPY . .

# Final stage for app image
FROM base AS final
COPY --from=build "${YARN_PATH}" "${YARN_PATH}"
COPY . .
RUN apt-get update \
  && apt-get install -y curl \
  && apt-get upgrade -y \
  && rm -rf /var/lib/apt/lists/* \
  && yarn build
ENV ENV=$ENV
ENV VERSION=$VERSION
ENV NODE_ENV=$NODE_ENV
RUN yarn install

LABEL branch=$BRANCH commit=$COMMIT env=$ENV version=$VERSION

EXPOSE 3000

CMD [ "yarn", "start" ]
