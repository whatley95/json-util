# JSON Utility Tool

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/whatley95/json-util)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/## 📬 Contact & Links

- **Live Demo**: [JSON Utilities](https://json-util.whatley.xyz) (Cloudflare Pages)
- **GitHub**: [whatley95/json-util](https://github.com/whatley95/json-util)
- **Personal Website**: [whatley.xyz](https://whatley.xyz/)
- **Issues**: [Report bugs or request features](https://github.com/whatley95/json-util/issues)

---

Made with ❤️ by [Whatley](https://whatley.xyz/)4-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6.svg)](https://www.typescriptlang.org/)

A modern, comprehensive web application for working with JSON data. This project provides multiple tools to manipulate, validate, compare, and explore JSON data through an intuitive user interface.

![JSON Utility Screenshot](./screenshot.png)

## 🚀 Features

### Core Tools
- **JSON Diff**: Compare two JSON objects and visualize the differences with side-by-side or line-by-line views
- **JSON Escape/Unescape**: Easily escape or unescape JSON strings
- **JSON Beautify/Minify**: Format JSON for readability or minify it for reduced file size
- **JSON to Object Converter**: Convert between JSON strings and JavaScript objects
- **JSON Validator**: Check JSON syntax with detailed error messages and structure statistics
- **JSON Path Finder**: Query complex JSON structures using JSONPath expressions

### Enhanced User Experience
- **History Management**: Auto-save and restore previous operations across sessions
- **Keyboard Shortcuts**: Quick actions with keyboard combinations
- **Toast Notifications**: User-friendly success/error messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Fullscreen Mode**: Distraction-free editing experience
- **Auto-formatting**: Real-time JSON validation and formatting
- **Copy to Clipboard**: One-click copying of results

## 🛠️ Technologies

- Vue 3.3.4 with Composition API
- TypeScript (strict mode)
- Vite 4.5.1 (build tool)
- Vue Router 4.2.5 (routing)
- Pinia 2.1.7 (state management)
- diff2html for JSON comparison visualization
- jsonlint-mod for validation
- jsonpath-plus for JSONPath queries

## 📁 Project Structure

```
json-util/
├── public/                 # Static assets
│   ├── _headers           # Cloudflare Pages headers
│   ├── _redirects         # SPA routing redirects
│   └── favicon.svg
├── src/
│   ├── components/        # Reusable Vue components
│   │   ├── base/         # Base component library
│   │   └── HistoryPanel.vue
│   ├── composables/      # Vue 3 composables
│   │   ├── useJsonTool.ts # Common tool functionality
│   │   └── useToast.ts   # Toast notifications
│   ├── router/           # Vue Router configuration
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── index.ts      # Core application types
│   │   └── *.d.ts        # Third-party library types
│   ├── utils/            # Utility functions
│   │   └── localStorage.ts # Local storage management
│   ├── views/            # Page components
│   │   ├── HomeView.vue
│   │   ├── JsonDiffView.vue
│   │   ├── JsonEscapeView.vue
│   │   ├── JsonBeautifyView.vue
│   │   ├── JsonConverterView.vue
│   │   ├── JsonValidateView.vue
│   │   └── JsonPathView.vue
│   ├── App.vue           # Root component
│   ├── main.ts           # Application entry point
│   └── style.css         # Global styles
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 📋 Usage Guide

### JSON Diff Tool

1. Enter your original JSON in the left textarea
2. Enter the modified JSON in the right textarea
3. Choose your preferred view mode (side-by-side or line-by-line)
4. Click "Compare JSON" to see the differences highlighted
5. Use the "Load Example" button to see a demonstration

### JSON Escape/Unescape Tool

1. Input your JSON string text
2. Click "Escape" to escape special characters, or "Unescape" to revert
3. Copy the result with the "Copy" button

### JSON Beautify/Minify Tool

1. Enter your JSON data
2. Use "Beautify" to format with proper indentation
3. Use "Minify" to compress the JSON into a single line
4. Adjust indentation settings as needed

### JSON Object Converter

1. Paste a JSON string or JavaScript object
2. Click "To Object" to convert JSON to a JavaScript object representation
3. Click "To JSON" to convert an object notation to valid JSON

### JSON Validator

1. Enter your JSON data
2. Click "Validate JSON" to check syntax and structure
3. View error details or success confirmation
4. See statistics about your JSON structure (objects, arrays, values)

### JSON Path Finder

1. Enter your JSON data
2. Enter a JSONPath expression (e.g., `$.store.book[*].author`)
3. Click "Evaluate" to extract matching values
4. Use the example paths for common query patterns
5. View the JSONPath syntax guide for reference

## 🏗️ Architecture

This project follows modern Vue 3 best practices:

- **Composition API**: All components use Vue 3's Composition API for better code organization
- **TypeScript Strict Mode**: Full type safety with strict TypeScript configuration
- **Composables**: Reusable business logic extracted into composables (`useJsonTool`, `useToast`)
- **Component Library**: Base components for consistent UI patterns
- **Local Storage**: Persistent state and history management
- **Performance**: Lazy loading, debounced inputs, and optimized builds

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/whatley95/json-util.git
cd json-util

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000/json-util/`

### Available Scripts

```bash
# Development
npm run dev          # Start development server on port 3000

# Building
npm run build        # Build for production (GitHub Pages)
npm run deploy:cf    # Build for Cloudflare Pages
npm run preview      # Preview production build locally

# Deployment
npm run deploy       # Deploy to GitHub Pages

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🌐 Deployment

### Cloudflare Pages Deployment

This project is optimized for Cloudflare Pages deployment:

```bash
# Build for Cloudflare Pages
npm run deploy:cf

# This sets CF_PAGES=1 environment variable and builds with:
# - Base path: '/' (root deployment)
# - Optimized for Cloudflare's edge network
# - Automatic version injection from package.json
```

### GitHub Pages Deployment

For GitHub Pages deployment:

```bash
# Build for GitHub Pages  
npm run build

# Deploy to gh-pages branch
npm run deploy
```

The `vite.config.ts` automatically detects the deployment target:
- Cloudflare Pages: `base: '/'` (when `CF_PAGES=1`)
- GitHub Pages: `base: '/json-util/'` (default)

### Version Management

The application automatically injects the current version from `package.json`:
- Header displays: "JSON Utilities v{version}"
- Footer shows version and build information
- Updates automatically when you change the version and rebuild

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

This project uses ESLint and Prettier for code formatting. Please ensure your code follows the existing style:

```bash
# Check code style
npm run lint

# Fix code style issues
npm run format
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Project Link: [https://github.com/whatley95/json-util](https://github.com/whatley95/json-util)  
Personal Website: [https://whatley.xyz/](https://whatley.xyz/)

---

Made with ❤️ by [Whatley](https://whatley.xyz/)
