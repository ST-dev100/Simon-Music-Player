# Use a specific version of Node.js
FROM node:16-alpine

# Set the working directory
WORKDIR /server

# Copy the package.json and package-lock.json files first to leverage caching
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the application will run on
EXPOSE 4200

# Optionally, create a non-root user and switch to it (this is good for security)
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser

# Start the application
CMD ["npm", "start"]
