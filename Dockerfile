FROM node:22-slim

WORK /app

COPY package*.json .

RUN npm install 

COPY . .

RUN npm install typescript -g 

RUN npx prisma generate

RUN tsc

ENV NODE_ENV=production

EXPOSE 3001

RUN mkdir -p /migrations_state

RUN if [ ! -f /app/migrations_state/migrations.lock ]; then \
      npx prisma migrate deploy && touch /usr/src/app/migrations_state/migrations.lock; \
    fi

CMD ['npm', 'start']
