# Merchant Analysis API

An API that automates merchant verification and validity checks, while detecting potentially fraudulent merchants without manual intervention.

- Swagger is used for API documentation, so feel free to experiment with the available endpoints using your own data.
- The verification pipeline runs asynchronously using Inngest.

---

## Architecture
![Architecture Diagram](docs/database-design.svg)
*[View interactive diagram →](https://excalidraw.com/#json=-kqgCNnFE_90Xr0An4N8o,yveAKVHD8zym4FYISnax7Q)*

---

## Tech Stack Used

1. **TypeScript + Express.js** — REST API development.
2. **Zod** — Environment variable and input validation.
3. **Drizzle ORM + PostgreSQL + pgvector** — Database access and vector embeddings.
4. **Swagger** — OpenAPI-based API documentation.
5. **Inngest** — Event-based asynchronous orchestration of the merchant verification pipeline.
6. **Firecrawl** - Website analysis of merchant.

---

## Development Setup

Start the API:

```bash
npm run dev
```

Start the Inngest development server in a separate terminal:

```bash
npm run dev:inngest
```

Both the API server and the Inngest development server need to be running to test the application in development mode.

---

## Notes

- A new Inngest event is triggered every time the `createVerification` endpoint is called.
- The verification record is initially created with a `PENDING` status and is processed asynchronously by the Inngest workflow.
- You can monitor the verification workflows through the Inngest UI at: `http://localhost:8288`
- Swagger is used for API documentation and can be used to test the available endpoints with your own data.