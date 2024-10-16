FROM node:22-slim

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

RUN npm install typescript -g 

RUN npx prisma generate

RUN tsc

ENV NODE_ENV=production

EXPOSE 3001

RUN mkdir -p /app/migrations_state

# Entrypoint script to run migrations and start the application - created with Chatgpt
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]

CMD ["npm", "start"]
