## Voice Note App (Client + Server)

A full-stack voice notes application that lets you record audio, auto-transcribe it on the server using Google Gemini, edit transcripts, and generate concise AI summaries.

### Features

- Record audio in the browser (WebM) and upload to the server
- Automatic transcription via Gemini 1.5 Flash
- Edit transcript and regenerate summary
- CRUD for notes (create, list, update, delete)
- Clean React UI with toast notifications

## Tech Stack

- Client: React 18, Vite, Axios, react-hot-toast
- Server: Node.js, Express, Mongoose, Multer, Morgan, CORS, dotenv
- AI: Google Gemini (`@google/generative-ai`)
- DB: MongoDB

## Monorepo Layout

```
Voice Note App/
  client/                # React frontend (Vite)
  server/                # Express + MongoDB backend
```

## Prerequisites

- Node.js 18+
- MongoDB (local or hosted, e.g., MongoDB Atlas)
- A Google Gemini API key

## Environment Variables

### Server (`server/.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/voice-notes
CLIENT_ORIGIN=http://localhost:5173

# AI Provider: Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: use fake outputs for fast local dev
# DEV_FAKE_AI=true
```

Notes:

- `OPENAI_API_KEY` is not used anymore. The server now uses Gemini.
- When `DEV_FAKE_AI=true`, the server returns placeholder transcription and summary.

### Client (`client/.env`)

```
VITE_API_URL=http://localhost:5000
```

## Install & Run

### 1 Server

```
cd server
npm install
npm run dev   # or: npm start
```

The server runs by default on `http://localhost:5000` and serves uploads at `/uploads`.

### 2 Client

```
cd client
npm install
npm run dev
```

The client runs by default on `http://localhost:5173`.

## Build

```
cd client && npm run build
```

Outputs to `client/dist`.

## Backend Overview

- Entry: `server/index.js`
- DB: `server/src/config/db.js`
- Routes: `server/src/routes/notes.js`
- Controllers: `server/src/controllers/noteController.js`
- Uploads: `server/src/middleware/upload.js` (Multer, stores `.webm` files under `server/uploads`)
- Error Handling: `server/src/middleware/errorHandler.js`
- AI Service (Gemini): `server/src/services/gemini.js`

### API Routes (Base: `/api/notes`)

- `GET /` → List notes (sorted by `updatedAt` desc)
- `POST /` → Create a note (multipart form)
  - form fields: `audio` (file, webm), optional `title`
- `PATCH /:id` → Update note `{ title?, transcript? }`
- `DELETE /:id` → Delete note
- `POST /:id/summarize` → Generate a summary from the note transcript

### Note Model

```
{
  _id: string,
  title: string,
  audioUrl: string,      // /uploads/<filename>
  transcript: string,
  hasSummary: boolean,
  summary: string,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Overview

- Entry: `client/src/main.jsx`, `client/src/App.jsx`
- API client: `client/src/api.js` (`VITE_API_URL` + `/api`)
- Notes service: `client/src/services/notes.js`
- State: `client/src/contexts/NotesContext.jsx` wraps `useNotes` hook
- Hooks: `client/src/hooks/useNotes.js`, `client/src/hooks/useRecorder.js`
- Components: `Recorder.jsx`, `NoteList.jsx`, `NoteItem.jsx`, `NoteEditor.jsx`, `NoteSummary.jsx`, `NoteToolbar.jsx`

### Live State Sharing

To avoid stale state between components, a shared context (`NotesProvider`) is used. All components access notes and actions via `useNotesContext`, ensuring immediate UI updates after create/update/delete/summarize.

## Common Workflows

### Create a note

1. Press “Start Recording” in the UI
2. Press “Stop & Save” to upload
3. Server transcribes via Gemini and returns the created note

### Edit transcript

1. Click “Edit” on a note
2. Modify title/transcript and Save

### Summarize

1. Click “Generate Summary” to request a summary via Gemini

### Delete

1. Click “Delete” and confirm

## Troubleshooting

- Client can’t reach server: ensure `VITE_API_URL` matches your server origin and that CORS `CLIENT_ORIGIN` allows the client.
- Audio failing to upload: confirm the browser has mic permissions and the MIME type is supported (`audio/webm`).
- Gemini errors: ensure `GEMINI_API_KEY` is set and network allows outbound access.
- Mongo connection issues: validate `MONGO_URI` and that MongoDB is running/accessible.

## Scripts Summary

### Client

```
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview built assets
```

### Server

```
npm run dev       # Start server with nodemon
npm start         # Start server (node)
```

## Security & Privacy

- Audio files are stored on disk at `server/uploads/` and exposed at `/uploads`.
- In production, consider:
  - Private object storage (S3/GCS) instead of local disk
  - Restricting static file serving
  - HTTPS for client and server

## License

MIT
