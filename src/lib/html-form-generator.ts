import type { ParseQuestionnaireOutput } from '@/ai/flows/parse-questionnaire';
import { generateEmbeddedCSS } from './form-styles';
import { generateEmbeddedScript } from './form-script-generator';

export function generateInteractiveHtmlForm(formDefinition: ParseQuestionnaireOutput): string {
  const { formTitle, formDescription, fields, dataSchema } = formDefinition;
  const css = generateEmbeddedCSS();
  const script = generateEmbeddedScript({ formTitle, formDescription, fields, dataSchema });

  const fieldsHtml = fields.map(field => {
    let fieldInputHtml = '';
    const requiredStar = field.required ? '<span class="required-star">*</span>' : '';
    const commonAttrs = `id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} data-original-required="${field.required}"`;
    const fieldContainerClass = `form-field ${field.required ? 'needs-input' : ''}`;
    const isOtherSpecifyField = field.id.endsWith('_other_specify'); // Convention for "other specify" fields

    switch (field.type.toLowerCase()) {
      case 'text':
      case 'date':
        fieldInputHtml = `<input type="${field.type.toLowerCase()}" ${commonAttrs} placeholder="${field.type === 'text' ? 'Please enter here...' : ''}">`;
        break;
      case 'number':
        fieldInputHtml = `<input type="number" ${commonAttrs} placeholder="Please enter a number...">`;
        break;
      case 'textarea':
        fieldInputHtml = `<textarea ${commonAttrs} placeholder="Please enter here..." rows="3"></textarea>`;
        break;
      case 'radio':
        fieldInputHtml = '<div class="radio-group">';
        field.options?.forEach((option) => {
          const optionId = `${field.id}_${option.replace(/\s+/g, '_')}`; // Ensure valid ID
          const isOtherOption = option.toLowerCase().startsWith('other') || option.toLowerCase().startsWith('其他');
          const dataAttributes = isOtherOption ? `data-controls-specify="${field.id}_other_specify"` : '';
          fieldInputHtml += `
            <div>
              <input type="radio" id="${optionId}" name="${field.id}" value="${option}" ${field.required ? 'required' : ''} ${dataAttributes} aria-label="${option}">
              <label for="${optionId}">${option}</label>
            </div>
          `;
        });
        fieldInputHtml += '</div>';
        break;
      case 'checkbox':
        if (field.options && field.options.length > 0) { // Checkbox group
          fieldInputHtml = '<div class="checkbox-group">';
          field.options.forEach((option) => {
            const optionId = `${field.id}_${option.replace(/\s+/g, '_')}`; // Ensure valid ID
            const isOtherOption = option.toLowerCase().startsWith('other') || option.toLowerCase().startsWith('其他');
            const dataAttributes = isOtherOption ? `data-controls-specify="${field.id}_other_specify"` : '';
            fieldInputHtml += `
              <div>
                <input type="checkbox" id="${optionId}" name="${field.id}" value="${option}" ${dataAttributes} aria-label="${option}">
                <label for="${optionId}">${option}</label>
              </div>
            `;
          });
          fieldInputHtml += '</div>';
        } else { // Single checkbox
          fieldInputHtml = `
            <div class="single-checkbox">
              <input type="checkbox" ${commonAttrs} aria-label="${field.label}">
              <label for="${field.id}">${field.label}</label>
            </div>
          `;
        }
        break;
      case 'select':
        fieldInputHtml = `<select ${commonAttrs}>`;
        if (!field.required) {
          fieldInputHtml += `<option value="">Select an option</option>`;
        }
        field.options?.forEach(option => {
          fieldInputHtml += `<option value="${option}">${option}</option>`;
        });
        fieldInputHtml += `</select>`;
        break;
      default:
        fieldInputHtml = `<input type="text" ${commonAttrs}>`;
    }
    
    const initialContainerClass = isOtherSpecifyField ? `${fieldContainerClass} hidden` : fieldContainerClass;

    return `
      <div class="${initialContainerClass}" id="field-container-${field.id}">
        <label for="${field.id}">${field.label}${requiredStar}</label>
        ${fieldInputHtml}
        <div class="error-message" id="error-${field.id}"></div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formTitle}</title>
      <style>${css}</style>
    </head>
    <body>
      <header class="form-header-banner">
        <div class="form-logo">FormWise</div>
      </header>
      <div class="form-container">
        <div class="progress-indicator" id="progress-indicator" data-step="1">Step 1 of 3: Fill Form</div>
        <div id="form-section">
          <div class="form-header">
            <h1>${formTitle}</h1>
            <p>${formDescription}</p>
          </div>
          <form id="interactive-form">
            ${fieldsHtml}
            <button type="submit" class="submit-button">Review Answers</button>
          </form>
        </div>

        <div id="review-section" style="display: none;">
          <h2>Review Your Answers</h2>
          <div id="review-content"></div>
          <div class="action-buttons">
            <button id="edit-button">Edit Answers</button>
            <button id="confirm-submit-button" class="primary-action">Confirm & Get Data</button>
          </div>
        </div>
        
        <div id="completion-section" style="display: none;">
          <h2>Submission Complete!</h2>
          <p>Thank you for completing the form: <strong>${formTitle}</strong>.</p>
          <h3>Your Responses:</h3>
          <div id="final-data-display" style="white-space: pre-wrap; background-color: hsl(var(--muted-hsl)); padding: 1rem; border-radius: var(--radius); max-height: 300px; overflow-y: auto;"></div>
          <div class="action-buttons">
            <button id="download-json-button"><svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>Download Data (JSON)</button>
            <button id="download-html-button"><svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 3.5a1.5 1.5 0 011.405 1.016l.13.392A3.004 3.004 0 0113 5c.467 0 .917.107 1.318.302l.395.198A1.5 1.5 0 0116.5 7H18a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H2a.5.5 0 01-.5-.5v-10A.5.5 0 012 7h1.5a1.5 1.5 0 011.787-1.484l.395-.198A3.004 3.004 0 017 5c.467 0 .917.107 1.318.302l.13-.392A1.5 1.5 0 0110 3.5zM7.05 6.33A1.5 1.5 0 006 7.5v.053L7.05 6.33zM13 7.5a1.5 1.5 0 00-1.05-1.417L13 7.552V7.5zm2 6.5a.5.5 0 000-1H5a.5.5 0 000 1h10zm-2.5-2a.5.5 0 000-1h-5a.5.5 0 000 1h5zM11 9.5a.5.5 0 000-1H9a.5.5 0 000 1h2z"></path></svg>Download Form (HTML)</button>
            <button id="share-form-button"><svg class="icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.263 5.923 2.5 2.5 0 01-3.318-3.731L8.464 3.17A4 4 0 007 2.64V2.5A2.5 2.5 0 019.5 0h1A2.5 2.5 0 0113 2.5v.14a4.002 4.002 0 00-.768 1.592z"></path><path d="M7.768 15.768a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.06-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.263-5.923 2.5 2.5 0 013.318 3.731L11.536 16.83A4 4 0 0013 17.36v.14A2.5 2.5 0 0110.5 20h-1A2.5 2.5 0 017 17.5v-.14c.24-.07.474-.16.701-.274.023-.011.047-.022.067-.033l.001-.001z"></path></svg>Share Form Link</button>
          </div>
        </div>

      </div>

      <script>
        ${script}
      </script>
    </body>
    </html>
  `;
}

