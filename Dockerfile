# Stage 1: Build the React app
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Ensure package.json and package-lock.json are copied correctly
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build || { echo "Build failed"; exit 1; }

# Stage 2: Serve the build using Nginx
FROM nginx:alpine

# Copy build output to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html


# Copy custom Nginx config if needed

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
