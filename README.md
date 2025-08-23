# DreamWeave

A modern dream journaling application built with React, TypeScript, and Tailwind CSS. Features a glass morphism UI design and  dream organization capabilities with analysis.

## Screenshots

### Main Menu
![DreamWeave Menu](images/dreamweavemenu.png)
*The main menu interface with glass morphism design*

### Dream Editor
![DreamWeave Editor](images/dreamweaveeditor.png)
*Create and edit dreams with rich text formatting and citation support*

### Dream Graph
![DreamWeave Graph](images/dreamweavegraph.png)
*Interactive graph visualization showing connections between dreams*

### Citation System
![DreamWeave Citations](images/dreamweavecitations.png)
*Citation management and dream linking features*

## Download

1. Go to the [Release](https://github.com/johnmartinello/Dreamweave/tree/main/release) page
2. Download `DreamWeave-Setup-x.x.x.exe` (latest version)
3. Run the installer and follow the setup wizard
4. Launch DreamWeave from your Start Menu or desktop shortcut

### Alternative: Build from Source
If you prefer to build the application yourself, see the [Installation](#installation) section below.

## Features

### Core Functionality
- **Dream Journaling**: Create, edit, and organize your dreams with rich text descriptions
- **Advanced Tag System**: Hierarchical categorization with AI-powered theme detection (if wanted)
- **Date Filtering**: Advanced date range filtering with custom calendar interface
- **Search**: Full-text search across dream titles, descriptions, and tags with real-time results
- **Auto-save**: Automatic saving of dream entries as you type
- **Trash Management**: Safely delete and restore dreams with comprehensive trash system

### Hierarchical Tag System ✨
- **Organized Categories**: Dreams are categorized into logical hierarchies (Emotions, Characters, Actions, Places, etc.)
- **Smart Tag Suggestions**: Context-aware tag recommendations based on dream content
- **Pattern Recognition**: Discover connections between different dream themes over time
- **Custom Categories**: Create your own tag categories and hierarchies
- **Tag Relationships**: See how different tags relate to each other across your dreams

### Citation System ✨
- **Dream Linking**: Connect dreams together by citing other dreams within each entry
- **Inline Mentions**: Use "@" mentions in dream descriptions to automatically create citations
- **Citation Search**: Search and browse other dreams to add as citations
- **Bidirectional Links**: View both dreams you cite and dreams that cite the current dream
- **Citation Preview**: Preview cited dreams without leaving the current editor
- **Automatic Sync**: Citations are automatically synchronized with inline mentions

### Dream Graph Feature ✨
- **Interactive Graph View**: Visualize dream connections using a force-directed graph
- **Graph Filtering**: Filter by date range, tag categories, and connection status
- **Interactive Navigation**: Click on graph nodes to navigate to dream details
- **Multiple Layouts**: Choose between force-directed, hierarchical, and circular layouts
- **Visual Customization**: Node colors based on tag categories, sizes based on citation count

### AI Integration
- **Smart Tag Suggestions**: AI-powered dream categorization using Gemini or LM Studio
- **AI Title Suggestions**: Generate evocative titles for your dreams based on their content
- **Theme Analysis**: Automatic detection of emotional tones, recurring elements, and dream types
- **Pattern Recognition**: Identify connections and patterns across your dream journal
- **Configurable AI Providers**: Support for multiple AI backends with easy switching
- **Local Processing**: Option to use local AI models for complete privacy
- **Multi-language Support**: AI analysis in English and Portuguese (Brazilian)

### Security & Privacy
- **Password Protection**: Optional password protection with auto-lock features
- **Local Storage**: All data stored locally on your device
- **Privacy-First**: No data sent to external servers unless explicitly configured
- **Secure AI**: Option to use local AI models for complete privacy

### User Experience
- **Glass Morphism UI**: Beautiful, modern interface with glass-like effects
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Dark Theme**: Optimized for comfortable night-time use
- **Keyboard Shortcuts**: Efficient navigation and editing with keyboard shortcuts
- **Internationalization**: Support for multiple languages (English, Portuguese)

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Graph Visualization**: react-force-graph-2d
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: Custom service layer supporting LM Studio and Gemini
- **Desktop App**: Electron for cross-platform desktop application

## Getting Started

### Prerequisites
- Node.js 18+ 

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dreamweave
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

