# --- Stage 1: Build the React App ---
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the client source code (src, public, etc.)
COPY . .

# Run the build command to create the /dist folder
RUN npm run build

# --- Stage 2: Serve with Nginx ---
# Use the official Nginx image (very small)
FROM nginx:alpine

# Copy the built files from Stage 1 into Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

# Tell Docker the container will listen on port 80
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]