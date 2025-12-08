# Retail Sales Management System

## 1. Overview
This project is a full-stack Retail Sales Management System designed to process and visualize structured sales data. It features a modular architecture that separates frontend interface logic from backend data processing. The system supports advanced case-insensitive search, complex multi-select filtering, and dynamic sorting to efficiently manage customer transactions and inventory records.

## 2. Tech Stack
* **Frontend:** React.js, Vite, CSS Modules
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Tools:** Git, Postman

## 3. Search Implementation Summary
I implemented a performant, case-insensitive full-text search capability targeting the **Customer Name** and **Phone Number** fields. The search logic is handled in the backend Service layer using MongoDB regex queries. It is designed to work concurrently with active filters and sorting, ensuring that search results are always contextually accurate.

## 4. Filter Implementation Summary
The system uses a dynamic query builder to handle multi-select and range-based filtering. Supported filters include **Customer Region, Gender, Age Range, Product Category, Tags, Payment Method,** and **Date Range**. The implementation handles edge cases such as conflicting filters or missing optional fields by programmatically constructing the database query object based only on present parameters.

## 5. Sorting Implementation Summary
Server-side sorting is implemented for **Date (Newest First)**, **Quantity**, and **Customer Name (A-Z)**. The sorting logic parses the request query parameters to apply the correct sort direction (`asc` or `desc`) at the database level, ensuring the order is applied to the filtered dataset before pagination.

## 6. Pagination Implementation Summary
Pagination is implemented at the database level using `skip` and `limit` logic to ensure performance with large datasets. The system enforces a limit of **10 items per page**. The frontend maintains the current page state and resets to Page 1 whenever a new search or filter is applied to prevent empty views.

## 7. Setup Instructions

### Prerequisites
* Node.js (v14+)
* MongoDB Connection URI (Local or Atlas)

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and add your MongoDB URI:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    ```
4.  **Data Seeding (Important):**
    * Download the `dataset.csv` provided in the assignment description.
    * Place the file inside `backend/src/utils/`.
    * Run the seed script to populate your database:
    ```bash
    node backend/seed.js
    ```
5.  Start the server:
    ```bash
    npm start
    ```

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.
