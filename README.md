# TaskForge CRUD — SOLID Principles

A task manager built to demonstrate SOLID design principles in React.

## Folder Structure
src/
├── utils/         → idGenerator, validator, dateFormatter (S)
├── filters/       → filterStrategies (O)
├── repository/    → InMemoryTaskRepository (L)
├── hooks/         → useTaskFilter, useTaskForm (I)
├── services/      → TaskService (D)
└── App.js

## SOLID Breakdown
- S: Each util does exactly one job
- O: Add filters without changing existing code
- L: Repository is swappable
- I: Hooks are small and focused
- D: TaskService uses injected dependency

## Tech Stack
React · JavaScript · CSS-in-JS
