FROM ubuntu:16.04

ARG API_HOME=/home/api

# Install basic packages to connect servers
RUN apt-get update && \
    apt-get install -y git openssh-client openssh-server curl

# Install Node.js from the Debian-based distributions repository
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs && \
    npm install npm --global

# Install OpenCV
RUN apt-get install -y libopencv-dev python-opencv

RUN apt-get -y autoremove \
    && apt-get -y clean  \
    && rm -rf /var/lib/apt/lists/*

# Install pm2 to manage processes
RUN npm install -g pm2

RUN useradd -ms /bin/bash -d ${API_HOME} api

COPY script/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

COPY common ${API_HOME}/common
COPY server ${API_HOME}/server
COPY *.json ${API_HOME}/

WORKDIR ${API_HOME}

RUN npm install . && \
    chown -R api:api /home/api

ENTRYPOINT ["/entrypoint.sh"]
