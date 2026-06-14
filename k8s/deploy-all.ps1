# ===========================================
# INKASALUD - Kubernetes Deployment Script
# ===========================================
# PowerShell version for Windows
# Compatible with kubectl, minikube, and podman

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Namespace = "inkasalud"

Write-Host "================================================"
Write-Host "  INKASALUD - Kubernetes Deployment"
Write-Host "================================================"
Write-Host ""

function Wait-ForDeployment {
    param(
        [string]$Deployment,
        [int]$Timeout = 300
    )
    Write-Host "Waiting for $Deployment to be ready..."
    kubectl wait --for=condition=available --timeout="${Timeout}s" deployment/$Deployment -n $Namespace
}

function Wait-ForPod {
    param(
        [string]$Label,
        [int]$Timeout = 300
    )
    Write-Host "Waiting for pods with label $Label to be ready..."
    kubectl wait --for=condition=ready pod -l $Label -n $Namespace --timeout="${Timeout}s"
}

# Step 1: Create namespace and base configs
Write-Host "[1/7] Creating namespace and base configurations..."
kubectl apply -f "$ScriptDir\namespace.yaml"
kubectl apply -f "$ScriptDir\configmap.yaml"
kubectl apply -f "$ScriptDir\secrets.yaml"
Write-Host "Base configurations created."
Write-Host ""

# Step 2: Deploy MySQL
Write-Host "[2/7] Deploying MySQL..."
kubectl apply -f "$ScriptDir\mysql\"
Wait-ForPod -Label "app=mysql" -Timeout 180
Write-Host "MySQL is ready."
Write-Host ""

# Step 3: Deploy RabbitMQ
Write-Host "[3/7] Deploying RabbitMQ..."
kubectl apply -f "$ScriptDir\rabbitmq\"
Wait-ForPod -Label "app=rabbitmq" -Timeout 180
Write-Host "RabbitMQ is ready."
Write-Host ""

# Step 4: Deploy Discovery Server
Write-Host "[4/7] Deploying Discovery Server..."
kubectl apply -f "$ScriptDir\discovery-server\"
Wait-ForDeployment -Deployment "discovery-server" -Timeout 180
Write-Host "Discovery Server is ready."
Write-Host ""

# Step 5: Deploy Config Server
Write-Host "[5/7] Deploying Config Server..."
kubectl apply -f "$ScriptDir\config-server\"
Wait-ForDeployment -Deployment "config-server" -Timeout 180
Write-Host "Config Server is ready."
Write-Host ""

# Step 6: Deploy remaining services
Write-Host "[6/7] Deploying API Gateway and business services..."
kubectl apply -f "$ScriptDir\api-gateway\"
kubectl apply -f "$ScriptDir\auth-service\"
kubectl apply -f "$ScriptDir\cliente-service\"
kubectl apply -f "$ScriptDir\catalogo-service\"
kubectl apply -f "$ScriptDir\ventas-service\"
kubectl apply -f "$ScriptDir\personal-service\"

# Wait for all services
Write-Host ""
Write-Host "Waiting for all services to be ready..."
Wait-ForDeployment -Deployment "api-gateway" -Timeout 180
Wait-ForDeployment -Deployment "auth-service" -Timeout 180
Wait-ForDeployment -Deployment "cliente-service" -Timeout 180
Wait-ForDeployment -Deployment "catalogo-service" -Timeout 180
Wait-ForDeployment -Deployment "ventas-service" -Timeout 180
Wait-ForDeployment -Deployment "personal-service" -Timeout 180

# Step 7: Deploy Frontend
Write-Host ""
Write-Host "[7/7] Deploying Frontend..."
kubectl apply -f "$ScriptDir\frontend\"
Wait-ForDeployment -Deployment "frontend" -Timeout 120
Write-Host "Frontend is ready."

Write-Host ""
Write-Host "================================================"
Write-Host "  Deployment Complete!"
Write-Host "================================================"
Write-Host ""
Write-Host "Services:"
kubectl get pods -n $Namespace
Write-Host ""
Write-Host "Access:"
Write-Host "  Frontend:    kubectl port-forward svc/frontend 4200:80 -n $Namespace"
Write-Host "  API Gateway: kubectl port-forward svc/api-gateway 8080:8080 -n $Namespace"
Write-Host "  Eureka:      kubectl port-forward svc/discovery-server 8761:8761 -n $Namespace"
Write-Host "  RabbitMQ:    kubectl port-forward svc/rabbitmq 15672:15672 -n $Namespace"
Write-Host ""
