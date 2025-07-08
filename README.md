# JSON Utility Tool

A modern, comprehensive web application for working with JSON data. This project provides multiple tools to manipulate, validate, compare, and explore JSON data through an intuitive user interface.

![JSON Utility Screenshot](./screenshot.png)

## 🚀 Features

- **JSON Diff**: Compare two JSON objects and visualize the differences with side-by-side or line-by-line views
- **JSON Escape/Unescape**: Easily escape or unescape JSON strings
- **JSON Beautify/Minify**: Format JSON for readability or minify it for reduced file size
- **JSON to Object Converter**: Convert between JSON strings and JavaScript objects
- **JSON Validator**: Check JSON syntax with detailed error messages and structure statistics
- **JSON Path Finder**: Query complex JSON structures using JSONPath expressions

## 🛠️ Technologies

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia for state management
- diff2html for JSON comparison visualization
- jsonlint-mod for validation

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

The application will be available at `http://localhost:3000`

### Building for Production

```bash
# Build optimized production version
npm run build

# Preview the production build
npm run preview
```

## 🌐 Deployment

### GitHub Pages Deployment

This project is configured for easy deployment to GitHub Pages:

1. Fork this repository
2. Update `vite.config.ts` to set your base path (if not deploying at root)
   ```ts
   base: '/json-util/',  // The repo name for GitHub Pages deployment
   ```
3. Run the deploy script
   ```bash
   npm run build
   ```
4. Enable GitHub Pages in your repository settings, pointing to the "dist" folder in the "gh-pages" branch

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
