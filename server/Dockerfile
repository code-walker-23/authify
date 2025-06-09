# Stage 1: Build with Maven
FROM maven:3.9.9-eclipse-temurin-22 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run with JDK 22
FROM openjdk:22-jdk-slim

WORKDIR /app

# Copy the fat jar from build stage
COPY --from=build /app/target/authify-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
