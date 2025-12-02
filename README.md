# 📋 Tasky - Task Management Application

A modern, full-featured task management application built with Next.js and Appwrite. Tasky helps teams organize their work with workspaces, projects, tasks, and powerful collaboration features.

## ✨ Features

### 🎯 Core Features

- **Workspace Management**: Create and manage multiple workspaces for different teams or projects
- **Project Organization**: Organize tasks into projects with custom settings
- **Task Management**: Create, edit, assign, and track tasks with detailed information
- **Member Collaboration**: Invite team members and manage workspace/project access
- **Drag & Drop**: Intuitive drag-and-drop interface for task organization
- **Calendar View**: Visualize tasks and deadlines in a calendar format
- **Analytics Dashboard**: Track project progress and team performance with charts
- **Authentication**: Secure user authentication with OAuth support
- **Responsive Design**: Fully responsive UI that works on desktop and mobile devices

### 🎨 UI/UX Features

- Modern, clean interface built with Shadcn UI components
- Smooth animations and transitions
- Accessible components following ARIA standards
- Toast notifications for user feedback
- Loading states and error handling
- Responsive navigation and sidebar

## 🛠️ Tech Stack

### Frontend Framework

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Backend & Database

- **[Appwrite](https://appwrite.io/)** - Backend as a Service (BaaS)
  - Database (NoSQL)
  - Authentication
  - Storage
  - Real-time subscriptions

### API Layer

- **[Hono](https://hono.dev/)** - Lightweight web framework for API routes
- **[Zod](https://zod.dev/)** - Schema validation
- **[@hono/zod-validator](https://www.npmjs.com/package/@hono/zod-validator)** - Zod integration for Hono

### State Management & Data Fetching

- **[TanStack Query (React Query)](https://tanstack.com/query)** - Server state management
- **[nuqs](https://nuqs.47ng.com/)** - URL state management

### UI Components & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
  - Avatar, Checkbox, Dialog, Dropdown Menu
  - Label, Popover, Scroll Area, Select
  - Separator, Slot, Tabs, Tooltip
- **[Shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built on Radix UI
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[React Icons](https://react-icons.github.io/react-icons/)** - Additional icons
- **[class-variance-authority](https://cva.style/)** - Component variants
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes
- **[tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)** - Animation utilities

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolvers
- **[Zod](https://zod.dev/)** - Schema validation

### UI Libraries & Features

- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and drop functionality
- **[React Big Calendar](https://github.com/jquense/react-big-calendar)** - Calendar component
- **[date-fns](https://date-fns.org/)** - Date utility library
- **[react-day-picker](https://react-day-picker.js.org/)** - Date picker component
- **[Recharts](https://recharts.org/)** - Charts and data visualization
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Vaul](https://vaul.emilkowal.ski/)** - Drawer component
- **[react-use](https://github.com/streamich/react-use)** - React hooks library

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[TypeScript](https://www.typescriptlang.org/)** - Type checking

## 📁 Project Structure

```
tasky/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication routes (sign-in, sign-up)
│   │   ├── (dashboard)/         # Dashboard routes (workspaces, projects, tasks)
│   │   ├── (standalone)/        # Standalone pages (workspace/project creation)
│   │   ├── api/                 # API routes with Hono
│   │   ├── oauth/               # OAuth callback handling
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   ├── loading.tsx          # Global loading state
│   │   ├── error.tsx            # Global error boundary
│   │   └── not-found.tsx        # 404 page
│   │
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── analytics/           # Analytics components
│   │   ├── navbar/              # Navigation bar
│   │   ├── sidebar/             # Sidebar navigation
│   │   ├── projects/            # Project-related components
│   │   ├── tasks/               # Task-related components
│   │   ├── workspace/           # Workspace components
│   │   ├── member/              # Member components
│   │   ├── responsive/          # Responsive utilities
│   │   ├── loading/             # Loading components
│   │   ├── error/               # Error components
│   │
│   ├── feature/                 # Feature modules
│   │   ├── auth/                # Authentication logic & components
│   │   ├── workspaces/          # Workspace management
│   │   ├── projects/            # Project management
│   │   ├── tasks/               # Task management
│   │   └── members/             # Member management
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions & configurations
│   ├── validations/             # Zod validation schemas
│   └── config.ts                # App configuration
│
├── public/                      # Static assets
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── components.json              # Shadcn UI configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 22.x or higher
- **npm** or **yarn** or **pnpm**
- **Appwrite Account**: Create an account at [appwrite.io](https://appwrite.io/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mandouro-22/tasky.git
   cd tasky
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Appwrite**

   - Create a new project in Appwrite Console
   - Create a database with the following collections:
     - Workspaces
     - Members
     - Projects
     - Tasks
   - Create a storage bucket for images
   - Configure authentication providers (Email/Password, OAuth)

4. **Configure environment variables**

   - Copy `.env.example` to `.env`

   ```bash
   cp .env.example .env
   ```

   - Fill in your Appwrite credentials:
     - `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Your Appwrite endpoint
     - `NEXT_PUBLIC_APPWRITE_PROJECT`: Your project ID
     - `NEXT_PUBLIC_APPWRITE_DATABASE_ID`: Your database ID
     - `NEXT_PUBLIC_APPWIRTE_WORKSPACE_ID`: Workspaces collection ID
     - `NEXT_PUBLIC_APPWIRTE_MEMBERS_ID`: Members collection ID
     - `NEXT_PUBLIC_APPWIRTE_PROJECTS_ID`: Projects collection ID
     - `NEXT_PUBLIC_APPWIRTE_TASKS_ID`: Tasks collection ID
     - `IMAGE_BUCKET_ID`: Storage bucket ID for images
     - `NEXT_PUBLIC_APP_URL`: Your app URL (http://localhost:3000/ for development)

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](https://tasky-virid.vercel.app/)

### Build for Production

```bash
npm run build
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

See `.env.example` for all required environment variables. Make sure to never commit your `.env` file to version control.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Appwrite](https://appwrite.io/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ using Next.js and Appwrite
