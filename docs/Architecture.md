# Architecture Document: Retail Sales Management System

## 1. Backend Architecture

[cite_start]The backend follows a **Layered Architecture (Controller-Service-Model)** pattern to ensure Separation of Concerns (SoC) and modularity[cite: 97, 101]. This structure ensures that business logic is decoupled from HTTP transport logic, making the system testable and maintainable.

### Architectural Layers
* **Presentation Layer (Routes & Controllers):**
    * **Routes:** Define the API endpoints and map them to specific controller functions.
    * **Controllers:** Handle incoming HTTP requests, validate inputs (e.g., query params for filtering/sorting), and structure the HTTP response. They do **not** contain business logic.
* **Business Logic Layer (Services):**
    * **Services:** Contain the core logic for the application. [cite_start]This layer handles the complex orchestration of **Search**, **Filtering**, and **Sorting**[cite: 100]. It builds the dynamic database queries based on the combined criteria received from the controller.
* **Data Access Layer (Models):**
    * [cite_start]**Models:** Define the schema for the Sales Data (Customer, Product, Sales, Operational fields) and interact directly with the database [cite: 17-46].

### Design Decisions
* [cite_start]**Query Construction:** To handle "conflicting filters" and "multi-select" requirements[cite: 60, 139], the Service layer utilizes a dynamic query builder pattern. It programmatically appends conditions (WHERE clauses or MongoDB $match stages) based on the presence of optional fields.
* [cite_start]**Pagination:** Implemented at the database level (using `limit` and `offset`/`skip`) to ensure performance with large datasets[cite: 80].

---

## 2. Frontend Architecture

[cite_start]The frontend is built using a **Component-Based Architecture** (React) focusing on reusability and predictable state management[cite: 99].

### Core Concepts
* **State Management:**
    * The application uses a centralized state (via React Hooks `useSalesData`) to manage the `queryParams` object. [cite_start]This object acts as the "Single Source of Truth" for the active Search, Filter, Sort, and Page states[cite: 72, 83].
* **Component Structure:**
    * **Container Components (Pages):** Handle data fetching and state orchestration.
    * **Presentational Components:** Pure functional components (e.g., `TransactionTable`, `FilterPanel`) that receive data via props and emit events via callbacks.
* **URL Synchronization:**
    * Filter and Sort states are synchronized with URL query parameters to allow shareable links and browser navigation support.

---

## 3. Data Flow

[cite_start]The data flow is unidirectional, ensuring predictability[cite: 99, 163].

1.  **User Interaction:** User updates a filter, changes a page, or types in the search bar.
2.  **State Update:** The frontend `hook` updates the composite `queryParams` state.
3.  **API Request:** The `frontend/services` module triggers an HTTP GET request with the serialized query parameters (e.g., `?search=doe&gender=male&sort=date_desc&page=1`).
4.  **Backend Routing:** `backend/routes` directs the request to the `SalesController`.
5.  **Processing:**
    * `SalesController` extracts parameters and calls `SalesService`.
    * [cite_start]`SalesService` constructs the query, handles text search sanitization, and applies range logic.
6.  **Data Retrieval:** The database executes the query and returns the paginated dataset + total count.
7.  **UI Update:** The frontend receives the JSON response and updates the `TransactionTable` and `PaginationControls`.

---

## 4. Folder Structure

[cite_start]The project strictly follows the required single-repository structure[cite: 104].

```text
root/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers (getSales, getFilters)
│   │   ├── services/         # Business logic (search, filter, sort algorithms)
│   │   ├── utils/            # Helper functions (date formatters, query builders)
│   │   ├── routes/           # API route definitions
│   │   ├── models/           # Database schema definitions
│   │   └── index.js          # Entry point (Server setup)
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI (FilterPanel, Table, Pagination)
│   │   ├── pages/            # Main views (Dashboard/Home)
│   │   ├── routes/           # Router configuration
│   │   ├── services/         # API integration (axios/fetch wrappers)
│   │   ├── utils/            # Formatting helpers (currency, date)
│   │   ├── hooks/            # Custom hooks (useDebounce, useSalesQuery)
│   │   ├── styles/           # CSS modules or Global styles
│   │   └── main.jsx          # Application Entry
│   ├── public/
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md       # System design documentation
├── README.md                 # Project overview and setup
└── package.json              # Root configuration