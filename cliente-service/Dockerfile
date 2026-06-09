# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy parent pom first for dependency caching
COPY pom.xml /app/pom.xml
COPY cliente-service/pom.xml /app/cliente-service/pom.xml

# Download dependencies (cached if pom.xml unchanged)
RUN mvn -f /app/cliente-service/pom.xml dependency:go-offline -DskipTests

# Copy source and build
COPY cliente-service/src /app/cliente-service/src
RUN mvn -f /app/cliente-service/pom.xml clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy jar from builder
COPY --from=builder /app/cliente-service/target/*.jar app.jar

# Change ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
