# ✦ Flowdesk

A task management web app I built to learn and apply **SOLID design principles** in React. This was one of my first structured projects where I actually thought about code architecture instead of just making things work.

---

## 🙋 Why I built this

I kept hearing about SOLID principles in class and online but never really understood how to use them in actual code. So I decided to build something small but real where I could apply each one properly. Took me a while to get the structure right but I'm pretty happy with how it turned out.

---

## 🚀 What it does

- Add, edit, delete and view tasks (full CRUD)
- Filter tasks by status (active / done / high priority)
- Dashboard with live stats and progress bar
- Clean sidebar navigation
- Separate page explaining each SOLID principle with examples from the code

---

## 🧱 SOLID Principles Used

| Principle | What I did |
|---|---|
| **S** – Single Responsibility | Split logic into small files — `idGenerator.js`, `validator.js`, `dateFormatter.js` each do one thing |
| **O** – Open/Closed | `filterStrategies.js` lets me add new filters without touching existing code |
| **L** – Liskov Substitution | `InMemoryTaskRepository` can be swapped for localStorage or an API without breaking anything |
| **I** – Interface Segregation | Made two small hooks `useTaskFilter` and `useTaskForm` instead of one big messy hook |
| **D** – Dependency Inversion | `TaskService` gets its storage injected via constructor so it's not tightly coupled |

---

## 🗂️ Folder Structure

```
src/
├── utils/
│   ├── idGenerator.js       # generates unique IDs
│   ├── validator.js         # form validation
│   └── dateFormatter.js     # formats dates
├── filters/
│   └── filterStrategies.js  # filter logic
├── repository/
│   └── InMemoryTaskRepository.js  # stores tasks in memory
├── hooks/
│   ├── useTaskFilter.js     # handles filter state
│   └── useTaskForm.js       # handles form state
├── services/
│   └── TaskService.js       # all task operations
└── App.js                   # main UI
```

---

## 🛠️ Tech Stack

- React.js
- JavaScript (ES6+)
- CSS-in-JS (inline styles)
- No extra libraries — kept it simple on purpose

---

## 💻 Run Locally

```bash
git clone https://github.com/anushreya0606/crud-solid-app.git
cd crud-solid-app
npm install
npm start
```

App opens at `http://localhost:3000`

---

## 📚 What I learned

- How to actually structure a React project properly
- What dependency injection means in practice (not just theory)
- Writing reusable hooks and keeping components clean
- Using Git for version control on a real project

---

## 👩‍💻 About

Made by a 2nd year CSE student trying to write better code 🙂  
Still learning — open to feedback!
