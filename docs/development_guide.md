# FormWise: Development Guide

## 1. Project Overview

FormWise is an application designed to transform questionnaires (from PDF or text) into interactive HTML forms. It leverages AI for parsing and schema generation, facilitates client-side data collection, and provides an investigator dashboard for data viewing and analysis. Optionally, it can perform server-side AI analysis of collected results.

**Core Features (from `docs/blueprint.md`):**
- Questionnaire Parsing (Gemini API)
- Interactive Form Generation (HTML)
- Client-Side Data Collection
- Investigator Dashboard (Client-Side)
- Shareable Forms (Downloadable HTML/URLs)
- Result Sharing and Output (JSON for Dashboard)
- Server-Side AI Analysis (Optional)

**Style Guidelines (from `docs/blueprint.md`):**
- Primary color: Light green (#A7D1AB)
- Secondary color: Soft gray (#E5E7EB)
- Accent color: Teal (#26A69A)
- Fonts: Clean and readable sans-serif
- Layout: Clean, simple, focused
- Icons: Minimalistic
- Interactions: Subtle transitions and animations

## 2. Project Structure (`src` directory)

The `src` directory houses all the core source code for the FormWise application.

```
src/
├── ai/                     # AI-related logic, flows, and configurations
│   ├── flows/              # Specific AI processing flows
│   │   ├── parse-questionnaire.ts    # Logic for parsing questionnaires
│   │   └── summarize-form-results.ts # Logic for summarizing form results (optional server-side)
│   ├── dev.ts              # Development related AI configurations/utilities
│   └── genkit.ts           # Genkit AI framework setup and configuration
├── app/                    # Next.js application pages and core layout
│   ├── dashboard/          # Investigator dashboard page
│   │   └── page.tsx        # Main component for the dashboard UI
│   ├── results/            # Page for displaying/sharing form results (likely client-side)
│   │   └── page.tsx        # Main component for the results page
│   ├── favicon.ico         # Application favicon
│   ├── globals.css         # Global stylesheets, likely including Tailwind CSS base and custom styles
│   ├── layout.tsx          # Root layout component for the Next.js application
│   └── page.tsx            # Main landing page of the application
├── components/             # Reusable React components
│   ├── ui/                 # UI library components (e.g., Shadcn/UI components)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── tooltip.tsx
│   ├── form-uploader.tsx   # Component for uploading questionnaire files
│   ├── header.tsx          # Application header component
│   ├── providers.tsx       # React Context providers or similar global state setup
│   └── results-summary.tsx # Component for displaying a summary of results
├── hooks/                  # Custom React hooks
│   ├── use-mobile.tsx      # Hook to detect mobile devices
│   └── use-toast.ts        # Hook for displaying toast notifications
└── lib/                    # Library/utility functions
    ├── form-script-generator.ts # Generates client-side JavaScript for interactive forms (data collection, validation)
    ├── form-styles.ts        # Defines or generates CSS styles embedded within HTML forms
    ├── html-form-generator.ts # Core logic for generating self-contained interactive HTML forms, utilizing form-script-generator and form-styles
    ├── url-utils.ts        # Utility functions for URL manipulation (e.g., for shareable links)
    └── utils.ts            # General utility functions used across the application

```

## 3. Core Functionalities & Implementation

This section maps the core features outlined in `blueprint.md` to their respective implementation locations within the codebase.

-   **Questionnaire Parsing & Schema Generation:**
    -   **Trigger:** User uploads a questionnaire file (e.g., PDF, text) via the `src/components/form-uploader.tsx` component.
    -   **Processing:** The `src/ai/flows/parse-questionnaire.ts` flow is invoked. It uses the Genkit framework to interact with the Gemini API.
    -   **Output:** This flow parses the questionnaire content and generates a structured data schema (e.g., JSON schema) that defines the form fields and their types. This schema is crucial for both form generation and data interpretation in the dashboard.

-   **Interactive Form Generation (HTML):**
    -   **Input:** Takes the AI-generated data schema from `parse-questionnaire.ts`.
    -   **Core Logic:** `src/lib/html-form-generator.ts` is responsible for constructing the complete HTML structure of the form.
    -   **Dependencies & Coupling:**
        -   It incorporates client-side JavaScript generated by `src/lib/form-script-generator.ts` to handle interactivity, input validation, and data collection logic within the browser.
        -   It embeds CSS styles, potentially defined or generated by `src/lib/form-styles.ts`, to ensure the form is self-contained and visually consistent.
    -   **Output:** A complete, self-contained HTML file (or string) representing the interactive form. This form is designed to be easily shareable and usable standalone.

-   **Client-Side Data Collection:**
    -   **Mechanism:** The JavaScript generated by `src/lib/form-script-generator.ts` and embedded into the HTML form by `src/lib/html-form-generator.ts` handles this.
    -   **Process:** As the end-user fills out the interactive form in their browser, this script collects the responses.
    -   **Output:** The script structures the collected data into a JSON object, adhering to the schema initially generated by `parse-questionnaire.ts` and embedded within the form. This JSON is then available for submission or download.

-   **Investigator Dashboard (Client-Side):**
    -   **Main UI:** The `src/app/dashboard/page.tsx` serves as the entry point and primary interface for the investigator.
    -   **Data Input:** Investigators can upload the JSON data files (collected from the interactive forms) using UI elements likely built with `src/components/form-uploader.tsx` or similar components.
    -   **Data Display & Analysis:** The dashboard utilizes various reusable React components from `src/components/` (e.g., `src/components/results-summary.tsx` for displaying summaries) and generic UI elements from `src/components/ui/` (Shadcn/UI components) to present the collected data in a structured and analyzable format.
    -   **State Management:** Global state or context might be managed by `src/components/providers.tsx` to share data across dashboard components.

-   **Shareable Forms & Result Output:**
    -   **Form Sharing:** The self-contained HTML forms generated by `src/lib/html-form-generator.ts` can be directly downloaded and shared as files. They can also be hosted, and `src/lib/url-utils.ts` might be used to generate or manage shareable URLs pointing to these forms or their results.
    -   **Result Export:** The client-side script (from `src/lib/form-script-generator.ts`) within the form enables users to export their collected data as a JSON file.
    -   **Results Display Page:** The `src/app/results/page.tsx` could serve as a dedicated page for users to view or manage the results of a form they've filled, potentially using `src/lib/url-utils.ts` to handle result links.

-   **Server-Side AI Analysis (Optional):**
    -   **Trigger:** If a backend is deployed and configured, collected JSON data can be sent for further analysis.
    -   **Processing:** The `src/ai/flows/summarize-form-results.ts` flow (using Genkit) processes this data to provide summaries or insights.
    -   **Coupling:** This is an optional extension and would typically involve an API endpoint (not explicitly defined in the current structure but implied by Next.js capabilities) that `app/dashboard/page.tsx` or another service could call.

## 4. Development Principles

-   **Modularity:** The codebase is organized into distinct modules (`ai`, `app`, `components`, `hooks`, `lib`) to promote separation of concerns and maintainability.
-   **AI-First Approach:** AI capabilities are central to the application, with dedicated logic in the `src/ai` directory, utilizing the Genkit framework.
-   **Client-Centric Design:** Core functionalities like form interaction and the investigator dashboard are primarily client-side, ensuring a responsive user experience.
-   **Component-Based UI:** The UI is built using React and Next.js, with a library of reusable UI components found in `src/components/ui/`. This promotes consistency and development speed. (Likely using a framework like Shadcn/UI over Tailwind CSS).
-   **Type Safety:** The use of TypeScript (`.ts`, `.tsx` files) ensures type safety and improves code quality.
-   **Styling:** Global styles are managed in `src/app/globals.css`. Component-specific styles are likely co-located or managed via utility classes (Tailwind CSS). The style guidelines from `blueprint.md` should be adhered to.

## 5. Making Changes (Operation Guide)

This guide is intended to help you make common code modifications in the FormWise project.

-   **Modifying AI Questionnaire Parsing Logic:**
    -   **Edit File:** `src/ai/flows/parse-questionnaire.ts`
    -   **Focus:** Adjust prompts for interacting with the Gemini API, form schema generation logic, or Genkit framework integration.

-   **Adjusting HTML Form Generation:**
    -   **Edit File:** `src/lib/html-form-generator.ts`
    -   **Focus:** This file controls the HTML structure of the generated form, embedded styles (potentially from `src/lib/form-styles.ts`), and client-side JavaScript scripts (from `src/lib/form-script-generator.ts`).

-   **Updating Investigator Dashboard UI or Functionality (Refactoring and Performance Optimization):**
    -   **Main Page Component:** `src/app/dashboard/page.tsx`. Now acts as a coordinator, managing state and passing data/callbacks to child components.
    -   **Dashboard Components:** New components focused on specific functionalities have been added under the `src/components/dashboard/` directory, such as:
            -   `DashboardHeader.tsx`: Page header.
            -   `DashboardPlaceholder.tsx`: Placeholder when data is empty.
            -   `FormListSidebar.tsx`: Left sidebar for the form list.
            -   `SelectedFormCard.tsx`: Main information card for the selected form (including AI analysis).
            -   `AiAnalysisSection.tsx`: UI and logic related to AI analysis.
            -   `AggregatedResultCard.tsx`: Card displaying aggregated results for a single field.
            -   `RawSubmissionsTable.tsx`: Table displaying raw submission data.
            -   `DeleteConfirmationDialog.tsx`: Confirmation dialog for deletion.
    -   **Generic UI Base Components:** Shadcn/UI components under the `src/components/ui/` directory.
    -   **Type Definitions:** Dashboard-related types have been moved to `src/types/dashboard.ts`.
    -   **Performance Optimization:**
        -   Extensive use of `React.memo`, `useMemo`, and `useCallback` in various components to reduce unnecessary renders and function creations.
        -   Text input in `AiAnalysisSection` uses debouncing (`DebouncedTextarea`) to improve input smoothness.
        -   `RawSubmissionsTable` implements pagination for large datasets, rendering only the current page's data, and uses Memoization (`TableRowRenderer`) for table rows.
        -   AI analysis triggering uses `requestAnimationFrame` for optimized responsiveness.

-   **Changing Application Layout or Global Styles:**
    -   **Root Layout Component:** `src/app/layout.tsx`
    -   **Global Stylesheet:** `src/app/globals.css` (mainly contains Tailwind CSS base and custom styles).

-   **Adding New Reusable React Components:**
    -   **Business Components:** Create new `.tsx` files under the `src/components/` directory.
    -   **Generic UI Components:** If it's a generic UI element unrelated to specific business logic, create it under the `src/components/ui/` directory (following Shadcn/UI style).

-   **Adjusting Custom React Hooks:**
    -   **Edit Directory:** `src/hooks/` (e.g., `use-toast.ts`, `use-mobile.tsx`).

-   **Modifying Utility/Library Functions:**
    -   **Edit Directory:** `src/lib/` (e.g., `utils.ts`, `url-utils.ts`, `form-script-generator.ts`, `form-styles.ts`).

-   **Updating AI Result Summary (Server-Side):**
    -   **Edit File:** `src/ai/flows/summarize-form-results.ts`
    -   **Focus:** Modify the logic for interacting with the Genkit framework for server-side result analysis.

-   **Managing AI Configuration (Genkit):**
    -   **Edit File:** `src/ai/genkit.ts`
    -   **Focus:** Genkit AI framework initialization, model configuration, plugin integration, etc.

## 6. Key Technologies

-   **Frontend Framework:** Next.js (with React)
-   **Language:** TypeScript
-   **AI Integration:** Genkit (for interacting with Gemini API)
-   **Styling:** Tailwind CSS (inferred, via `globals.css` and `src/components/ui/` which often use utility classes from Shadcn/UI or similar libraries built on Tailwind).
-   **UI Components:** Likely Shadcn/UI or a similar component library built on Radix UI and Tailwind CSS, located in `src/components/ui/`.

This guide provides a starting point for understanding and developing the FormWise application. Refer to individual file comments and code for more detailed insights.