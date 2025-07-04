# CLAUDE.md

**IMPORTANT** Claude Code must be answered in Japanese for this project.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

- Personal development project for frontend learning purposes
- Individual learning focus - avoid team development or task delegation suggestions

## Package Manager

This project uses **pnpm** (see pnpm-lock.yaml and pnpm-workspace.yaml). Always use pnpm instead of npm or yarn.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (runs TypeScript compilation followed by Vite build)
- `pnpm lint` - Run ESLint on all files with automatic fix
- `pnpm format` - Format code using Prettier
- `pnpm preview` - Preview production build locally

## Custom Tool

- `npx @tailwindcss/upgrade` - if the tailwindcss styling does not appear as expected, this command should be executed first.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with @vitejs/plugin-react
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **Linting**: ESLint with TypeScript and React plugins
- **Formatting**: Prettier with ESLint integration

## Project Structure

- Standard Vite + React setup with TypeScript
- Uses project references (tsconfig.json splits into app and node configs)
- Single-page application structure in src/
- Tailwind CSS integrated at build level via Vite plugin

### Directory Guidelines

- Keep component hierarchy shallow
- Avoid creating directories with only 1 file
- Don't split components with low reusability
- Prefer simple, flat directory structure

## Coding Guidelines

- Use 2 spaces for indentation
- Always use semicolons
- Prefer single quotes
- All components must be typed with React.FC<Props>
- Use ES modules (import/export)
- All functions and components should be written in Arrow functions (e.g const foo = () => {}).

### Code Comments

- Short Japanese comments should be added to code that performs important processing. We will try to provide easy-to-understand explanations.

## Configuration Notes

- ESLint uses the new flat config format (eslint.config.js)
- TypeScript configuration is split between tsconfig.app.json and tsconfig.node.json
- Tailwind CSS v4 is configured via Vite plugin rather than traditional config file
- No test framework currently configured

## Commit Guidelines

When you are asked to "commit your changes," create the appropriate commit message yourself according to the following rules

- Commit messages are limited to 50 characters
- The commit message should be in English, short and concise (e.g. fix styling pc-view header)
