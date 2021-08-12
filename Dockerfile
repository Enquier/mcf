FROM registry.access.redhat.com/ubi7/nodejs-12

ENV MBEE_ENV=default \
    NODE_ENV=development

WORKDIR /opt/app-root

USER 0


COPY . /opt/app-root/

RUN chmod +x /opt/app-root/docker-entrypoint.sh \
  && chmod 755 /opt/app-root \
  && chown -R 1001:0 /opt/app-root

USER 1001
# Install yarn
RUN npm install yarn -g

# Create log and artifact project directories
RUN mkdir logs \
    && mkdir -p data/artifacts \
    && mkdir -p all_plugins

# Change permission on entrypoint and app directory
#RUN chmod +x /opt/app-root/docker-entrypoint.sh

# Init git configuration
RUN git init \
    && git config user.email "example@example.com" \
    && git config user.name "MBEE Container Runtime" \
    && git add . \
    && git commit -m "Initialize Container" -q

RUN NOPOSTINSTALL=1 NOPREINSTALL=1 yarn install

EXPOSE 9080 9443

# Run server
ENTRYPOINT ["/opt/app-root/docker-entrypoint.sh"]

CMD ["node","mbee","start"]
