# NGINX Ingress Controller Installation

This contains the NGINX controller built around the Kubernetes Ingress resource that uses ConfigMap to store the NGINX configuration.

Official Documentation: [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx)


## Installation

The following resources are required for a generic deployment.

Information and commands extracted from [NGINX Ingress Controller Deployment](https://github.com/kubernetes/ingress-nginx/tree/master/deploy)

### Mandatory commands

```console
curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/namespace.yaml \
    | kubectl apply -f -

curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/default-backend.yaml \
    | kubectl apply -f -

kubectl apply -f ./nginx-configuration.yaml

curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/tcp-services-configmap.yaml \
    | kubectl apply -f -

curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/udp-services-configmap.yaml \
    | kubectl apply -f -

curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/without-rbac.yaml \
    | kubectl apply -f -
```

### Custom Service Provider Deployment

#### minikube

For standard usage:

```console
minikube addons enable ingress
```

For development:

1. Disable the ingress addon:

```console
$ minikube addons disable ingress
```

2. Use the [docker daemon](https://github.com/kubernetes/minikube/blob/master/docs/reusing_the_docker_daemon.md)
3. [Build the image](../docs/development.md)
4. Perform [Mandatory commands](#mandatory-commands)
5. Install the `nginx-ingress-controller` deployment [without RBAC roles](#install-without-rbac-roles) or [with RBAC roles](#install-with-rbac-roles)
6. Edit the `nginx-ingress-controller` deployment to use your custom image. Local images can be seen by performing `docker images`.

```console
$ kubectl edit deployment nginx-ingress-controller -n ingress-nginx
```

edit the following section:

```yaml
image: <IMAGE-NAME>:<TAG>
imagePullPolicy: IfNotPresent
name: nginx-ingress-controller
```

7. Confirm the `nginx-ingress-controller` deployment exists:

```console
$ kubectl get pods -n ingress-nginx 
NAME                                       READY     STATUS    RESTARTS   AGE
default-http-backend-66b447d9cf-rrlf9      1/1       Running   0          12s
nginx-ingress-controller-fdcdcd6dd-vvpgs   1/1       Running   0          11s
```

#### GCE - GKE

Patch the nginx ingress controller deployment to add the flag `--publish-service`

```console
kubectl patch deployment -n ingress-nginx nginx-ingress-controller --type='json' \
  --patch="$(curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/patch-deployment.yaml)"

curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/gce-gke/service.yaml \
    | kubectl apply -f -

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/patch-service-without-rbac.yaml
```

**Important Note:** proxy protocol is not supported in GCE/GKE

## Verify installation
```
kubectl get all --namespace=ingress-nginx
kubectl get pods --all-namespaces -l app=ingress-nginx --watch
```
## See Ingres controller logs
```
kubectl logs -n=ingress-nginx -l app=ingress-nginx
```