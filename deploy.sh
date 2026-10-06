#!/bin/bash

# BlueLink Deployment Script
echo "🚀 Starting BlueLink Deployment..."

# 1. Navigate to infra directory
cd infra

# 2. Build and start containers
echo "📦 Building and starting Docker containers..."
docker-compose up -d --build

# 3. Wait for Database to be healthy
echo "⏳ Waiting for Database to be healthy..."
until docker exec bluelink-db pg_isready -U bluelink_user -d bluelink_db; do
  sleep 2
done

# 4. Apply Database Schema
echo "🗄️ Applying Database Schema..."
docker exec -i bluelink-db psql -U bluelink_user -d bluelink_db < schema.sql

echo "✅ Deployment Complete!"
echo "🌐 Access the application at http://localhost"
echo "🛠️ MinIO Console at http://localhost:9001"
echo "📊 RabbitMQ Management at http://localhost:15672"
