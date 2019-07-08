# Sherpon virtualhost HTTPS Docker

### 1.1.Build the image
```
docker build -f Dockerfile -t sherpon/virtualhost:https -t sherpon/virtualhost:latest .
```

### 1.2.Push the image to the repository
```
docker push sherpon/virtualhost
docker push sherpon/virtualhost:https
```

### 1.3.Pull the container in the VM
```
docker pull sherpon/virtualhost:https
```

### 1.4.Run the container
```sh
# PRODUCTION
# detached
docker run \
  --name=vh \
  --restart always \
  -e DOTENV_PATH="/srv/virtualhost/env/production.env" \
  -v $PWD/virtualhost_docker:/srv/virtualhost \
  -p 80:80 -p 443:443 -p 7000:7000 \
  -d \
  sherpon/virtualhost:https
```

```sh
# STAGING
# detached
docker run \
  --name=vh \
  --restart always \
  -e DOTENV_PATH="/srv/virtualhost/env/staging.env" \
  -v $PWD/virtualhost_docker:/srv/virtualhost \
  -p 80:80 -p 443:443 -p 7000:7000 \
  -d \
  sherpon/virtualhost:https
```

```sh
# DEVELOPMENT
# attached
docker run \
  --name=vh \
  -e DOTENV_PATH="/srv/virtualhost/env/staging.env" \
  -v $PWD/virtualhost_docker:/srv/virtualhost \
  -p 80:80 -p 443:443 -p 7000:7000 \
  --rm \
  sherpon/virtualhost:https
```


## 1.5.Run the service
Before we can use the ``docker stack deploy`` command we first run:
```sh
docker swarm init
```

Now let’s run it. You need to give your app a name. Here, it is set to ``virtualhoststack``:
```sh
# production
docker stack deploy -c docker-compose.production.yml vh

# staging
docker stack deploy -c docker-compose.staging.yml vh

# development
docker stack deploy -c docker-compose.development.yml vh
```

## 1.6.Stop the service
Take down the app and the swarm.
Take the app down with docker stack rm:
```sh
docker stack rm vh
```

Take down the swarm.
```sh
docker swarm leave --force
```