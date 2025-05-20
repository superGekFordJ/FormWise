import {DataSchema} from '@/ai/flows/parse-questionnaire';

export interface FormScriptOptions {
    formTitle: string;
    formDescription?: string;
    dataSchema: DataSchema;
    fields: any[]; // Replace 'any' with the actual field type if available
  }
  
  export function generateEmbeddedScript({ formTitle, formDescription, fields, dataSchema }: FormScriptOptions): string {
    // The JavaScript code to be embedded in the HTML
    return `
      const formSchema = ${JSON.stringify(fields)};
      const dataSchemaForDashboard = ${JSON.stringify(dataSchema)};
      let currentFormData = {};
  
      const formElement = document.getElementById('interactive-form');
      const formSection = document.getElementById('form-section');
      const reviewSection = document.getElementById('review-section');
      const reviewContent = document.getElementById('review-content');
      const completionSection = document.getElementById('completion-section');
      const finalDataDisplay = document.getElementById('final-data-display');
      const progressIndicator = document.getElementById('progress-indicator');
  
      const editButton = document.getElementById('edit-button');
      const confirmSubmitButton = document.getElementById('confirm-submit-button');
      const downloadJsonButton = document.getElementById('download-json-button');
      const downloadHtmlButton = document.getElementById('download-html-button');
      const shareFormButton = document.getElementById('share-form-button');
  
      function updateProgress(step, totalSteps, name) {
        if (progressIndicator) {
          progressIndicator.innerHTML = \`Step \${step} of \${totalSteps}: <span>\${name}</span>\`;
          progressIndicator.setAttribute('data-step', step.toString());
        }
      }
  
      function validateField(field, value, elements) {
        const errorElement = document.getElementById('error-' + field.id);
        const inputElement = elements[field.id]; // This can be an HTMLInputElement or RadioNodeList
        const fieldContainer = document.getElementById('field-container-' + field.id);
  
        // Clear previous error
        errorElement.textContent = ''; 
        let isFieldValid = true;
        let isActuallyRequired = field.required;
  
        // For "other_specify" fields, only mark as required if its controlling "Other" option is checked
        if (field.id.endsWith('_other_specify')) {
          const mainFieldId = field.id.replace('_other_specify', '');
          const mainFieldElements = elements[mainFieldId]; // RadioNodeList or NodeList for checkboxes
          let otherOptionChecked = false;
          if (mainFieldElements) {
              if (mainFieldElements.nodeName === 'INPUT' && mainFieldElements.type === 'checkbox') { // Single checkbox controlling this (less common)
                   if (mainFieldElements.checked && mainFieldElements.dataset.controlsSpecify === field.id) otherOptionChecked = true;
              } else if (mainFieldElements.length) { // RadioNodeList or collection of checkboxes
                  Array.from(mainFieldElements).forEach(el => {
                      if (el.checked && el.dataset.controlsSpecify === field.id) {
                          otherOptionChecked = true;
                      }
                  });
              } else if (mainFieldElements.id && elements[mainFieldElements.id] && elements[mainFieldElements.id].checked && elements[mainFieldElements.id].dataset.controlsSpecify === field.id) {
                  // Fallback for single checkbox if not directly in elements[mainFieldId]
                   otherOptionChecked = true;
              }
          }
          isActuallyRequired = otherOptionChecked; // Only required if "Other" is checked
        }
  
        if (isActuallyRequired) {
          if (field.type.toLowerCase() === 'checkbox' && field.options && field.options.length > 0) { // Checkbox group
             const groupChecked = Object.values(value).some(v => v === true);
             if (!groupChecked) {
               errorElement.textContent = field.label + ' requires at least one selection.';
               isFieldValid = false;
             }
          } else if (field.type.toLowerCase() === 'radio' && (value === null || value === undefined || String(value).trim() === '')) {
            errorElement.textContent = field.label + ' is required.';
            isFieldValid = false;
          } else if (typeof value === 'boolean' && !value) { // Single checkbox
            errorElement.textContent = field.label + ' is required.';
            isFieldValid = false;
          } else if (typeof value !== 'boolean' && (value === null || value === undefined || String(value).trim() === '')) {
            errorElement.textContent = field.label + ' is required.';
            isFieldValid = false;
          }
        }
  
        // Update visual cue for required fields
        const originalRequired = inputElement && inputElement.dataset && inputElement.dataset.originalRequired === 'true';
        if (originalRequired || isActuallyRequired) { // Check original or dynamically required
          if (isFieldValid) {
              fieldContainer?.classList.remove('needs-input');
          } else {
              fieldContainer?.classList.add('needs-input');
          }
        }
  
        return isFieldValid;
      }
  
      function collectFormData() {
        const data = {};
        const elements = formElement.elements;
        formSchema.forEach(field => {
          const fieldElement = elements[field.id];
          let value;
  
          // Skip hidden "other_specify" fields
          const fieldContainer = document.getElementById('field-container-' + field.id);
          if (fieldContainer && fieldContainer.classList.contains('hidden')) {
              data[field.id] = ''; // Store empty or skip
              return;
          }
  
          if (field.type.toLowerCase() === 'checkbox') {
            if (field.options && field.options.length > 0) {
              value = {};
              field.options.forEach(option => {
                const optionId = field.id + '_' + option.replace(/\\s+/g, '_');
                const checkboxElement = document.getElementById(optionId);
                if (checkboxElement) {
                   value[option] = checkboxElement.checked;
                }
              });
            } else {
              value = fieldElement ? fieldElement.checked : false;
            }
          } else if (field.type.toLowerCase() === 'radio') {
            const radioGroup = elements[field.id];
            value = radioGroup ? radioGroup.value : null;
            if (value === undefined || value === "") value = null;
          } else {
            value = fieldElement ? fieldElement.value : null;
          }
          data[field.id] = value;
        });
        return data;
      }
  
      function validateForm() {
        let allValid = true;
        const elements = formElement.elements;
        formSchema.forEach(field => {
           // Skip validation for hidden "other_specify" fields
          const fieldContainer = document.getElementById('field-container-' + field.id);
          if (fieldContainer && fieldContainer.classList.contains('hidden')) {
              document.getElementById('error-' + field.id).textContent = ''; // Clear error just in case
              fieldContainer.classList.remove('needs-input'); // Remove visual cue
              return;
          }
  
          const fieldElement = elements[field.id];
          let value;
          if (field.type.toLowerCase() === 'checkbox' && field.options && field.options.length > 0) {
             value = {};
              field.options.forEach(option => {
                const optionId = field.id + '_' + option.replace(/\\s+/g, '_');
                const checkboxElement = document.getElementById(optionId);
                if (checkboxElement) {
                   value[option] = checkboxElement.checked;
                }
              });
          } else if (field.type.toLowerCase() === 'radio') {
             const radioGroup = elements[field.id];
             value = radioGroup ? radioGroup.value : null;
          } else {
             value = fieldElement ? fieldElement.value : null;
          }
          if (!validateField(field, value, elements)) {
            allValid = false;
          }
        });
        return allValid;
      }
  
      function displayReview() {
        reviewContent.innerHTML = '';
        formSchema.forEach(field => {
           // Skip review for hidden "other_specify" fields
          const fieldContainer = document.getElementById('field-container-' + field.id);
          if (fieldContainer && fieldContainer.classList.contains('hidden')) {
              return;
          }
  
          const answer = currentFormData[field.id];
          let displayAnswer = answer;
          if (typeof answer === 'boolean') {
            displayAnswer = answer ? 'Yes' : 'No';
          } else if (field.type.toLowerCase() === 'checkbox' && field.options && field.options.length > 0 && typeof answer === 'object' && answer !== null) {
            displayAnswer = Object.entries(answer)
              .filter(([opt, checked]) => checked)
              .map(([opt, checked]) => opt)
              .join(', ') || '(No option selected)';
          } else if (answer === null || answer === undefined || String(answer).trim() === '') {
            displayAnswer = '(Not answered)';
          }
          reviewContent.innerHTML += \`
            <div class="answer-item">
              <span class="answer-label">\${field.label}:</span>
              <span class="answer-value">\${String(displayAnswer)}</span>
            </div>
          \`;
        });
        formSection.style.display = 'none';
        completionSection.style.display = 'none';
        reviewSection.style.display = 'block';
      }
  
      function handleDownloadJson() {
        const dataToDownload = {
          formTitle: "${formTitle}",
          formDescription: "${formDescription}",
          submittedAt: new Date().toISOString(),
          dataSchema: dataSchemaForDashboard,
          formData: currentFormData
        };
        const jsonData = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${formTitle.replace(/\s+/g, '_')}_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
  
      function handleDownloadHtml() {
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${formTitle.replace(/\\s+/g, '_')}_form.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
  
      function handleShareForm() {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            text: 'Check out this form: ' + "${formTitle}",
            url: window.location.href.startsWith('file:') ? 'This form is a local file. Upload it to a web host to share the link.' : window.location.href,
          }).catch(console.error);
        } else {
          const shareUrl = window.location.href.startsWith('file:') ? 'This form is a local file. Upload it to a web host to share this link.' : window.location.href;
          alert('Share this link: ' + shareUrl + '\n(Link copied to clipboard if possible)');
          if (!window.location.href.startsWith('file:')) {
            navigator.clipboard.writeText(window.location.href).catch(console.error);
          }
        }
      }
  
      function setupEventListeners() {
          formElement.addEventListener('submit', function(event) {
            event.preventDefault();
            currentFormData = collectFormData();
            if (validateForm()) {
              updateProgress(2, 3, 'Review Answers');
              displayReview();
            }
          });
  
          editButton.addEventListener('click', function() {
            updateProgress(1, 3, 'Fill Form');
            reviewSection.style.display = 'none';
            completionSection.style.display = 'none';
            formSection.style.display = 'block';
          });
  
          confirmSubmitButton.addEventListener('click', function() {
            updateProgress(3, 3, 'Submission Complete');
            finalDataDisplay.textContent = JSON.stringify(currentFormData, null, 2);
            reviewSection.style.display = 'none';
            formSection.style.display = 'none';
            completionSection.style.display = 'block';
          });
  
          downloadJsonButton.addEventListener('click', handleDownloadJson);
          downloadHtmlButton.addEventListener('click', handleDownloadHtml);
          shareFormButton.addEventListener('click', handleShareForm);
  
          // Add real-time validation and "Other (specify)" logic
          formSchema.forEach(field => {
              const elements = formElement.elements;
              const mainFieldElement = elements[field.id]; // This can be an input or a RadioNodeList/HTMLCollection for groups
              const fieldContainer = document.getElementById('field-container-' + field.id);
  
              // Visual cue and real-time validation for original required fields
              if (field.required && mainFieldElement) {
                  const eventType = (mainFieldElement.type === 'checkbox' || mainFieldElement.type === 'radio' || mainFieldElement.nodeName === 'SELECT') ? 'change' : 'input';
  
                  // If it's a RadioNodeList, attach to each radio button
                  if (mainFieldElement.constructor === RadioNodeList) {
                      Array.from(mainFieldElement).forEach(radio => {
                          radio.addEventListener(eventType, function() {
                              validateField(field, mainFieldElement.value, elements);
                          });
                      });
                  } else if (mainFieldElement.type === 'checkbox' && field.options && field.options.length > 0) { // Checkbox group
                      field.options.forEach(option => {
                          const optId = field.id + '_' + option.replace(/\\s+/g, '_');
                          const cb = document.getElementById(optId);
                          if (cb) {
                              cb.addEventListener('change', function() {
                                  let groupValue = {};
                                  field.options.forEach(o => {
                                     const currentCb = document.getElementById(field.id + '_' + o.replace(/\\s+/g, '_'));
                                     if (currentCb) groupValue[o] = currentCb.checked;
                                  });
                                  validateField(field, groupValue, elements);
                              });
                          }
                      });
                  } else if (mainFieldElement) { // Single input, select, single checkbox
                      mainFieldElement.addEventListener(eventType, function() {
                          const value = mainFieldElement.type === 'checkbox' ? mainFieldElement.checked : mainFieldElement.value;
                          validateField(field, value, elements);
                      });
                  }
              }
  
  
              // "Other (specify)" logic
              if ((field.type.toLowerCase() === 'radio' || (field.type.toLowerCase() === 'checkbox' && field.options && field.options.length > 0))) {
                const controllingInputs = field.type.toLowerCase() === 'radio' ?
                                         (elements[field.id] ? Array.from(elements[field.id]) : []) : // RadioNodeList to Array
                                         (field.options ? field.options.map(opt => document.getElementById(field.id + '_' + opt.replace(/\\s+/g, '_'))) : []);
  
                controllingInputs.forEach(inputControl => {
                  if (inputControl && inputControl.dataset.controlsSpecify) {
                    const specifyFieldId = inputControl.dataset.controlsSpecify;
                    const specifyContainer = document.getElementById('field-container-' + specifyFieldId);
                    const specifyInput = document.getElementById(specifyFieldId);
  
                    if (specifyContainer && specifyInput) {
                      inputControl.addEventListener('change', function(event) {
                        const target = event.target;
                        let anyOtherControllerChecked = false;
                         // Check all inputs that control *this specific* specifyFieldId
                        controllingInputs.forEach(inp => {
                          if (inp && inp.dataset.controlsSpecify === specifyFieldId && inp.checked) {
                            anyOtherControllerChecked = true;
                          }
                        });
  
                        if (anyOtherControllerChecked) {
                          specifyContainer.classList.remove('hidden');
                          specifyInput.required = true; // Dynamically set required
                          specifyInput.dataset.originalRequired = "true"; // Mark for visual cue logic
                           // Trigger validation for the now visible/required specify field
                          validateField({ id: specifyFieldId, label: specifyInput.previousElementSibling?.textContent || 'This field', required: true, type: 'text' }, specifyInput.value, elements);
                        } else {
                          specifyContainer.classList.add('hidden');
                          specifyInput.required = false;
                          specifyInput.dataset.originalRequired = "false";
                          specifyInput.value = ''; // Clear value
                          document.getElementById('error-' + specifyFieldId).textContent = ''; // Clear error
                          specifyContainer.classList.remove('needs-input'); // Remove visual cue
                        }
                      });
                    }
                  }
                });
              }
            });
  
          // Dark mode listener
          const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
          function toggleDarkMode(matches) {
            if (matches) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          toggleDarkMode(darkModeMatcher.matches);
          darkModeMatcher.addListener((e) => toggleDarkMode(e.matches));
      }
  
  
      document.addEventListener('DOMContentLoaded', function() {
        setupEventListeners();
        updateProgress(1, 3, 'Fill Form'); // Initial state
      });
  
    `;
  } 