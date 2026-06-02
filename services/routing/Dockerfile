FROM opentripplanner/opentripplanner:latest

WORKDIR /opt/otp

# Copy build and router configs
COPY build-config.json /opt/otp/build-config.json
COPY router-config.json /opt/otp/router-config.json

# Create graphs directory
RUN mkdir -p /opt/otp/graphs/default

# Build graph on startup
EXPOSE 8080

CMD ["java", "-Xmx2g", "-jar", "otp-shaded.jar", "--build", "/opt/otp/graphs/default", "--router", "default"]
