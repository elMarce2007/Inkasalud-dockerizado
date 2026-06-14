@echo off
chcp 65001 >nul
title Inkasalud - Iniciando Microservicios

echo ================================================
echo       INKASALUD - Sistema de Microservicios
echo ================================================
echo.

:: Verificar Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java no está instalado o no está en el PATH.
    echo Descarga JDK 17+ desde: https://adoptium.net
    pause
    exit /b 1
)

:: Verificar Maven
mvn -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Maven no está instalado o no está en el PATH.
    echo Descarga Maven desde: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo [OK] Java y Maven detectados.
echo.

:: Directorio base (donde está este .bat)
set BASE=%~dp0

echo [1/8] Iniciando Discovery Server (puerto 8761)...
start "Discovery Server" cmd /k "cd /d "%BASE%discovery-server" && mvn spring-boot:run"

echo Esperando 30 segundos para que Eureka levante...
timeout /t 30 /nobreak >nul

echo [2/8] Iniciando Config Server (puerto 8888)...
start "Config Server" cmd /k "cd /d "%BASE%config-server" && mvn spring-boot:run"

echo Esperando 20 segundos...
timeout /t 20 /nobreak >nul

echo [3/8] Iniciando API Gateway (puerto 8080)...
start "API Gateway" cmd /k "cd /d "%BASE%api-gateway" && mvn spring-boot:run"

echo [4/8] Iniciando Auth Service (puerto 8081)...
start "Auth Service" cmd /k "cd /d "%BASE%auth-service" && mvn spring-boot:run"

echo [5/8] Iniciando Cliente Service (puerto 8082)...
start "Cliente Service" cmd /k "cd /d "%BASE%cliente-service" && mvn spring-boot:run"

echo [6/8] Iniciando Catalogo Service (puerto 8083)...
start "Catalogo Service" cmd /k "cd /d "%BASE%catalogo-service" && mvn spring-boot:run"

echo [7/8] Iniciando Ventas Service (puerto 8084)...
start "Ventas Service" cmd /k "cd /d "%BASE%ventas-service" && mvn spring-boot:run"

echo [8/8] Iniciando Personal Service (puerto 8085)...
start "Personal Service" cmd /k "cd /d "%BASE%personal-service" && mvn spring-boot:run"

echo.
echo ================================================
echo   Todos los servicios iniciados correctamente
echo ================================================
echo.
echo   Eureka Dashboard : http://localhost:8761
echo   API Gateway      : http://localhost:8080
echo   RabbitMQ Panel   : http://localhost:15672
echo.
echo   Espera ~60 segundos para que todos los
echo   servicios terminen de iniciar.
echo ================================================
echo.
pause
