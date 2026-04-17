Library Borrowing System
A lightweight, client-side library borrowing management system designed for small and medium-sized libraries. The system adopts front-end native technologies and IndexedDB client-side database, realizing core functions such as user authentication, book management, borrowing/returning, and overdue reminders, with a simple and easy-to-use interface and local deployable features.
Table of Contents
- Project Overview
- Technical Stack
- Core Features
- File Structure
- Deployment Instructions
- Usage Guide
- Technical Details
- Limitations and Improvements
1. Project Overview
This project aims to address the pain points of traditional library circulation management—such as inaccurate inventory, inefficient processes, and cumbersome overdue management—by providing a lightweight, deployable client-side solution. The system does not rely on server-side databases or complex deployment environments; it runs directly in a web browser, making it ideal for small and medium-sized libraries with limited technical resources.
Developed in accordance with software project management theory, the project employs a hybrid management approach to ensure the system’s stability and feasibility.
2. Technical Stack
Front-end: HTML5, CSS3, Native JavaScript
Database: IndexedDB
Encryption: SHA-256 algorithm
Interface Design: CSS Flex/Grid layout
3. Core Features
The system supports two user roles (administrator and regular user) with distinct functional permissions, covering all core scenarios of library borrowing management.
3.1 Common Functions (Common Users)
User Authentication: Login, registration (with duplicate username verification and password encryption)
Book Management: Browse, search (by title/author), filter (by category), view book details
Borrowing/Returning: Borrow books (with stock verification), return books (with inventory automatic update)
Personal Records: Query personal borrowing history and borrowing status
Overdue Reminders: Browser pop-up reminders for overdue books or books about to be overdue after login
3.2 Administrator Functions
Book Management: Add, edit, delete books (editing/deletion is disabled if the book is borrowed)
Borrowing Management: View all active borrowing records, check overdue status, send overdue reminders
4. File Structure
The project file structure is clear and modular, facilitating maintenance and expansion:
Library-Borrowing-System-1/
├─ index.html # Main front-end interface (page layout, interaction logic)
├─ backend.js # Core business logic (encapsulated as LibraryAPI, IndexedDB operations)
├─ data.js # Default data initialization (default users, default books)
└─ README.md # Project description document (this file)

5. Deployment Instructions
The system adopts local deployment, no server or network dependency is required, and it can be run directly through a browser. The deployment steps are as follows:
i.	Create a new local folder (e.g., "library-borrowing-system") to store all project files.
ii.	Download index.html, backend.js, and data.js into the newly created folder, ensuring all files are in the same directory.
iii.	 Open the folder, find index.html, and double-click to open it with a modern browser (Chrome, Firefox, Edge, etc.).
iv.	The system will automatically initialize the IndexedDB database and default data after opening, and you can log in and use it directly.
6. Usage Guide
6.1 Default Accounts (for Demo)
Administrator: Username = admin, Password = password123
Regular User: Username = alice, Password = alice123
6.2 Basic Operation Steps
6.2.1 User Login/Registration
Open the system, select "Login" or "Register" on the home page.
For registration: Enter username, display name, and password, then click "Create Account".
For login: Enter the correct username and password, then click "Login" to enter the system.
6.2.2 Book Borrowing/Returning
After logging in as a regular user, you will enter the book browsing page.
Search or filter books, click "Borrow" to enter the confirmation page, set the borrowing days (default 14 days), and click "Confirm" to complete borrowing.
Click "My Borrows" to view personal borrowing records, and click "Return" to return the borrowed books.
6.2.3 Administrator Operations
Log in as an administrator, you will enter the admin panel automatically.
To add a book: Click "Add Book", fill in the book information (title, author, category, total, description), and click "Add".
To edit/delete a book: Find the book in the "All Books" table, click "Edit" to modify information or "Remove" to delete the book (disabled if the book is borrowed).
7. Technical Details
7.1 IndexedDB Database Design
The system uses IndexedDB as the client-side database, named lib_api_v3 (version 1), with four object stores:
users: Stores user information, primary key = username (includes username, name, password (encrypted), role)
books: Stores book information, primary key = id (auto-increment, includes title, author, category, total, available, description)
loans: Stores borrowing records, primary key = id (auto-increment, includes bookId, username, borrowAt, dueAt, returned)
reminds: Stores overdue reminders, primary key = id (auto-increment, includes username, book, left, time)
7.2 Core Logic Encapsulation
The core business logic is encapsulated in the LibraryAPI module (in backend.js), providing a unified interface for all operations, including:
Database initialization (init()): Automatically creates object stores and initializes default data.
User authentication (login(), register()): Implements password encryption and duplicate verification.
Book operations (getBooks(), addBook(), updateBook(), deleteBook()): Manages book information and inventory.
Borrowing/returning operations (borrowBook(), returnBook()): Ensures data integrity through transactions.
Reminder operations (addReminder(), getMyReminders()): Implements overdue reminder functions.
7.3 Data Security
User passwords are encrypted using the SHA-256 algorithm before storage, avoiding plaintext storage and ensuring user data security. The system also implements role-based access control, distinguishing between administrator and regular user permissions to prevent unauthorized operations.

