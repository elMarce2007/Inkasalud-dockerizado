# ===========================================
# INKASALUD - Kubernetes Delete Script
# ===========================================

$Namespace = "inkasalud"

Write-Host "================================================"
Write-Host "  INKASALUD - Deleting all resources"
Write-Host "================================================"
Write-Host ""

$confirm = Read-Host "Are you sure you want to delete all InkaSalud resources? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled."
    exit 0
}

Write-Host "Deleting namespace $Namespace and all resources..."
kubectl delete namespace $Namespace --ignore-not-found

Write-Host ""
Write-Host "All resources deleted."
