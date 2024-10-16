#!/bin/sh

# Check if migrations have already been applied
if [ ! -f /usr/src/app/migrations_state/migrations.lock ]; then
    echo "Running migrations..."
    npx prisma migrate deploy

    # Create a lock file to prevent future migrations
    touch /usr/src/app/migrations_state/migrations.lock
else
    echo "Migrations already applied."
fi

