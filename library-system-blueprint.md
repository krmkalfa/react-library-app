# React Library Management System - Specification Blueprint

## Core Architecture
- UI Framework: React (Vite)
- State Management: Zustand (with Persist middleware), React Context for Auth & Theme
- Form Handling: React Hook Form
- Styles: CSS Modules / SCSS (With theme variables)
- Key Constraint: 100% Client-side. LocalStorage is the database.

## Step-by-Step Implementation Sequence
1. Core setup, file tree structure creation.
2. ThemeContext & AuthContext setup (with mock admin user: admin/admin123).
3. Zustand stores design (category, book, member, loan).
4. Protected routing & Shell layout (Sidebar, Navbar).
5. Modules implementation (Category -> Book -> Member -> Loan & Return -> Dashboard).