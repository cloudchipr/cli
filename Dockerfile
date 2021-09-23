FROM node:14

# Pre-requisite distro deps, and build env setup
RUN apt-get --yes update
RUN apt-get --yes install findutils bash build-essential curl python3-venv python3-dev --no-install-recommends

WORKDIR /src

# Install Cloud Custodian
RUN python3 -m venv custodian
RUN . custodian/bin/activate && pip install c7n

# Create app directory
WORKDIR /src/c8r-cli

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

COPY /Users/tsardaryan/projects/cloudchipr-engine /src/cr8-cli/node_modules/cloudchipr-engine

RUN npm link

# SET CUSTODIAN envirnomet variable
ENV C8R_CUSTODIAN=../custodian/bin/custodian

