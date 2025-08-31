# To-Do List Web Application

This is a web application for managing your to-do list. It includes features like user authentication, adding/editing/deleting tasks, and filtering tasks.

## Features

-   User authentication (login and sign-up)
-   Add, edit, and delete tasks
-   Filter tasks by status
-   Pagination for task lists

## Installation

### Prerequisites

-   Node.js (v16 or later)
-   Composer
-   PHP (v8.0 or later)
-   MySQL

### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/deckzie/to-do-list.git
    cd to-do-list
    ```
2. Install PHP dependencies:
    ```bash
    composer install
    ```
3. Set up the `.env` file:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Update the database credentials in the `.env` file.
4. Generate the application key:
    ```bash
    php artisan key:generate
    ```
5. Run database migrations:
    ```bash
    php artisan migrate
    ```
6. Start the backend server:
    ```bash
    php artisan serve
    ```

### Frontend Setup

1. Navigate to the `vue` directory:
    ```bash
    cd vue
    ```
2. Install Node.js dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

### Accessing the Application

-   Open your browser and navigate to `http://localhost:8000` for the backend or the port shown for the frontend.
