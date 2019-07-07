# Sherpon virtualhost

## Deploy from Docker container

### 1.1.Build the image
```
docker build -f Dockerfile -t sherpon/virtualhost:https -t sherpon/virtualhost:latest .
```

```sh
docker build -f Dockerfile.http -t sherpon/virtualhost:http .
```

### 1.2.Push the image to the repository
```
docker push sherpon/virtualhost
```

### 1.3.Pull the container in the VM
```
docker pull sherpon/virtualhost
```

### 1.4.Run the container
```sh
docker run \
  --restart always \
  -e DOTENV_PATH="/srv/virtualhost/env/development.env" \
  -v $pwd/virtualhost_docker:/srv/virtualhost \
  -p 80:80 -p 443:443 -p 7000:7000 \
  -d \
  sherpon/virtualhost
```

```sh
docker run \
  --restart always \
  -e DOTENV_PATH="/srv/virtualhost/env/development.env" \
  -v $pwd/virtualhost_docker:/srv/virtualhost \
  -p 80:80 -p 443:443 -p 7000:7000 \
  sherpon/virtualhost:http
```


  ## 1.5.Run the service
Before we can use the ``docker stack deploy`` command we first run:
```
docker swarm init
```

Now let’s run it. You need to give your app a name. Here, it is set to ``virtualhoststack``:
```
// production
docker stack deploy -c docker-compose.yml virtualhoststack
// or
// staging
docker stack deploy -c docker-compose-staging.yml virtualhoststack
```

## 1.6.Stop the service
Take down the app and the swarm.
Take the app down with docker stack rm:
```
docker stack rm virtualhoststack
```

Take down the swarm.
```
docker swarm leave --force
```