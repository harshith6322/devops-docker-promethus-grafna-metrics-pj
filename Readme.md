Here's a complete `README.md` file for your **Dockerized Node.js App with Prometheus & Grafana Monitoring** setup. It includes a project description, setup steps, image placeholders, and details about the metrics you're collecting.

---

````markdown
# 📊 Node.js Monitoring with Prometheus & Grafana using Docker

This project demonstrates **monitoring a Node.js application** using **Prometheus and Grafana**, all containerized using Docker. It showcases how to expose custom metrics (like request counts and durations) and visualize them on Grafana dashboards.

---

## 🧱 Architecture

- **Node.js App** (on port `3003`) exposes Prometheus metrics.
- **Prometheus** (on port `9090`) scrapes metrics from the Node.js app.
- **Grafana** (on port `3001`) visualizes the metrics.
- All services are connected via a custom **Docker network** (`monitoring`).

![Architecture Diagram](./images/architecture.png)

---

## 🐳 Docker Compose Setup

Here's a preview of the `docker-compose.yml` used:

```yaml
version: "3.8"

services:
  node-app:
    build: ./
    ports:
      - "3003:3003"
    networks:
      - monitoring

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./:/etc/prometheus
    ports:
      - "9090:9090"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    networks:
      - monitoring
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

networks:
  monitoring:
```
````

---

## 📈 Prometheus Configuration

Prometheus is configured to scrape the Node.js app every second:

```yaml
global:
  scrape_interval: 1s

scrape_configs:
  - job_name: "nodejs-app"
    static_configs:
      - targets: ["node-app:3003"]
```

---

## 📦 Custom Metrics in Node.js

The app uses the `prom-client` package to expose these metrics:

- **`http_requests_total`** (Counter): Total number of HTTP requests by method, route, and status code.
- **`active_requests_gauge`** (Gauge): Real-time number of active requests.
- **`http_request_duration_ms`** (Histogram): Distribution of HTTP request durations in milliseconds.

```js
const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const activeRequestsGauge = new client.Gauge({
  name: "active_requests_gauge",
  help: "Number of active requests",
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000],
});
```

---

## 🖥️ Grafana Dashboard

Login to Grafana:

- **URL**: [http://localhost:3001](http://localhost:3001)
- **Username**: `admin`
- **Password**: `admin`

> After login, add Prometheus as a data source and import a dashboard or create custom visualizations using the exposed metrics.

![Grafana Dashboard](./images/grafana-dashboard.png)

---

## 🛠️ How to Run

```bash
# Build and start all services
docker-compose up --build
```

- Node.js app: [http://localhost:3003](http://localhost:3003)
- Prometheus UI: [http://localhost:9090](http://localhost:9090)
- Grafana UI: [http://localhost:3001](http://localhost:3001)

---

---

## 🌐 Docker Networking

All containers communicate over a shared custom bridge network called `monitoring`. This allows services to use their names (`node-app`, `prometheus`, `grafana`) for communication internally.

---

## 📌 Highlights

- Custom Prometheus metrics in Node.js.
- Docker Compose networking for multi-container setup.
- Grafana integration for real-time visualization.
- Easy to extend for microservices observability.

---
