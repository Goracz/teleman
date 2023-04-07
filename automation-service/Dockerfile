FROM curlimages/curl:7.81.0 AS download

ARG OTEL_AGENT_VERSION="1.24.0"

RUN curl --silent --fail -L "https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v${OTEL_AGENT_VERSION}/opentelemetry-javaagent.jar" \
    -o "$HOME/opentelemetry-javaagent.jar"

# Choose the GraalVM base image
FROM ghcr.io/graalvm/graalvm-ce:latest as builder

# Set the working directory
WORKDIR /app

# Install the required GraalVM components
RUN gu install native-image

# Copy the Gradle Wrapper from your project
COPY gradlew .
COPY gradle ./gradle

# Give execute permissions to the Gradle Wrapper
RUN chmod +x ./gradlew

# Copy your source code
COPY src ./src
COPY build.gradle settings.gradle ./

# Build the project with Gradle
RUN ./gradlew clean build --no-daemon

# Start the third stage
FROM ghcr.io/graalvm/graalvm-ce:latest

# Set the working directory
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder /app/build/libs/*.jar /app/app.jar
COPY --from=download /home/curl_user/opentelemetry-javaagent.jar /app/opentelemetry-javaagent.jar

# Expose the default port
EXPOSE 8083

ENV JAVA_OPTS="-javaagent:/app/opentelemetry-javaagent.jar -Xmx256m -XX:NewRatio=2 -XX:+UseG1GC -XX:MaxGCPauseMillis=50 -XX:+HeapDumpOnOutOfMemoryError"

# Set the entrypoint
ENTRYPOINT exec java $JAVA_OPTS -jar /app/app.jar
