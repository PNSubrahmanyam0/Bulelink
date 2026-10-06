# 🚀 BlueLink - Final Deployment Guide

BlueLink is the full-stack implementation of the FLYNK video and commerce ecosystem, engineered for massive scale.

## 🛠️ System Architecture
- **Frontend**: React (Single Page Application)
- **Load Balancer**: Nginx (handles API proxying and WebSocket upgrades)
- **API Layer**: FastAPI (Python) - Stateless, horizontally scaled
- **Background Processing**: Celery + RabbitMQ (Async video transcoding)
- **Data Store**: PostgreSQL (Relational data)
- **Cache/Realtime**: Redis (Session, Feed Cache, Chat)
- **Object Storage**: MinIO (S3-compatible video storage)

## 🚀 One-Click Deployment

The fastest way to deploy the entire stack is using the provided deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

### What the script does:
1. Builds all Docker images (Backend, Frontend, Workers).
2. Starts the infrastructure (Postgres, Redis, MinIO, RabbitMQ, Nginx).
3. Waits for the database to be ready.
4. Automatically applies the SQL schema.

## 🌐 Access Points
- **Main Application**: [http://localhost](http://localhost)
- **MinIO Console**: [http://localhost:9001](http://localhost:9001) (User/Pass: `minioadmin`/`minioadmin`)
- **RabbitMQ Admin**: [http://localhost:15672](http://localhost:15672) (User/Pass: `guest`/`guest`)

## 📈 Scaling Blueprint Implementation
This deployment implements the **1K-User Stage** of the blueprint:
- [x] **Redundancy**: Two API instances (`backend1`, `backend2`) behind Nginx.
- [x] **Async Workload**: Video transcoding is offloaded to separate workers.
- [x] **Statelessness**: All application state is in Postgres/Redis.
- [x] **CDN Ready**: Media paths are routed via the Load Balancer to Object Storage.

## 📂 Directory Structure
- `/backend`: API logic, database models, and background workers.
- `/frontend`: React UI and API integration.
- `/infra`: Docker orchestration and Nginx configuration.
- `deploy.sh`: Automation script for environment setup.
- `schema.sql`: Final database definition.
