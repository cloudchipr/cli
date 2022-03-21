FROM node:16

# Pre-requisite distro deps, and build env setup
RUN apt-get --yes update
RUN apt-get --yes install findutils bash vim build-essential curl python3-venv python3-dev --no-install-recommends

WORKDIR /src

# Install Cloud Custodian
RUN python3 -m venv custodian
RUN . custodian/bin/activate && pip install c7n && pip install c7n-org
RUN . custodian/bin/activate && pip install --upgrade pip && pip install c7n_gcp

# SET CUSTODIAN envirnomet variables
ENV C8R_CUSTODIAN="/src/custodian/bin/custodian"
ENV C8R_CUSTODIAN_ORG="/src/custodian/bin/c7n-org"
ENV PATH="$PATH:/src/custodian/bin"

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

RUN npm run build
RUN npm link
