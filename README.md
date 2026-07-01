# WhatsApp CRM

A simple WhatsApp CRM application built with Express, SQLite, and React.
It collects customer information from WhatsApp conversations and displays the leads in a web dashboard.

## Prerequisites

Before running the project, install:

- Node.js (v20 or later)
- npm
- ngrok
- Meta Developer Account
- WhatsApp Business Test Number

## Project Structure

```
whatsapp-crm/
├── packages/
│   ├── backend/
│   └── frontend/
├── package.json
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd whatsapp-crm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `packages/backend`.

Example:

```
PORT=5000
VERIFY_TOKEN=your_verify_token
WHATSAPP_TOKEN=your_access_token
PHONE_NUMBER_ID=your_phone_number_id
APP_SECRET=your_app_secret
```

### 4. Start the project

Run both frontend and backend:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Architecture

```
WhatsApp User
      │
      ▼
Meta WhatsApp Cloud API
      │
      ▼
Express Backend
      │
      ▼
SQLite Database
      │
      ▼
REST API
      │
      ▼
React Dashboard
```

## Common Commands

Install dependencies:

```bash
npm install
```

Run both applications:

```bash
npm run dev
```

Run backend only:

```bash
npm run dev:backend
```

Run frontend only:

```bash
npm run dev:frontend
```

Build the frontend:

```bash
npm run build -w @crm/frontend
```

## Troubleshooting

### Frontend cannot connect to backend

- Make sure the backend is running on port 5000.
- Check the API URL in the frontend.

### Webhook verification fails

- Verify the Meta webhook URL and Verify Token.
- Make sure ngrok is running.

### No leads appear

- Send a message to your WhatsApp test number.
- Check that the webhook receives the message.

### npm install fails

Delete `node_modules` and `package-lock.json`, then run:

```bash
npm install
```
