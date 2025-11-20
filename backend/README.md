# Backend - To-Do CRUD API

This folder contains a simple Node.js (Express) application that provides a CRUD API for managing to-do items.

## Setup and Running

1.  **Install Dependencies:**
    Open a terminal in the `/backend` directory and run:
    ```bash
    npm install
    ```

2.  **Start the Server:**
    To start the server, run the following command:
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3001`.

## API Endpoints

-   `GET /todos`: Get all to-do items.
-   `POST /todos`: Create a new to-do item.
    -   Request Body: `{ "title": "Your to-do title" }`
-   `PUT /todos/:id`: Update a to-do item.
    -   Request Body: `{ "title": "Updated title", "completed": true }`
-   `DELETE /todos/:id`: Delete a to-do item.
