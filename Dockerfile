FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]
