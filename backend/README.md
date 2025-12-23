# Save Karo Backend

This is the backend API for the Save Karo expense tracker, built with Node.js, Express, and MongoDB.

## Setup

1.  **Install Dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables**:
    The `.env` file is already created with default values.
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/savekaro
    NODE_ENV=development
    ```
    Make sure you have MongoDB installed and running locally, or update `MONGO_URI` to point to your MongoDB Atlas cluster.

3.  **Run Server**:
    -   Development (with nodemon):
        ```bash
        npm run dev
        ```
    -   Production:
        ```bash
        npm start
        ```

## API Endpoints

-   `GET /api/expenses`: Get all expenses
-   `POST /api/expenses`: Create a new expense
-   `PUT /api/expenses/:id`: Update an expense
-   `DELETE /api/expenses/:id`: Delete an expense

## Data Model (Expense)

-   `title`: String (required)
-   `amount`: Number (required)
-   `category`: String (required, default: 'Misc')
-   `date`: Date (required)
-   `notes`: String
-   `receipt`: String (Base64)

## Integration with Frontend

To connect the frontend to this backend, you will need to update the frontend API calls (currently using `localStorage`) to fetch from `http://localhost:5000/api/expenses`.
