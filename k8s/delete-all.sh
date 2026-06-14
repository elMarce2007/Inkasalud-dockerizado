#!/bin/bash
# ===========================================
# INKASALUD - Kubernetes Delete Script
# ===========================================

set -e

NAMESPACE="inkasalud"

echo "================================================"
echo "  INKASALUD - Deleting all resources"
echo "================================================"
echo ""

read -p "Are you sure you want to delete all InkaSalud resources? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Cancelled."
    exit 0
fi

echo "Deleting namespace $NAMESPACE and all resources..."
kubectl delete namespace $NAMESPACE --ignore-not-found

echo ""
echo "All resources deleted."
