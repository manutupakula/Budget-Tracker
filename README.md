Budget Tracker App 💰
A personal finance web app built using HTML, CSS and JavaScript with Chart.js for data visualization. I made this project to practice DOM manipulation, working with browser storage, and integrating third-party chart libraries — all without using any framework.
The app lets you add your daily income and expenses, organize them by category, and see your spending habits through interactive charts. It also has a dark/light mode toggle that remembers your preference.


About the Project💻
I built this as a beginner-friendly finance tracker to understand how real web apps work before jumping into frameworks like React. The goal was to build something useful while only using the basics — HTML, CSS, and JavaScript.
All data is saved in the browser's LocalStorage so your transactions stay even after you close and reopen the tab. The dark/light mode preference is also remembered separately.

Features⚙️

Add income and expense transactions with a description, amount, and category
12 category options with emoji icons (Food, Transport, Salary, Rent, etc.)
Donut Chart — shows the ratio of income vs expense visually
Bar Chart — compares income and expenses across the last 6 months
Category Breakdown — horizontal progress bars showing which categories you spend most on
Real-time summary cards showing total balance, income, and expenses
Filter transactions by All / Income / Expense
Delete individual transactions
Clear all transactions at once with a confirmation prompt
Dark / Light mode toggle — theme preference is saved in LocalStorage
Fully responsive — works on mobile and desktop
No installation needed — just open index.html in a browser


Tech Stack🌐
Technology            How it's used
HTML5                 Page structure and layout
CSS3                  Styling, CSS variables for theming, responsive design
JavaScript            App logic, DOM manipulation, event handling
Chart.js 4            Donut chart and bar chart
LocalStorage API      Saving transactions and theme preference in the browser

Project Structure📁
budget-tracker-html/
│
├── index.html      # Main HTML file — structure of the entire app
├── style.css       # All styles including dark/light theme variables
├── app.js          # All JavaScript — logic, charts, LocalStorage, rendering
└── README.md       # Project documentation
Since this is a vanilla JS project, everything is kept in just 3 files to keep it simple and easy to understand.

Getting Started

No installation or setup is required for this project.
Prerequisites
All you need is a modern web browser like:

Google Chrome
Mozilla Firefox
Microsoft Edge

Steps to Run▶️

Download or clone this repository

bashgit clone https://github.com/your-username/budget-tracker-html.git

Open the project folder
Double-click on index.html

That's it — the app opens directly in your browser! ✅

Tip: If you want live reload while editing, you can use the Live Server extension in VS Code. Right-click index.html → Open with Live Server.


How to Use📄

Adding a transaction:

Type a description in the input field (e.g. "Monthly Salary" or "Grocery Shopping")
Enter the amount
Select a category from the dropdown
Choose whether it's Income or Expense using the toggle buttons
Click Add Transaction or press Enter

Viewing your data📊:

The 3 cards at the top always show your current balance, total income, and total expenses
The donut chart shows the income vs expense split
The bar chart shows your last 6 months of activity
The category breakdown shows which categories have the highest spending

Managing transactions💵:

Use the All / Income / Expense buttons to filter the list
Click ✕ on any transaction to delete it
Click 🗑 Clear All to remove all transactions (a confirmation will appear)

Dark / Light mode🔆🌙:

Click the toggle button in the top right corner to switch between dark and light mode
Your preference is saved automatically


Screenshots🏞️:

<img width="1013" height="951" alt="image" src="https://github.com/user-attachments/assets/08e76a20-a2a2-4647-b477-2d9f83a80016" />
<img width="968" height="946" alt="image" src="https://github.com/user-attachments/assets/c043e1d6-3067-42be-80ed-b77ce9a1570a" />
<img width="930" height="946" alt="image" src="https://github.com/user-attachments/assets/7002402e-31fe-4603-b45e-60140f803723" />

What I Learned👨🏻‍💻
This project taught me a lot about building real apps with vanilla JavaScript:

How to manipulate the DOM dynamically to render lists and update values without page reload
How to use CSS custom properties (variables) to implement a dark/light theme toggle cleanly
How to use LocalStorage to persist data across sessions without a backend
How to integrate Chart.js using a CDN link and update charts dynamically as data changes
How to sanitize user input before inserting it into the DOM to prevent XSS issues
How to structure a single-page app in plain JavaScript using functions instead of components
How to make a layout responsive using CSS Grid and media queries

