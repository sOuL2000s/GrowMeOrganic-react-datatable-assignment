# Art Institute of Chicago Artworks Data Table

This is a React application built with Vite and TypeScript that displays artworks from the Art Institute of Chicago API in a PrimeReact DataTable. It features server-side pagination, persistent row selection across pages, and a custom panel to manage selected artworks.

## Features

*   **Artwork Display:** Fetches and displays artwork data including `title`, `place_of_origin`, `artist_display`, `inscriptions`, `date_start`, and `date_end`.
*   **Server-Side Pagination:** Efficiently loads data from the API page by page. When the user navigates between pages, a new API call is made for the respective page's data.
*   **Row Selection:** Allows users to select individual rows or all rows on the current page using checkboxes.
*   **Persistent Selection:** Selected and deselected rows persist their state even when the user navigates to different pages and returns.
*   **Custom Selection Panel:** A dedicated section displays all currently selected artworks, providing an overview and the ability to remove individual items or clear all selections.
*   **Memory Efficient:** No variable holds all rows fetched from different pages, preventing out-of-memory issues. Only minimal data (ID, title, artist) for selected artworks is stored globally.
*   **Modern UI:** Utilizes PrimeReact components and PrimeFlex for a clean and responsive user interface.

## Tech Stack

*   **Framework:** React (with Vite)
*   **Language:** TypeScript
*   **UI Library:** PrimeReact (DataTable, Chip, ScrollPanel)
*   **Icons:** PrimeIcons
*   **Styling Utilities:** PrimeFlex
*   **Data Fetching:** Native Fetch API

## API Used

The application fetches artwork data from the following API:
`https://api.artic.edu/api/v1/artworks?page={page_number}`

## How to Run Locally

Follow these steps to set up and run the project on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/sOuL2000s/GrowMeOrganic-react-datatable-assignment.git
    cd my-art-app # Or the name of your cloned directory
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173/` (check your terminal for the exact URL).

## How to Build for Production

To create an optimized production build of the application:

```bash
npm run build
```
This command will compile and bundle your application into the `dist` folder. You can then deploy the contents of this `dist` folder to your chosen hosting provider.

## Deployed Application

The application is deployed and can be accessed at:
https://growmeorganic-react-datatable-assignm.netlify.app/

---