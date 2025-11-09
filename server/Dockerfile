# --- Stage 1: Use an official Node.js image ---
# Using 'alpine' makes the image much smaller
FROM node:18-alpine

# --- Set up the working directory ---
# This is where your app will live inside the container
WORKDIR /usr/src/app

# --- Copy dependency files ---
# Copy package.json and package-lock.json first.
# This lets Docker cache the 'npm install' step,
# so it doesn't re-install everything every time you change code.
COPY package*.json ./

# --- Install dependencies ---
RUN npm install

# --- Copy the rest of your app's code ---
# Now copy your index.js, routes, etc.
COPY . .

# --- Expose the port ---
# Tell Docker the container will listen on port 8080
EXPOSE 8080

# --- Set the startup command ---
# This is what runs when the container starts
CMD [ "node", "index.js" ]