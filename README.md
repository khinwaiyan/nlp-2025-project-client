# AI Drug Research Assistant - Client

A modern React-based web application that provides an intelligent chat interface for drug research assistance. This client application connects to an NLP-powered backend to help researchers discover, summarize, and access academic papers related to drug research.

## 🚀 Features

- **Interactive Chat Interface**: Real-time chat with AI assistant for drug research queries
- **Paper Recommendations**: Get AI-powered recommendations for relevant research papers
- **Paper Summarization**: Automatically summarize research papers
- **PDF Access**: Direct links to download research paper PDFs
- **Session Management**: Persistent chat sessions with message history
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and Radix UI
- **Real-time Communication**: WebSocket integration for live chat experience

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Package Manager**: Yarn 4

## 📋 Prerequisites

- Node.js (v18 or higher)
- Yarn 4.x
- Backend API server running (see backend documentation)

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nlp-2025-project-client
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
VITE_DOMAIN=http://localhost:8000
```

### Development

Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
yarn build
```



