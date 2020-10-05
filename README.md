Ticket selling shop built using NodeJS, TypeScript, Docker, K8s and a bunch of dev tooling. Follows a udemy course on building Production level ecommerce application.

## Notes

1. Sample commands for storing secrets in K8s

- `kubectl create secret generic secrets-box --from-literal="S1=;lkj" --from-literal=S2="a;sldkfj"`
- `kubectl delete secret secrets-box`
- `kubectl get secrets secrets-box`
