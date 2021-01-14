FROM node:12

COPY . app

# Create app directory
WORKDIR /app

RUN npm ci --only=production

CMD [ "node", "/app/app.js" ]