# FormWise

[中文版本](README_CN.md)

FormWise is an application designed to transform questionnaires (in PDF or text format) into interactive HTML forms. It leverages AI for parsing and schema generation, facilitates client-side data collection, and provides an investigator dashboard for data viewing and analysis. Optionally, it can perform server-side AI analysis of collected results.

## ✨ Core Features

-   **Questionnaire Parsing & Schema Generation (Powered by Gemini API):** The application receives questionnaire files uploaded by the user (PDF or text format) and performs in-depth analysis by calling Google's Gemini API. AI intelligently identifies questions, question types, and possible options from the questionnaire content and automatically generates a structured data schema. This schema defines the questions, types, and options for the form and serves as the basis for generating the subsequent interactive HTML form.
-   **Interactive Form Generation (HTML):** Generates self-contained, interactive HTML forms based on the parsed questionnaire and the defined data schema.
-   **Client-Side Data Collection:** The generated HTML forms handle collecting user responses and structuring them into a JSON object.
-   **Investigator Dashboard (Client-Side):** Allows investigators to upload collected JSON data files for viewing and basic analysis.
-   **Shareable Forms:** Generates downloadable HTML files or shareable URLs (when hosted) for distributing the form.
-   **Result Sharing and Output:** Users can easily share the completed form page and provide an option to output the collected data as a JSON file.
-   **Server-Side AI Analysis (Planned):** When a backend is deployed, it supports server-side data submission and leverages AI to summarize and analyze collected results.

*The current implementation primarily focuses on client-side functionality. Server-side AI analysis is an optional feature and is planned for further improvement in the future. The project also plans to explore integrating more AI model APIs and supporting the generation of more complex form styles.*

## Core Workflow and Data Privacy

The core process of FormWise begins when a user uploads a questionnaire file in `.txt` or `.pdf` format. These files are processed by a configured LLM (currently primarily using the Gemini API). The AI intelligently identifies questions, question types, and options from the questionnaire and generates a structured data schema.

Based on the generated data schema, the application generates self-contained, interactive HTML questionnaire files on the client side. These HTML files include all the necessary logic and styling for filling out the questionnaire and can run and be distributed independently of a server, allowing respondents to complete the questionnaire in their local browser.

**Regarding Data Privacy:**

*   **Questionnaire Parsing Stage:** The uploaded questionnaire content is sent to the configured AI provider (such as Google Gemini API) for processing. **Please note that how the AI provider uses or processes the data you submit is subject to that provider's terms of service and privacy policy. Before use, please be sure to review and understand the terms of service of the AI model you are using.** FormWise itself does not store your raw questionnaire files on the server side (unless you deploy your own backend and implement related features).
*   **Data Collection Stage:** The data entered by the respondent into the generated HTML questionnaire is processed entirely on the client side (in the respondent's browser). Upon completion, the filled data is immediately structured into JSON format.
*   **Data Processing and Distribution:** The respondent can freely decide how to handle the generated JSON data. The current version primarily supports the respondent downloading the JSON file and then sending it to the investigator. Investigators can import these JSON files into the FormWise client-side dashboard for viewing and statistical analysis. This approach emphasizes data sovereignty and privacy, as data transfer is manually controlled by the user and does not necessarily go through a centralized server.

**Future Plans:**

We plan to implement optional server-side data upload functionality in future versions for more convenient collection and aggregation of submitted data. Simultaneously, we will explore supporting more complex questionnaire parsing rules and may integrate more LLM-driven analysis and statistical features into the investigator dashboard to provide more powerful data processing capabilities.

## 🛠️ Technology Stack

-   **Frontend Framework:** Next.js (with React)
-   **Language:** TypeScript
-   **AI Integration:** Genkit (This is an open-source AI framework that we use to orchestrate interactions with the Google Gemini API, including questionnaire parsing and optional server-side result analysis.)
-   **Styling:** Tailwind CSS
-   **UI Components:** Shadcn/UI (or similar component libraries based on Radix UI and Tailwind CSS)

## 📂 Project Structure

All core source code is located in the `src` directory, mainly comprising the following parts:

-   `src/ai/`: AI-related logic, flows, and configurations.
-   `src/app/`: Next.js application pages and core layout.
-   `src/components/`: Reusable React components, including UI library components (`ui/`).
-   `src/hooks/`: Custom React hooks.
-   `src/lib/`: Library/utility functions.

For a detailed project structure and file descriptions, please refer to the [Development Guide (docs/development_guide.md)](docs/development_guide.md).

## 🚀 Getting Started

1.  **Configure Environment Variables:**
    Copy the `.env.example` file to the project root directory and rename it to `.env`.
    ```bash
    cp .env.example .env
    ```
    Then edit the `.env` file and replace `GOOGLE_API_KEY` with your Google Gemini API key.
    You can obtain an API key from [Google AI Studio](https://aistudio.google.com/apikey).

2.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd FormWise
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
4.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
