# TradeMonk

A modern React application built with Vite and Tailwind CSS using a layered architecture.

## 🚀 Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 19** - Latest React version
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📁 **Layered Architecture** - Organized and scalable folder structure
- 🛣️ **React Router** - Client-side routing
- 🔐 **Auth Context** - Built-in authentication state management
- 🌙 **Theme Context** - Dark/Light mode support
- 📱 **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, icons, fonts)
│   ├── images/
│   └── icons/
├── components/          # Reusable UI components
│   ├── common/          # Common components (Header, Footer)
│   └── ui/              # UI primitives (Button, Input, Card)
├── constants/           # Application constants
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── layouts/             # Page layout components
├── pages/               # Page components
│   ├── Home/
│   ├── About/
│   └── NotFound/
├── router/              # Router configuration
├── services/            # API services
├── store/               # State management (optional)
├── utils/               # Utility functions
├── App.jsx              # Main App component
├── index.css            # Global styles with Tailwind
└── main.jsx             # Application entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/TradeMonk.git
cd TradeMonk
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🏗️ Architecture Overview

### Layers

1. **Pages** - Top-level components representing routes
2. **Layouts** - Page structure templates (MainLayout, AuthLayout)
3. **Components** - Reusable UI elements
   - `ui/` - Atomic components (Button, Input, Card)
   - `common/` - Shared components (Header, Footer)
4. **Hooks** - Custom React hooks for reusable logic
5. **Services** - API calls and external service integrations
6. **Context** - Global state management with React Context
7. **Utils** - Helper functions and utilities
8. **Constants** - Application-wide constants

### Import Aliases

The project uses path aliases for cleaner imports:

```javascript
import { Button } from '@components/ui'
import { useAuth } from '@context'
import { HomePage } from '@pages'
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling. The configuration is in `vite.config.js` with the `@tailwindcss/vite` plugin.

## 🔐 Authentication

The app includes a pre-built authentication context (`AuthContext`) that provides:

- `user` - Current user object
- `isAuthenticated` - Authentication status
- `login()` - Login function
- `logout()` - Logout function
- `updateUser()` - Update user data

## 📝 License

MIT License - feel free to use this template for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
