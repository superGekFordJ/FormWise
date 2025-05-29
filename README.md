# FormWise 📝

[中文版本](README_CN.md)

Ever wished you could magically turn those static questionnaires (you know, the PDFs or text files) into interactive, easy-to-use web forms? That's exactly what FormWise does! It's a smart tool that uses AI to understand your questionnaires and automatically create web forms from them. This means you can easily collect data, and even get some insights from it, all in one place. Say goodbye to manual data entry and hello to streamlined information gathering!

## ✨ What FormWise Can Do For You (Core Features)

-   **Magically Understands Your Questionnaires (Powered by Gemini API):** Just upload your questionnaire (PDF or text), and FormWise, with the help of Google's Gemini API, will read and understand it. It figures out the questions, what type of answers they need (like text, multiple choice, etc.), and creates a structured layout for your new web form.
-   **Creates Interactive Web Forms (HTML):** Based on the layout it creates, FormWise generates a ready-to-use HTML form that people can fill out directly in their web browser.
-   **Collects Data Right in the Browser:** The web forms are designed to gather responses and neatly organize them into a JSON file (a common format for data).
-   **A Dashboard for Investigators:** If you're collecting data, you can easily upload the JSON files to a built-in dashboard to view and do some basic analysis.
-   **Share Your Forms Easily:** You can download the HTML form files or, if you host FormWise on a server, share them with a link.
-   **Share and Export Results:** People filling out the form can easily share the completed page, and you get the option to export the collected data as a JSON file.
-   **AI-Powered Analysis on the Server (Coming Soon!):** We're planning to add a feature where, if you set up a backend, FormWise can send the data to a server and use AI to summarize and analyze the results for you.

*Right now, FormWise is mainly focused on doing its magic in your web browser (client-side). The server-side AI analysis is something we're working on for the future. We're also looking into using other AI models and making even fancier forms!*

## How FormWise Works & Your Data Privacy

Here's a simple breakdown of what happens when you use FormWise:

1.  **You Upload a Questionnaire:** You start by giving FormWise a questionnaire file (a `.txt` or `.pdf`).
2.  **AI Does Its Thing:** This file is then looked at by an AI (currently, we're mainly using the Gemini API). The AI is smart enough to pick out the questions, the types of questions (like multiple choice or fill-in-the-blank), and any options, and then it creates a structured layout for the form.
3.  **A Web Form is Born:** Using this layout, FormWise creates an HTML web form that works all by itself. This means it has all the smarts and styling built-in, so people can fill it out in their browser without needing any special software or a constant internet connection to a server.

**Let's Talk About Your Data Privacy:**

*   **When FormWise Reads Your Questionnaire:** The content of the questionnaire you upload is sent to the AI provider (like Google's Gemini API) so it can be understood. **It's important to know that how this AI provider uses your data is up to their own terms of service and privacy policy. So, please make sure you check those out before you start.** FormWise itself doesn't keep your original questionnaire files on its server (unless you decide to set up your own backend and add that feature).
*   **When People Fill Out the Form:** The information someone types into the web form is handled right there in their own web browser. Once they're done, the data is immediately put into a JSON format.
*   **What Happens to the Collected Data:** The person who filled out the form can decide what to do with the JSON data. Currently, the main way this works is they download the JSON file and send it to the person conducting the survey (that's probably you!). You can then upload these JSON files into the FormWise dashboard on your computer to see and analyze the data. This way, you have more control over the data, and it doesn't have to go through a central server.

**What's Next?**

We're planning to add an option to upload data to a server in future versions, which could make collecting and combining data even easier. We're also looking into handling more complex types of questionnaires and adding more AI-powered analysis and statistics to the investigator dashboard to give you even more powerful tools.

## 🛠️ The Tech Behind FormWise

-   **Frontend Framework:** Next.js (with React) - This is what we use to build the user interface you see and interact with.
-   **Language:** TypeScript - A version of JavaScript that helps us catch errors early and keep the code organized.
-   **AI Integration:** Genkit - This is an open-source toolkit from Google that helps us connect to and use the Gemini API for the AI magic.
-   **Styling:** Tailwind CSS - A utility-first CSS framework that helps us make FormWise look good without writing a lot of custom style rules.
-   **UI Components:** Shadcn/UI - A collection of pre-built interface elements that we use to create a consistent and modern look and feel.

## 📂 Project Structure

All the main code for FormWise lives in the `src` folder. Here's a quick peek at what's inside:

-   `src/ai/`: This is where the AI-related smarts are, including how FormWise talks to Genkit and the Gemini API.
-   `src/app/`: These are the pages you see in your web browser, like the main page and the dashboard.
-   `src/components/`: We build the interface using smaller, reusable pieces called components. You'll find them here.
-   `src/hooks/`: These are special functions that help us manage the state and logic of our React components.
-   `src/lib/`: A place for helpful utility functions and shared code.

If you want to dive deeper into how everything is organized, check out our [Development Guide (docs/development_guide.md)](docs/development_guide.md).

## 🚀 Getting Started

Ready to give FormWise a try? Here’s how to get it up and running:

1.  **Set Up Your API Key:**
    First, you'll need a Google Gemini API key. This is what lets FormWise use Google's AI to understand your questionnaires.
    - Copy the `.env.example` file in the main project folder and rename your copy to `.env`.
      ```bash
      cp .env.example .env
      ```
    - Open the `.env` file in a text editor.
    - Find the line that says `GOOGLE_API_KEY=` and add your API key right after the equals sign.
    You can get an API key from [Google AI Studio](https://aistudio.google.com/apikey). Make sure it's set up for the Gemini API.

2.  **Get the Code:**
    If you have git installed (a common tool for downloading code), open your terminal (like Command Prompt, PowerShell, or Terminal on Mac/Linux) and type:
    ```bash
    git clone https://github.com/google/FormWise.git # Or the specific URL if you have a fork
    cd FormWise
    ```
    If you don't have git, you can usually download the project as a ZIP file from its GitHub page. Just look for a "Code" button and then "Download ZIP". Unzip it and navigate into the main folder using your terminal.

3.  **Install the Necessary Bits and Bobs:**
    You'll need Node.js and npm (which comes with Node.js) installed on your computer. These are tools that help run and manage JavaScript projects like FormWise. If you don't have them, you can download them from the [official Node.js website](https://nodejs.org/).
    Once you have Node.js and npm, open your terminal in the `FormWise` project directory (the one you downloaded or cloned) and run:
    ```bash
    npm install
    ```
    This command reads a file called `package.json` and downloads all the other tools and libraries FormWise needs to work.
    (If you prefer using Yarn, another package manager, you can run `yarn install` instead, assuming you have Yarn installed.)

4.  **Start the App:**
    Once everything is installed, you can start the FormWise development server by running:
    ```bash
    npm run dev
    ```
    (Or `yarn dev` if you're using Yarn.)

    This command will usually open FormWise in your default web browser automatically. If not, it will show you a local web address in the terminal (something like `http://localhost:3000`). You can copy this address and paste it into your web browser's address bar to open FormWise.

And that's it! You should now have FormWise running locally on your computer.

## 🤝 Want to Help Out? (Contributing)

We think FormWise is pretty cool, but we know it can always be better! If you have ideas for new features, find any bugs, or want to improve something, we'd love for you to contribute.

We've put together a [Development Guide](docs/development_guide.md) that has more details on how to set up your development environment, our coding guidelines, and how to submit your changes. We're excited to see what you come up with!

## 📜 License

FormWise is shared with the world under the MIT License. This basically means you're free to use, copy, modify, and even sell your own versions of the software, as long as you include the original copyright and license notice in your copy.

You can find the full text of the license in the [LICENSE](LICENSE) file in this repository.
