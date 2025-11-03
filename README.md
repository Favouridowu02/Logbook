## Logbook — AI-generated professional entries

Logbook helps you craft top‑1% quality engineering logbook entries from your daily/weekly activities. Enter your details, and the app generates a polished, structured entry using Groq's fast AI models.

### Features

- Monochrome, minimal UI (Tailwind CSS)
- Smooth micro‑animations (Framer Motion)
- LocalStorage autosave of inputs and outputs
- Copy to clipboard and Download as PDF
- **AI Image Generation** - Create visual illustrations of your logbook entries
- Server‑side integration with Groq AI API (FREE, fast)
- Free image generation via Pollinations.ai (no API key needed)

### Quick start

1) Get a free Groq API key from https://console.groq.com (no credit card required)

2) Create an `.env.local` file in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
# optional override (defaults to llama-3.1-8b-instant)
# GROQ_MODEL=llama-3.1-70b-versatile
```

2) Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

3) Open http://localhost:3000 — no signup required. Fill out the form and click "Generate Logbook".

### Notes

- Your inputs and generated output are cached locally in the browser for convenience.
- The AI call happens server‑side; your API key is never exposed to the browser.
- You can edit the generated text and download it as PDF (with optional generated image).
- **Image Generation**: After generating your logbook, click "Generate Image" to create a technical illustration based on your project description. The image is automatically included in the PDF download.
- Groq offers 14,400 free requests per day on the free tier (more than enough for personal use).
- Image generation is completely free via Pollinations.ai - no API key or signup required.

