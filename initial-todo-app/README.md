# Task Master - Modern Todo Application

A full-stack todo application built with React, TypeScript, and AWS Lambda, featuring user authentication, real-time updates, and a beautiful UI.

![Task Master Screenshot](https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=1000&q=80)

## Features

- 🔐 User authentication (login/register)
- ✨ Beautiful, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- ⚡ Real-time updates
- 🎯 Filter todos by status
- ✏️ Edit todo items inline
- 🗑️ Delete and clear completed todos
- 💾 Persistent storage with AWS Lambda backend
- 🔧 Mock API for local development

## Prerequisites

- Node.js 18+ and npm
- AWS Account (for Lambda deployment)
- Basic knowledge of React and TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd initial-todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Local Development:
   - The app includes a mock API that simulates the backend functionality
   - Use these demo credentials to test:
     - Email: demo@example.com
     - Password: demo123
   - To use the mock API, ensure `IS_MOCK = true` in `src/services/api.ts`

4. AWS Integration:
   - Set up environment variables in `.env`:
     ```env
     VITE_API_URL=your_api_gateway_url
     ```
   - Set `IS_MOCK = false` in `src/services/api.ts`

5. Start the development server:
```bash
npm run dev
```

## Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Technologies Used

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - Lucide Icons

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [AWS](https://aws.amazon.com/) for backend infrastructure