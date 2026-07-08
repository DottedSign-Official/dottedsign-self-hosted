# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.2.2
ARG BASE_IMAGE_VARIANT=slim
FROM ruby:$RUBY_VERSION-$BASE_IMAGE_VARIANT AS base

# Set an environment variable to store where the app is installed to inside
# of the Docker image.
ARG TARGETARCH
ARG RAILS_ENV=development
ENV RAILS_ENV=$RAILS_ENV
ENV DATABASE_HOST=postgres
ENV REDIS_HOST=redis
ENV BUNDLE_PATH="/usr/local/bundle"

WORKDIR /jackrabbit

# Install dependencies:
ARG JAVA_VERSION=17
RUN apt-get update \
        && apt-get install -qq -y build-essential cron libpq5 nodejs vim \
        shared-mime-info wkhtmltopdf ttf-wqy-zenhei imagemagick libmagickwand-dev ffmpeg qpdf \
        openjdk-${JAVA_VERSION}-jdk --fix-missing --no-install-recommends

# Change pdf policy in imagemagick policy file
COPY config/image_magick/policy.xml /etc/ImageMagick-6/

ENV JAVA_HOME=/usr/lib/jvm/java-${JAVA_VERSION}-openjdk-${TARGETARCH}
ENV PATH=$JAVA_HOME/bin:$PATH

# ===================================

FROM base AS build
ARG BUNDLE_GEMS_CONTRIBSYS_COM
RUN apt-get install -qq -y libpq-dev --fix-missing --no-install-recommends
COPY Gemfile Gemfile.lock ./
COPY lib/on_premise_license ./lib/on_premise_license
COPY config/on_premise_rsa ./config/on_premise_rsa
COPY config/license.key ./config/license.key
RUN  gem install bundler:2.4.18 \
        && bundle config set --local without 'development test' \
        && bundle config gems.contribsys.com $BUNDLE_GEMS_CONTRIBSYS_COM \
        && bundle install

# ===================================

FROM build AS test

# Install packages needed for testing
RUN bundle config set --local without 'development' \
        && bundle install
COPY . .

# ===================================

# Final stage for app image
FROM base AS final

ENV OPENSSL_PASS password
# Copy in the application code from your work station at the current directory
# over to the working directory.
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
RUN mkdir -p tmp/pids tmp/cache tmp/sockets
COPY . .

ARG BRANCH=none
ARG COMMIT=none
ARG VERSION=none
LABEL branch=$BRANCH commit=$COMMIT env=$RAILS_ENV version=$VERSION

EXPOSE 3000

ENTRYPOINT ["bundle", "exec"]
CMD ["puma", "-C", "config/puma.rb"]
