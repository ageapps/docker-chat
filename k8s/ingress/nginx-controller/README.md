# NGINX Ingress Controller Installation

This contains the NGINX controller built around the Kubernetes Ingress resource that uses ConfigMap to store the NGINX configuration.

Official Documentation: [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx)


## Installation

```
kubectl apply -f ./namespace.yaml
kubectl apply -f ./default-backend.yaml
kubectl apply -f ./tcp-services-config.yaml
kubectl apply -f ./udp-services-config.yaml
kubectl apply -f ../nginx-controller-config.yaml
kubectl apply -f ./service.yaml
kubectl apply -f ./deployment.yaml
```

## Verify installation
```
kubectl get pods --all-namespaces -l app=ingress-nginx --watch
kubectl get all --namespace=ingress-nginx
```