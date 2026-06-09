#!/bin/bash
# ===========================================
# INKASALUD - Kubernetes Deployment Script
# ===========================================
# Compatible with kubectl, minikube, and podman

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAMESPACE="inkasalud"

echo "================================================"
echo "  INKASALUD - Kubernetes Deployment"
echo "================================================"
echo ""

# Function to wait for deployment
wait_for_deployment() {
    local deployment=$1
    local timeout=${2:-300}
    echo "Waiting for $deployment to be ready..."
    kubectl wait --for=condition=available --timeout=${timeout}s deployment/$deployment -n $NAMESPACE
}

# Function to wait for pod
wait_for_pod() {
    local label=$1
    local timeout=${2:-300}
    echo "Waiting for pods with label $label to be ready..."
    kubectl wait --for=condition=ready pod -l $label -n $NAMESPACE --timeout=${timeout}s
}

# Step 1: Create namespace and base configs
echo "[1/7] Creating namespace and base configurations..."
kubectl apply -f "$SCRIPT_DIR/namespace.yaml"
kubectl apply -f "$SCRIPT_DIR/configmap.yaml"
kubectl apply -f "$SCRIPT_DIR/secrets.yaml"
echo "Base configurations created."
echo ""

# Step 2: Deploy MySQL
echo "[2/7] Deploying MySQL..."
kubectl apply -f "$SCRIPT_DIR/mysql/"
wait_for_pod "app=mysql" 180
echo "MySQL is ready."
echo ""

# Step 3: Deploy RabbitMQ
echo "[3/7] Deploying RabbitMQ..."
kubectl apply -f "$SCRIPT_DIR/rabbitmq/"
wait_for_pod "app=rabbitmq" 180
echo "RabbitMQ is ready."
echo ""

# Step 4: Deploy Discovery Server
echo "[4/7] Deploying Discovery Server..."
kubectl apply -f "$SCRIPT_DIR/discovery-server/"
wait_for_deployment "discovery-server" 180
echo "Discovery Server is ready."
echo ""

# Step 5: Deploy Config Server
echo "[5/7] Deploying Config Server..."
kubectl apply -f "$SCRIPT_DIR/config-server/"
wait_for_deployment "config-server" 180
echo "Config Server is ready."
echo ""

# Step 6: Deploy remaining services
echo "[6/7] Deploying API Gateway and business services..."
kubectl apply -f "$SCRIPT_DIR/api-gateway/"
kubectl apply -f "$SCRIPT_DIR/auth-service/"
kubectl apply -f "$SCRIPT_DIR/cliente-service/"
kubectl apply -f "$SCRIPT_DIR/catalogo-service/"
kubectl apply -f "$SCRIPT_DIR/ventas-service/"
kubectl apply -f "$SCRIPT_DIR/personal-service/"

# Wait for all services
echo ""
echo "Waiting for all services to be ready..."
wait_for_deployment "api-gateway" 180
wait_for_deployment "auth-service" 180
wait_for_deployment "cliente-service" 180
wait_for_deployment "catalogo-service" 180
wait_for_deployment "ventas-service" 180
wait_for_deployment "personal-service" 180

# Step 7: Deploy Frontend
echo ""
echo "[7/7] Deploying Frontend..."
kubectl apply -f "$SCRIPT_DIR/frontend/"
wait_for_deployment "frontend" 120
echo "Frontend is ready."

echo ""
echo "================================================"
echo "  Deployment Complete!"
echo "================================================"
echo ""
echo "Services:"
kubectl get pods -n $NAMESPACE
echo ""
echo "Access:"
echo "  Frontend:    kubectl port-forward svc/frontend 4200:80 -n $NAMESPACE"
echo "  API Gateway: kubectl port-forward svc/api-gateway 8080:8080 -n $NAMESPACE"
echo "  Eureka:      kubectl port-forward svc/discovery-server 8761:8761 -n $NAMESPACE"
echo "  RabbitMQ:    kubectl port-forward svc/rabbitmq 15672:15672 -n $NAMESPACE"
echo ""
