FROM node:22-alpine
WORKDIR /app
RUN npm i -g pm2
COPY . .
RUN npm i -f
RUN npm run build
EXPOSE 3000
CMD [ "pm2-runtime", "npm", "--", "run", "start" ]
