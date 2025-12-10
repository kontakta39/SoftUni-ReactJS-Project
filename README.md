# Online Library

Online Library is a web application that allows users to register, log in, and manage a personal library of books. Only authenticated users can add, edit, or delete their own books, borrow books from other users, return borrowed books, and leave comments on books they do not own. The system enforces permissions, ensuring that book owners cannot edit or delete books that are currently borrowed.

## Features

### User Authentication
- Register a new account
- Log in with an existing account
- Only authenticated users can borrow books or leave comments
- A default admin account is available on the server:
  - **Username:** Admin   
  - **Email:** admin@abv.bg  
  - **Password:** admin

### Book Management
- Add new books to your personal library
- Edit and delete your own books (if not currently borrowed)
- Borrow books from other users
- Track borrowed books on a separate page
- Owners cannot edit or delete books that are currently borrowed

### Comments
- Add comments on other users' books
- Users cannot comment on their own books

## Installation

1. Clone the repository:  
```bash
git clone https://github.com/kontakta39/SoftUni-ReactJS-Project.git
cd SoftUni-ReactJS-Project
```

2. Install dependencies:  
```bash
npm install
```

3. Start the client:  
```bash
npm run dev
```
The client will typically run at [http://localhost:5173](http://localhost:5173/).

4. Start the server:  

This application uses the **SoftUni Practice Server** as a backend. Start it in a separate terminal:  
```bash
node server.js
```
The server runs on [http://localhost:3030](http://localhost:3030), which is used for all API requests.

## Usage

- Open the application in your browser (usually at [http://localhost:5173](http://localhost:5173/)).
- Register a new user or log in with an existing account.
- Add, edit, or delete your books from the library.
- Borrow books from other users and view them on your "Borrowed Books" page.
- Leave comments on books you do not own.
- Return borrowed books to allow the owner to edit or delete them.

## Technology Stack

- **Frontend:** React, Tailwind CSS, React Router  
- **Backend:** SoftUni Practice Server (Node.js-based, port 3030)  
- **Other:** JavaScript, HTML, CSS  

## Notes

- Only authenticated users can perform actions such as borrowing books or adding comments.  
- Owners cannot modify or delete books that are currently borrowed.  
- Comments can only be added on books that belong to other users.  

## License

This project is for educational purposes and practice.
