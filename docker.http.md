# Sherpon virtualhost HTTP Docker

### 1.1.Build the image
```sh
docker build -f Dockerfile.http -t sherpon/virtualhost:http .
```

### 1.2.Push the image to the repository
```sh
docker push sherpon/virtualhost:http
```

### 1.3.Pull the container in the VM
```sh
docker pull sherpon/virtualhost:http
```

### 1.4.Run the container
```sh
# detached
docker run \
  --name=virtualhost \
  --restart always \
  -e DOTENV_PATH="/srv/virtualhost/env/development.env" \
  -v $PWD/virtualhost_docker:/srv/virtualhost \
  -p 80:80 -p 443:443 -p 7000:7000 \
  -d \
  sherpon/virtualhost:http
```

```sh
# attached
docker run \
  --name=virtualhost \
  -e DOTENV_PATH="/srv/virtualhost/env/development.env" \
  -v $PWD/virtualhost_docker:/srv/virtualhost \
  -p 80:80 -p 443:443 -p 7000:7000 \
  --rm \
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