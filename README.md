# Personal Website with Deno and React

This repository contains my personal website built with Deno 2.1 and React. It uses a static site generation approach and is hosted on GitHub Pages. Visit https://hinamimi.github.io/blog/ .

## 🛠 Tech Stack

- **Runtime**: Deno 2.1
- **Framework**: React 18
- **Deployment**: GitHub Pages
- **Build**: Custom static site generator

## 🚀 Development

### Prerequisites

- Deno 2.1 or later installed on your machine
- Git for version control

### Local Development

1. Clone the repository:
```bash
git clone git@github.com:hinamimi/blog.git
cd blog
```

2. Start the development server:
```bash
deno run -A dev.ts
```

The development server will start at `http://localhost:8000/blog` with hot reload enabled. Any changes to the source files will automatically trigger a browser refresh.

### Project Structure

```
project-root/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment config
├── src/
│   ├── components/       # React components
│   ├── pages/            # Page components
│   └── routes.ts         # Routing definitions
├── static/               # Static assets
├── dev.tsx               # Development server
└── build.tsx             # Build script
```

## 🔨 Building

To build the site locally:

```bash
deno run -A build.tsx
```

This will generate static files in the `dist` directory.

## 📦 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

If you need to trigger a deployment manually:

1. Go to the repository's "Actions" tab on GitHub
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### First-time Setup

When setting up the repository for the first time:

1. Enable GitHub Pages in your repository settings:
  - Go to Settings > Pages
  - Set the source to "GitHub Actions"

2. Make sure the repository has the correct permissions:
  - Go to Settings > Actions > General
  - Ensure "Read and write permissions" is enabled under "Workflow permissions"

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📫 Contact

- GitHub: [@hinamimi](https://github.com/hinamimi)
