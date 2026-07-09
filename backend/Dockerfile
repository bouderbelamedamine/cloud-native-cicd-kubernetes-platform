# ===== Stage 1 : Build =====
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /build

# Copier d'abord les fichiers de dépendances (cache Docker)
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Télécharger les dépendances (couche mise en cache si pom.xml ne change pas)
RUN ./mvnw dependency:go-offline -B

# Copier le code source
COPY src ./src

# Construire l'application (sans les tests, ils tournent dans le CI)
RUN ./mvnw package -DskipTests -B

# ===== Stage 2 : Runtime =====
FROM eclipse-temurin:17-jre-jammy

# Installer curl pour le health check, puis nettoyer
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Créer un utilisateur non-root (sécurité)
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copier uniquement le JAR construit depuis le stage builder
COPY --from=builder /build/target/*.jar app.jar

# Donner la propriété du dossier à l'utilisateur non-root
RUN chown -R appuser:appuser /app

# Basculer vers l'utilisateur non-root
USER appuser

# Exposer le port de l'application
EXPOSE 8080

# Health check (utile pour Docker et Kubernetes)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Lancer avec JVM optimisée pour conteneur
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-jar", "app.jar"]