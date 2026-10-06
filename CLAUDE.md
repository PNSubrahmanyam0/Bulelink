# BlueLink (FLYNK Implementation)

BlueLink is a high-scale video and commerce ecosystem designed according to the FLYNK Infrastructure Blueprint.

## Tech Stack
- **Backend**: Python (FastAPI)
- **Frontend**: React
- **Database**: PostgreSQL
- **Cache/Realtime**: Redis
- **Object Storage**: MinIO (S3 compatible)
- **Task Queue**: RabbitMQ / Celery
- **Load Balancer**: Nginx

## Project Structure
- `/backend`: FastAPI application
- `/frontend`: React application
- `/infra`: Infrastructure configuration (Docker, Nginx)

## Architecture Principles (from Blueprint)
1. **Stateless API**: API servers must be stateless to allow horizontal scaling.
2. **Database Protection**: Use Redis caching and connection pooling to protect PostgreSQL.
3. **Async Media Pipeline**: Video transcoding must happen in background workers.
4. **CDN-First Media**: Media assets are delivered via CDN (simulated locally via Nginx/MinIO).
5. **Cost-Driven Scaling**: Provision for current needs, design for 1 million users.

## Development Commands
- Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
- Frontend: `cd frontend && npm install && npm start`
- Infra: `cd infra && docker-compose up -d`
