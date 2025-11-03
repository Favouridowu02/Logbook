# 📔 Logbook — AI-Powered Professional Entry Generator

> Transform your daily work notes into top-1% quality engineering logbook entries in seconds using AI.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat&logo=react)
![License](https://img.shields.io/badge/license-MIT-green)

**Logbook** is a Next.js application that helps students, engineers, and interns create professional, well-structured logbook entries from simple bullet points. Using advanced AI models (Groq API) and image generation (Pollinations.ai), it transforms your daily activities into academic-quality documentation with technical illustrations.

---

## ✨ Features

### 🤖 **AI-Powered Text Generation**
- Transforms simple descriptions into professional engineering logbook entries
- Automatically detects entry type (Daily, Weekly, or Monthly)
- Uses Groq's **llama-3.1-8b-instant** model (14,400 free requests/day)
- Generates narrative-style entries with proper technical terminology
- Includes full date formatting (e.g., "Monday, 3rd November 2025")

### 🎨 **AI Image Generation**
- Creates technical illustrations based on your project description
- Powered by **Pollinations.ai** (unlimited, completely free)
- Generates blueprint-style diagrams and schematics
- Automatically included in PDF exports

### 📄 **Export & Sharing**
- **Copy to Clipboard** - One-click text copying
- **Download as PDF** - Professional formatting with:
  - Generated images at the top
  - Multi-page support with automatic page breaks
  - Page numbering (e.g., "Page 1 of 3")
  - Clean typography and proper margins
  - Dated filenames (`logbook_2025-11-03.pdf`)

### 💾 **Smart LocalStorage**
- Auto-saves all inputs as you type (400ms debounce)
- Persists generated outputs and images
- Resumes where you left off after browser refresh
- No data sent to external servers (except AI APIs)

### 🎯 **Beautiful UI/UX**
- Monochrome design with Tailwind CSS 4
- Smooth micro-animations via Framer Motion 12
- Dark mode support
- Responsive layout (mobile-friendly)
- Minimal, distraction-free interface

### ⚡ **Performance**
- Server-side AI calls (API keys never exposed to browser)
- Vercel Analytics & Speed Insights integrated
- Optimized font loading (Geist Sans & Mono)
- Fast builds with Next.js 16 App Router

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm/yarn
- A free Groq API key ([Get one here](https://console.groq.com) - no credit card required)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Favouridowu02/Logbook.git
   cd Logbook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   
   # Optional: Override default model (llama-3.1-8b-instant)
   # GROQ_MODEL=llama-3.1-70b-versatile
   # GROQ_MODEL=mixtral-8x7b-32768
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage Guide

### Step 1: Fill Out the Form
Enter your work details:
- **Description** (required): What you worked on
- **Start Date** (required): When you started
- **End Date** (required): When you finished
- **Days Worked** (required): Select weekdays (Monday-Sunday)
- **Tools/Technologies** (optional): Software, frameworks, equipment used
- **Skills Developed** (optional): What you learned
- **Challenges Faced** (optional): Problems encountered
- **Supervisor/Mentor** (optional): Who guided you

### Step 2: Generate Logbook Entry
- Click **"Generate Logbook"**
- Wait 2-5 seconds for AI to create your entry
- The entry type is automatically detected:
  - **Daily**: 0-4 days selected → 180-250 words
  - **Weekly**: 5-24 days selected → 250-350 words
  - **Monthly**: 25+ days selected → 300-400 words

### Step 3: Generate Image (Optional)
- Click **"Generate Image"** to create a technical illustration
- Wait ~5-10 seconds for the image to generate
- The image is automatically saved and will be included in PDF exports

### Step 4: Export Your Work
- **Edit** the generated text directly in the textarea
- **Copy** to clipboard for pasting elsewhere
- **Download PDF** with professional formatting and images

---

## 🏗️ Project Structure

```
Logbook/
├── app/
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # Groq AI text generation endpoint
│   │   └── generate-image/
│   │       └── route.ts          # Pollinations.ai image generation
│   ├── layout.tsx                # Root layout with metadata & analytics
│   ├── page.tsx                  # Main app UI and state management
│   └── globals.css               # Global styles and Tailwind directives
├── components/
│   ├── Form.tsx                  # Input form with validation & autosave
│   └── Output.tsx                # Display, edit, copy, and PDF export
├── lib/
│   ├── generateLogbook.ts        # Prompt builder and date utilities
│   └── storage.ts                # localStorage helpers and debounce
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Template for environment setup
├── next.config.ts                # Next.js config (image domains)
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS settings
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 16.0](https://nextjs.org/)** - React framework with App Router
- **[React 19.2](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animations

### **Backend/APIs**
- **[Groq API](https://console.groq.com/)** - Fast AI inference (FREE tier)
  - Models: `llama-3.1-8b-instant`, `llama-3.1-70b-versatile`, `mixtral-8x7b-32768`
- **[Pollinations.ai](https://pollinations.ai/)** - Image generation (FREE, unlimited)
  - Model: FLUX (state-of-the-art text-to-image)

### **Utilities**
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[html2canvas](https://html2canvas.hertzen.com/)** - HTML to image conversion
- **[@vercel/analytics](https://vercel.com/analytics)** - Analytics tracking
- **[@vercel/speed-insights](https://vercel.com/docs/speed-insights)** - Performance monitoring

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Favouridowu02/Logbook)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy Logbook app"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variable: `GROQ_API_KEY`
   - Click **Deploy**

3. **Your app is live!** 🎉

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | - | Your Groq API key from [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | ❌ No | `llama-3.1-8b-instant` | AI model to use (see options below) |

### Available Models

- `llama-3.1-8b-instant` (default) - Fast, good quality
- `llama-3.1-70b-versatile` - Slower, higher quality
- `mixtral-8x7b-32768` - Long context window

### Image Generation

No configuration needed! Pollinations.ai is completely free and requires no API key.

---

## 📝 Example Inputs

### Weekly Entry Example

**Description:**
```
Worked on electromagnetic propulsion systems for rocket applications. 
Studied different propellant combinations and their efficiency ratings. 
Conducted simulations comparing chemical and electromagnetic propulsion methods.
```

**Start Date:** `2025-09-15`  
**End Date:** `2025-09-21`  
**Days Worked:** Monday, Tuesday, Wednesday, Thursday, Friday  
**Tools:** `MATLAB, ANSYS, Python, CAD Software`  
**Skills:** `Propulsion system analysis, electromagnetic theory, simulation modelling`  
**Challenges:** `Understanding complex interactions between electromagnetic fields and propellant particles`  
**Supervisor:** `Dr. James Richardson`

**Generated Output:**
```
Week 10 – Electromagnetic Rockets and Propellant Selection

Monday, 15th September 2025: Initiated comprehensive analysis of electromagnetic 
propulsion systems, focusing on the fundamental principles governing ion acceleration 
and magnetic field interactions. Conducted preliminary simulations using MATLAB to 
model thrust-to-power ratios across varying propellant compositions...

[Full professional entry with technical details, dates, and narrative structure]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Groq](https://groq.com/)** for providing fast, free AI inference
- **[Pollinations.ai](https://pollinations.ai/)** for unlimited free image generation
- **[Vercel](https://vercel.com/)** for seamless deployment and analytics
- The Next.js and React teams for amazing frameworks

---

## 📬 Contact

**Favour Idowu**
- GitHub: [@Favouridowu02](https://github.com/Favouridowu02)
- Repository: [Logbook](https://github.com/Favouridowu02/Logbook)

---

## 🎯 Roadmap

- [ ] Add more AI model options (OpenAI, Anthropic)
- [ ] Custom prompt templates
- [ ] Multi-language support
- [ ] Export to Word/Markdown formats
- [ ] Batch entry generation
- [ ] User accounts and cloud sync
- [ ] Mobile app (React Native)

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [Favour Idowu](https://github.com/Favouridowu02)

</div>

