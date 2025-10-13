# Little Hunt Studios

A professional web application for Sora 2 video generation with GPT Image 1 integration, built with Next.js 14, TypeScript, and Tailwind CSS.

**Hunt the Perfect Frame with AI** 🎯

## Features

### 🎬 Prompt Builder with C-D-S-A Framework
- Structured input form with 8 sections: Scene, Subject, Action, Camera, Look, Audio, Negatives, Duration
- Real-time prompt preview with syntax highlighting
- Template selector with 10 pre-built recipes
- Zod-based validation

### 🎨 Style Preset Gallery
- 16 professional cinematic presets
- Visual cards with detailed specs (cinematography, lighting, color, audio)
- Preset comparison and detailed view
- One-click application to prompt builder

### 📹 Shot Library Browser
- 45 professional camera movements and shot types
- Advanced filtering by category, movement type, and purpose
- Shot detail modal with full specifications
- Copy prompt snippets and add to projects

### 🤖 Sora 2 Video Generation
- API integration using OpenAI SDK with model "sora-2"
- Real-time progress tracking
- Generate 1-5 variations per prompt
- Video preview and download

### 🖼️ GPT Image 1 Integration
- Image generation using model "gpt-image-1" (NOT DALL-E)
- Storyboard creator for pre-visualization
- Reference image generator
- Image gallery with download

### 📊 Project Management
- Create and manage video projects
- Track generated videos
- Export/import project data

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/ui
- **AI APIs**: 
  - OpenAI Sora 2 API (model: "sora-2")
  - GPT Image 1 API (model: "gpt-image-1")
- **Form Handling**: React Hook Form + Zod
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key with Sora 2 access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd little-hunt-studios
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
little-hunt-studios/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── sora/         # Sora 2 endpoints
│   │   │   └── image/        # GPT Image 1 endpoints
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/ui components
│   │   ├── PromptBuilder.tsx
│   │   ├── PresetGallery.tsx
│   │   ├── ShotBrowser.tsx
│   │   └── VideoGenerationInterface.tsx
│   ├── lib/                   # Utilities and API wrappers
│   │   ├── sora-api.ts       # Sora 2 API wrapper
│   │   ├── image-api.ts      # GPT Image 1 wrapper
│   │   └── utils.ts          # Utility functions
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── data/                  # JSON data files
│       ├── prompt_recipes.json
│       ├── style_presets.json
│       └── shot_library.json
├── public/                    # Static assets
├── .env.local.example        # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Data Files

The application uses three JSON data files in `src/data/`:

1. **prompt_recipes.json** - 10 prompt templates with variables
2. **style_presets.json** - 16 cinematic style presets
3. **shot_library.json** - 45 camera shot techniques

These files are loaded and validated at runtime using Zod schemas.

## API Routes

### Sora 2 Video Generation
- `POST /api/sora/generate` - Generate a video
- `GET /api/sora/status/[id]` - Check generation status

### GPT Image 1
- `POST /api/image/generate` - Generate a single image
- `POST /api/image/storyboard` - Generate multiple storyboard images

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Add environment variables**
   ```bash
   vercel env add OPENAI_API_KEY
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Alternative: Daytona.io

Follow Daytona.io's deployment guide for Next.js applications.

## Security

⚠️ **IMPORTANT SECURITY NOTES**

- ALL API calls are server-side only
- NEVER expose `OPENAI_API_KEY` in client code
- All API routes are protected and validated
- Use Next.js API routes exclusively for OpenAI calls

## Usage Guide

### Creating a Video

1. **Navigate to Prompt Builder**
   - Fill in required fields: Scene, Subject, Action
   - Optionally add Camera, Look, Audio specifications
   - Select duration (5s, 10s, 15s, or 20s)

2. **Apply a Style Preset (Optional)**
   - Go to Style Presets tab
   - Browse and select a preset
   - Click "Apply Preset" to populate fields

3. **Add Camera Shots (Optional)**
   - Visit Shot Library
   - Search and filter shots
   - Click "Add to Project" to include in timeline

4. **Generate Video**
   - Review prompt in preview panel
   - Click "Generate Video with Sora 2"
   - Monitor progress in the Generate tab

### Creating Storyboards

1. Use the GPT Image 1 integration
2. Generate reference images for key frames
3. Use images as visual guides for video prompts

## Configuration

### Customizing Presets

Edit `src/data/style_presets.json` to add or modify presets:

```json
{
  "id": "custom-preset",
  "name": "My Custom Preset",
  "category": "Custom",
  "description": "Your description",
  "cinematography": { ... },
  "lighting": { ... },
  "color": { ... },
  "audio": { ... }
}
```

### Adding Recipes

Edit `src/data/prompt_recipes.json`:

```json
{
  "id": "custom-recipe",
  "name": "My Recipe",
  "category": "Custom",
  "template": "Your template with {variables}",
  "variables": [...]
}
```

## Troubleshooting

### API Key Issues
- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Verify API key has Sora 2 access
- Check API key permissions

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors
```bash
# Regenerate types
npm run build
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for commercial or personal purposes.

## Credits

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [OpenAI](https://openai.com/)

## Support

For issues and questions:
- Open a GitHub issue
- Check the documentation
- Review API reference

---

**Note**: This application requires OpenAI API access with Sora 2 capabilities. The actual Sora 2 API integration depends on OpenAI's official API release and documentation.
