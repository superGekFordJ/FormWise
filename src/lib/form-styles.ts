import type { ParseQuestionnaireOutput } from '@/ai/flows/parse-questionnaire';

function getThemeColors() {
  // These HSL values should correspond to the :root variables in globals.css
  // For simplicity, they are hardcoded here. In a more complex setup,
  // they could be dynamically read or built.
  return {
    light: {
      background: "220 14% 96%",
      foreground: "220 25% 15%",
      card: "0 0% 100%",
      primary: "127 35% 73%", // Light Green
      primaryForeground: "127 30% 25%",
      secondary: "220 14% 93%", // Soft Gray
      secondaryForeground: "220 20% 30%",
      muted: "220 10% 90%",
      mutedForeground: "220 20% 45%",
      accent: "174 63% 37%", // Teal
      accentForeground: "174 100% 96%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "220 10% 88%",
      input: "220 10% 88%",
      ring: "127 35% 65%",
    },
    dark: {
      background: "220 25% 10%",
      foreground: "220 15% 90%",
      card: "220 25% 12%",
      primary: "127 40% 65%", // Light Green (dark theme)
      primaryForeground: "127 25% 15%",
      secondary: "220 15% 20%", // Darker Soft Gray
      secondaryForeground: "220 10% 80%",
      muted: "220 15% 25%",
      mutedForeground: "220 10% 60%",
      accent: "174 60% 45%", // Teal (dark theme)
      accentForeground: "174 100% 97%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 98%",
      border: "220 15% 30%",
      input: "220 15% 30%",
      ring: "127 40% 55%",
    }
  };
}

export function generateEmbeddedCSS(): string {
  const theme = getThemeColors();
  // A basic set of styles inspired by ShadCN and the FormWise guidelines
  return `
    :root {
      --background-hsl: ${theme.light.background};
      --foreground-hsl: ${theme.light.foreground};
      --card-hsl: ${theme.light.card};
      --card-foreground-hsl: ${theme.light.foreground};
      --primary-hsl: ${theme.light.primary};
      --primary-foreground-hsl: ${theme.light.primaryForeground};
      --secondary-hsl: ${theme.light.secondary};
      --secondary-foreground-hsl: ${theme.light.secondaryForeground};
      --muted-hsl: ${theme.light.muted};
      --muted-foreground-hsl: ${theme.light.mutedForeground};
      --accent-hsl: ${theme.light.accent};
      --accent-foreground-hsl: ${theme.light.accentForeground};
      --destructive-hsl: ${theme.light.destructive};
      --destructive-foreground-hsl: ${theme.light.destructiveForeground};
      --border-hsl: ${theme.light.border};
      --input-hsl: ${theme.light.input};
      --ring-hsl: ${theme.light.ring};
      --radius: 0.5rem;
    }
    .dark {
      --background-hsl: ${theme.dark.background};
      --foreground-hsl: ${theme.dark.foreground};
      --card-hsl: ${theme.dark.card};
      --card-foreground-hsl: ${theme.dark.foreground};
      --primary-hsl: ${theme.dark.primary};
      --primary-foreground-hsl: ${theme.dark.primaryForeground};
      --secondary-hsl: ${theme.dark.secondary};
      --secondary-foreground-hsl: ${theme.dark.secondaryForeground};
      --muted-hsl: ${theme.dark.muted};
      --muted-foreground-hsl: ${theme.dark.mutedForeground};
      --accent-hsl: ${theme.dark.accent};
      --accent-foreground-hsl: ${theme.dark.accentForeground};
      --destructive-hsl: ${theme.dark.destructive};
      --destructive-foreground-hsl: ${theme.dark.destructiveForeground};
      --border-hsl: ${theme.dark.border};
      --input-hsl: ${theme.dark.input};
      --ring-hsl: ${theme.dark.ring};
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      background-color: hsl(var(--background-hsl));
      color: hsl(var(--foreground-hsl));
      margin: 0;
      padding: 0;
      line-height: 1.6;
      font-size: 16px;
    }
    .form-header-banner {
      background-color: hsl(var(--accent-hsl));
      color: hsl(var(--accent-foreground-hsl));
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .form-logo {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0 auto;
    }
    .form-controls {
      position: absolute;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .zoom-control {
      padding: 0.25rem 0.5rem;
      background-color: hsla(var(--background-hsl), 0.2);
      border-radius: var(--radius);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: hsl(var(--accent-foreground-hsl));
    }
    .zoom-control button {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      padding: 0.1rem 0.3rem;
      border-radius: 0.2rem;
    }
    .zoom-control button:hover {
      background-color: hsla(var(--background-hsl), 0.3);
    }
    .reset-button {
      background-color: hsla(var(--background-hsl), 0.2);
      border: none;
      color: hsl(var(--accent-foreground-hsl));
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius);
      cursor: pointer;
      font-size: 0.9rem;
    }
    .reset-button:hover {
      background-color: hsla(var(--background-hsl), 0.3);
    }
    .form-container {
      max-width: 800px;
      margin: 2rem auto;
      background-color: hsl(var(--card-hsl));
      color: hsl(var(--card-foreground-hsl));
      padding: 2rem;
      border-radius: calc(var(--radius) - 2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border: 1px solid hsl(var(--border-hsl) / 0.8);
    }
    .progress-indicator {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 0.95rem;
      color: hsl(var(--muted-foreground-hsl));
      padding-bottom: 1.25rem;
      border-bottom: 1px solid hsl(var(--border-hsl) / 0.6);
      position: relative;
    }
    .progress-indicator::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 33.33%;
      height: 3px;
      background-color: hsl(var(--accent-hsl));
      border-radius: 3px 3px 0 0;
      transition: width 0.3s ease;
    }
    .progress-indicator[data-step="2"]::after {
      width: 66.66%;
    }
    .progress-indicator[data-step="3"]::after {
      width: 100%;
    }
    .progress-indicator span {
      font-weight: 600;
      color: hsl(var(--accent-hsl));
    }
    .form-header h1 {
      color: hsl(var(--primary-foreground-hsl));
      font-size: 2.2em;
      margin-bottom: 0.75em;
      text-align: center;
    }
    .form-header p {
      color: hsl(var(--muted-foreground-hsl));
      margin-bottom: 2em;
      text-align: center;
      max-width: 80%;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.5;
    }
    .form-field {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      border: 1px solid hsl(var(--border-hsl));
      border-radius: calc(var(--radius) - 2px);
      background-color: hsl(var(--card-hsl)); 
      transition: all 0.2s ease;
      position: relative;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .form-field:hover {
      border-color: hsl(var(--input-hsl));
    }
    .form-field.needs-input {
      border-left: 3px solid hsl(var(--accent-hsl));
    }
    .form-field.needs-input input, 
    .form-field.needs-input textarea,
    .form-field.needs-input select {
      border-color: hsl(var(--accent-hsl) / 0.6);
    }
    .form-field label {
      display: block;
      font-weight: 600;
      margin-bottom: 1rem;
      color: hsl(var(--foreground-hsl));
      font-size: 1rem;
    }
    .form-field input[type="text"],
    .form-field input[type="number"],
    .form-field input[type="date"],
    .form-field textarea,
    .form-field select {
      width: 100%;
      padding: 0.85rem;
      border: 1px solid hsl(var(--input-hsl));
      border-radius: 20px;
      box-sizing: border-box;
      background-color: hsl(var(--card-hsl));
      color: hsl(var(--foreground-hsl));
      font-size: 1rem;
      transition: all 0.2s ease;
    }
    .form-field input::placeholder,
    .form-field textarea::placeholder {
      color: hsl(var(--muted-foreground-hsl) / 0.6);
      opacity: 1;
      transition: opacity 0.2s ease;
    }
    
    .form-field input:focus::placeholder,
    .form-field textarea:focus::placeholder {
      opacity: 0.5;
    }
    .form-field input:focus, 
    .form-field textarea:focus, 
    .form-field select:focus {
      outline: none;
      border-color: hsl(var(--accent-hsl));
      box-shadow: 0 0 0 2px hsl(var(--accent-hsl) / 0.1);
    }
    .form-field .radio-group div, 
    .form-field .checkbox-group div {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 20px;
      transition: background-color 0.15s ease;
    }
    .form-field .radio-group div:hover, 
    .form-field .checkbox-group div:hover {
      background-color: hsl(var(--secondary-hsl));
    }
    .form-field input[type="radio"], 
    .form-field input[type="checkbox"] {
      margin-right: 0.75rem;
      width: 1.2rem;
      height: 1.2rem;
      accent-color: hsl(var(--accent-hsl));
      cursor: pointer;
    }
    .form-field input[type="radio"]:checked + label,
    .form-field input[type="checkbox"]:checked + label {
      color: hsl(var(--accent-hsl));
      font-weight: 500;
    }
    .form-field .radio-group label,
    .form-field .checkbox-group label {
      margin-bottom: 0;
      font-weight: normal;
      cursor: pointer;
      flex: 1;
    }
    .form-field .required-star {
      color: hsl(var(--destructive-hsl));
      margin-left: 0.25rem;
      font-size: 1.2em;
      line-height: 0;
      position: relative;
      top: 2px;
    }
    .error-message {
      color: hsl(var(--destructive-hsl));
      font-size: 0.75rem;
      margin-top: 0.35rem;
      font-weight: 500;
      display: none;
      align-items: center;
      position: absolute;
      left: 1.5rem;
      bottom: 0.35rem;
    }
    .error-message:not(:empty) {
      display: flex;
    }
    .error-message::before {
      content: "";
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      background-color: hsl(var(--destructive-hsl));
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='12'/%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'/%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='12'/%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'/%3E%3C/svg%3E");
      mask-size: cover;
      -webkit-mask-size: cover;
      margin-right: 0.35rem;
    }
    .submit-button {
      background-color: hsl(var(--accent-hsl));
      color: hsl(var(--accent-foreground-hsl));
      padding: 0.9rem 1.5rem;
      border: none;
      border-radius: var(--radius);
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.2s ease;
      display: block;
      width: 100%;
      margin-top: 1.5rem;
      position: relative;
      overflow: hidden;
    }
    .submit-button::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 5px;
      height: 5px;
      background: rgba(255, 255, 255, 0.5);
      opacity: 0;
      border-radius: 100%;
      transform: scale(1, 1) translate(-50%);
      transform-origin: 50% 50%;
    }
    .submit-button:hover {
      background-color: hsl(var(--accent-hsl) / 0.9);
      box-shadow: 0 4px 10px hsl(var(--accent-hsl) / 0.25);
      transform: translateY(-1px);
    }
    .submit-button:active::after {
      animation: ripple 0.6s ease-out;
    }
    @keyframes ripple {
      0% {
        transform: scale(0, 0);
        opacity: 0.5;
      }
      100% {
        transform: scale(30, 30);
        opacity: 0;
      }
    }
    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    #review-section { 
      margin-top: 2rem; 
      padding-top: 1.5rem; 
      border-top: 1px solid hsl(var(--border-hsl)); 
    }
    #review-section h2 { 
      color: hsl(var(--primary-foreground-hsl)); 
      text-align: center;
      margin-bottom: 1.5rem;
    }
    #review-section .answer-item { 
      margin-bottom: 1.25rem; 
      padding: 1rem 1.25rem; 
      border: 1px solid hsl(var(--muted-hsl));
      background-color: hsl(var(--card-hsl));
      border-radius: var(--radius);
    }
    #review-section .answer-item:last-child { 
      margin-bottom: 1.5rem; 
    }
    #review-section .answer-label { 
      font-weight: 600; 
      color: hsl(var(--accent-hsl));
      display: block;
      margin-bottom: 0.25rem;
    }
    #review-section .answer-value { 
      color: hsl(var(--foreground-hsl)); 
      display: block;
      word-break: break-word;
    }
    .action-buttons { 
      margin-top: 2rem; 
      display: flex; 
      gap: 1rem; 
      justify-content: space-between; 
      flex-wrap: wrap; 
    }
    .action-buttons button {
      background-color: hsl(var(--secondary-hsl));
      color: hsl(var(--secondary-foreground-hsl));
      padding: 0.75rem 1.25rem;
      border: 1px solid hsl(var(--border-hsl));
      border-radius: var(--radius);
      font-weight: 600;
      transition: all 0.2s ease;
      flex: 1;
      min-width: 200px;
    }
    .action-buttons button:hover {
      background-color: hsl(var(--secondary-hsl) / 0.8);
      border-color: hsl(var(--secondary-foreground-hsl) / 0.2);
    }
    .action-buttons button.primary-action {
      background-color: hsl(var(--accent-hsl));
      color: hsl(var(--accent-foreground-hsl));
      border: none;
    }
    .action-buttons button.primary-action:hover {
      background-color: hsl(var(--accent-hsl) / 0.9);
      box-shadow: 0 4px 10px hsl(var(--accent-hsl) / 0.25);;
      transform: translateY(-1px);
    }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
    .hidden { display: none !important; } /* Important to override other display styles */

    /* Minimalistic icons using SVG */
    .icon { 
      display: inline-block; 
      width: 1.1em; 
      height: 1.1em; 
      margin-right: 0.5em; 
      vertical-align: -0.2em; 
      fill: currentColor; 
    }

    @media (prefers-color-scheme: dark) {
      body { background-color: hsl(var(--background-hsl)); color: hsl(var(--foreground-hsl)); }
      .form-container { background-color: hsl(var(--card-hsl)); color: hsl(var(--card-foreground-hsl)); border-color: hsl(var(--border-hsl));}
      .progress-indicator { color: hsl(var(--muted-foreground-hsl)); border-bottom-color: hsl(var(--border-hsl)); }
      .progress-indicator span { color: hsl(var(--accent-hsl)); }
      .form-header h1 { color: hsl(var(--primary-hsl)); }
      .form-header p { color: hsl(var(--muted-foreground-hsl)); }
      .form-field { background-color: hsl(var(--background-hsl)); border-color: hsl(var(--border-hsl)); };
      .form-field:hover { border-color: hsl(var(--input-hsl)); }
      .form-field.needs-input input, 
      .form-field.needs-input textarea,
      .form-field.needs-input select {
        border-color: hsl(var(--accent-hsl) / 0.6);
      }
      .form-field label { color: hsl(var(--foreground-hsl)); }
      .form-field input[type="text"],
      .form-field input[type="number"],
      .form-field input[type="date"],
      .form-field textarea,
      .form-field select {
        border-color: hsl(var(--input-hsl));
        background-color: hsl(var(--card-hsl));
        color: hsl(var(--foreground-hsl));
      }
      .form-field input:focus, .form-field textarea:focus, .form-field select:focus {
        border-color: hsl(var(--accent-hsl));
        box-shadow: 0 0 0 3px hsl(var(--accent-hsl) / 0.15);
      }
      .form-field .radio-group div:hover, 
      .form-field .checkbox-group div:hover {
        background-color: hsl(var(--secondary-hsl));
      }
      #review-section h2 { color: hsl(var(--primary-hsl)); }
      #review-section .answer-item { 
        border-color: hsl(var(--muted-hsl));
        background-color: hsl(var(--card-hsl)); 
      }
      #review-section .answer-label { color: hsl(var(--accent-hsl)); }
      #review-section .answer-value { color: hsl(var(--foreground-hsl)); }
    }

    /* Mobile responsive styles */
    @media (max-width: 640px) {
      body {
        padding: 0;
      }
      .form-header-banner {
        padding: 0.75rem 1rem;
      }
      .form-container {
        padding: 1.5rem;
        margin: 1rem auto;
        border-radius: 0;
        box-shadow: none;
        border-left: none;
        border-right: none;
      }
      .form-header h1 {
        font-size: 1.8em;
      }
      .form-header p {
        max-width: 100%;
      }
      .form-field {
        padding: 1rem;
        margin-bottom: 1.5rem;
      }
      .action-buttons {
        flex-direction: column;
      }
      .action-buttons button {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }

    .form-field .single-checkbox {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border-radius: calc(var(--radius) - 4px);
      transition: background-color 0.15s ease;
    }
    .form-field .single-checkbox:hover {
      background-color: hsl(var(--secondary-hsl));
    }
    .form-field .single-checkbox input[type="checkbox"] {
      margin-right: 0.75rem;
      width: 1.2rem;
      height: 1.2rem;
      accent-color: hsl(var(--accent-hsl));
      cursor: pointer;
    }
    .form-field .single-checkbox label {
      margin-bottom: 0;
      font-weight: normal;
      cursor: pointer;
      flex: 1;
    }
  `;
} 