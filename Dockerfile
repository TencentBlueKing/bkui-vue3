# Use the appropriate node image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy project files to the working directory
COPY . ./

# Install project dependencies
RUN yarn install

# Expose the port (modify according to the port used by your frontend project)
EXPOSE 8086

# Start the project
CMD ["yarn", "dev"]
