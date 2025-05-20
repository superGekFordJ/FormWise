// src/ai/flows/parse-questionnaire.ts
'use server';

/**
 * @fileOverview Parses a questionnaire (PDF or text) into an interactive form structure
 * and a data schema for an investigator dashboard.
 *
 * - parseQuestionnaire - The main function to parse the questionnaire.
 * - ParseQuestionnaireInput - The input type for the parseQuestionnaire function.
 * - ParseQuestionnaireOutput - The output type representing the interactive form structure and data schema.
 * - DataSchema - The type for the data schema.
 */

import {ParsingAI} from '@/ai/genkit';
import {z} from 'genkit';

const ParseQuestionnaireInputSchema = z.object({
  questionnaireDataUri: z
    .string()
    .describe(
      "The questionnaire document as a data URI (PDF or text) that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>' ."
    ),
});
export type ParseQuestionnaireInput = z.infer<typeof ParseQuestionnaireInputSchema>;

const FormFieldSchema = z.object({
  id: z.string().describe('A unique machine-readable identifier for the field (e.g., "user_name", "question_3"). This ID must be unique within the form and suitable for use as an object key (e.g. using snake_case).'),
  label: z.string().describe('The label or question text for the field.'),
  type: z
    .string()
    .describe(
      'The type of input field. For example: text, textarea, number, date, radio, checkbox, select.'
    ),
  options: z
    .array(z.string())
    .optional()
    .describe('Available options for radio, checkbox, or select fields. If a text input is needed for an "Other" option, create a separate text input field for that specification.'),
  required: z.boolean().describe('Whether the field is required or not.'),
});

const DataSchemaFieldSchema = z.object({
  id: z.string().describe("Unique identifier for the data field, corresponding to the form field ID."),
  label: z.string().describe("Human-readable label for this data field."),
  type: z.string().describe("The data type (e.g., 'string', 'number', 'boolean', 'date', 'array_of_strings' for multi-select checkbox, 'object_of_booleans' for checkbox groups where keys are options)."),
  analysisHint: z.string().optional().describe("A hint for how this field might be analyzed or visualized in a dashboard (e.g., 'categorical', 'numerical', 'text_summary', 'date_trend', 'multi_select_categorical')."),
  options: z.array(z.string()).optional().describe("If the field's type is 'categorical' or 'multi_select_categorical' (e.g., from radio/select/checkbox group), list the possible options for dashboard filtering or aggregation."),
});

const DataSchemaSchema = z.object({
  schemaVersion: z.string().default("1.0.0").describe("Version of this data schema structure."),
  formTitle: z.string().describe("Title of the dataset, usually derived from the form title."),
  formDescription: z.string().optional().describe("Description of the dataset, usually derived from the form description."),
  fields: z.array(DataSchemaFieldSchema).describe("An array of data field definitions specifically structured for the investigator dashboard to interpret and analyze submitted data."),
});
export type DataSchema = z.infer<typeof DataSchemaSchema>;


const ParseQuestionnaireOutputSchema = z.object({
  formTitle: z.string().describe('The title of the form derived from the questionnaire. This field is mandatory at the root level.'),
  formDescription: z.string().describe('A brief description of the form.'),
  fields: z.array(FormFieldSchema).describe('An array of form field definitions for rendering the interactive HTML form.'),
  dataSchema: DataSchemaSchema.describe('A structured data schema optimized for the Investigator Dashboard, defining how collected data should be organized and interpreted for analysis. This schema should correspond to the form fields.'),
});
export type ParseQuestionnaireOutput = z.infer<typeof ParseQuestionnaireOutputSchema>;


export async function parseQuestionnaire(input: ParseQuestionnaireInput): Promise<ParseQuestionnaireOutput> {
  return parseQuestionnaireFlow(input);
}

const parseQuestionnairePrompt = ParsingAI.definePrompt({
  name: 'parseQuestionnairePrompt',
  input: {schema: ParseQuestionnaireInputSchema},
  output: {schema: ParseQuestionnaireOutputSchema},
  config: {
    temperature: 0.2, // Adjusted back as per recent request, was 0.3
    topP: 0.8,      // Adjusted back as per recent request, was 0.85
  },
  prompt:`You are an expert form builder and data architect with exceptional skill in interpreting visual layouts of questionnaires and transforming them into structured data. You will be provided with a questionnaire document (this could be an image, PDF, or text).
  Your primary task is to meticulously analyze its structure, questions, options, and any instructional text to output a single, valid JSON object.
  
  The root JSON object MUST strictly adhere to the following schema and include 'formTitle', 'formDescription', 'fields', and 'dataSchema'.
  
  **CRITICAL REQUIREMENTS:**
  1.  **\`formTitle\` (Root Level):** This field is **MANDATORY** and of utmost importance. It must be prominently derived from the main title of the questionnaire (e.g., "居民食品浪费情况调查问卷"). If there are subheadings, choose the most overarching title for the entire document. If no clear title is found, generate a sensible one like "Untitled Questionnaire".
  2.  **\`formDescription\` (Root Level):** This should be a concise summary of the questionnaire's purpose, often found in an introductory paragraph or preamble.
  3.  **Schema Adherence:** The entire output MUST strictly conform to the \`ParseQuestionnaireOutputSchema\` (details implied by the structure below). Pay close attention to data types and required fields within the schema.
  
  **JSON Object Structure:**
  
  **I. \`fields\` Array (for HTML Form Rendering):**
     An array of form field definitions. Process questions in the order they appear in the document.
  
     *   **\`label\`**: Human-readable question text.
          *   For questions within clear sections (e.g., "一、食品消费情况" or "Section A"), ensure the question order reflects these sections.
          *   For matrix/grid questions, the label for each generated field should combine the row's specific statement/item with the general question of the matrix.
     *   **\`id\`**: A unique, machine-readable identifier (e.g., "user_name", "q1_breakfast_count", "food_waste_awareness_statement_1").
          *   MUST be unique across all fields in this form.
          *   MUST use \`snake_case\` (e.g., \`question_one_part_a\`).
          *   Make IDs semantic and, if a question is broken into parts, reflect that (e.g., \`q1_breakfast\`, \`q1_lunch\`).
     *   **\`type\`**: Determine the best field type:
          *   \`text\`: For short text answers.
          *   \`textarea\`: For longer, multi-line text answers.
          *   \`number\`: For numerical inputs.
          *   \`date\`: For date inputs.
          *   \`radio\`: For single-choice questions from a list of options (e.g., typical ○ options where only one can be selected).
          *   \`checkbox\`: For multiple-choice questions where more than one option can be selected (often indicated by "【多选】", square boxes, or instructions like "select all that apply"). If it's a single standalone checkbox representing a boolean choice, still use \`checkbox\` type but it won't have \`options\`.
          *   \`select\`: For dropdown lists (use if explicitly stated or if it's the most appropriate representation for a long list of single-choice options).
     *   **\`options\`**: An array of strings for \`radio\`, \`checkbox\` (when it's a group), or \`select\` field types. Extract these options accurately.
     *   **\`required\`**: Boolean. Determine if the question seems mandatory. 
  
     **Specific Question Handling for \`fields\`:**
      *   **Inline Multiple Inputs:** If a single question line asks for multiple distinct inputs (e.g., "Breakfast __ times, Lunch __ times"), break these into SEPARATE fields. Each must have its own unique \`id\`, appropriate \`label\` (e.g., "Breakfast: Number of times eaten out", "Lunch: Number of times eaten out"), and \`type\` (likely \`number\`).
      *   **Matrix/Grid/Likert Scale Questions:**
          *   These typically have rows representing individual items/statements and columns representing a scale (e.g., "Strongly Agree" to "Strongly Disagree", or numerical ratings).
          *   For EACH ROW in the matrix, create a SEPARATE field object in the \`fields\` array.
          *   The \`label\` for each such field should be the text of that specific row statement (e.g., "我常常因为判断不出菜品分量,经常过量点菜。"). If the matrix has an overall question, you can prepend it or ensure context is clear.
          *   The \`type\` for each of these fields will usually be \`radio\` (as only one option on the scale is chosen per row).
          *   The \`options\` for ALL fields generated from the SAME matrix will be the column headers of that matrix (e.g., ["非常同意", "同意", "不一定", "不同意", "非常不同意"] or ["1", "2", "3", "4", "5"]).
          *   The \`id\` for each field should be unique and indicate both the matrix and the row (e.g., \`likert_q7_statement1\`, \`likert_q7_statement2\`).
      *   **Complex Options with Embedded Inputs (e.g., Question 3 in Food Waste Survey):**
          *   If a choice within a multiple-choice question also requires its own specific input (e.g., "○主食 (...), 平均每餐大约剩余___克"):
              1.  The main question (e.g., "您主要剩余的食品类型及剩余量大约是?") will be a \`checkbox\` (if "【多选】") or \`radio\` group. Its \`options\` will be the main choices (e.g., "主食(...)", "肉类(...)", etc.).
              2.  For EACH option that has an associated blank to be filled (like "___克"), create an ADDITIONAL, SEPARATE field.
                  *   This separate field's \`label\` must clearly link it to the parent option (e.g., "主食: 平均每餐大约剩余克数").
                  *   Its \`type\` will likely be \`number\` (for "___克") or \`text\` (for "请注明___").
                  *   Its \`id\` must be unique and clearly linked (e.g., \`q3_food_type_staple_leftover_grams\`).
      *   **"Other (please specify)" Options:**
          *   If a multiple-choice option is "Other" or "其他", and it is followed by an explicit request to specify (e.g., "其他 (请注明) ____" or "Other (please specify) ____"):
              1.  Include "Other" (or "其他") as one of the \`options\` in the main multiple-choice field.
              2.  Create a SEPARATE \`text\` (or \`textarea\`) input field for the specification.
              3.  The \`label\` for this specification field should clearly link it to the "Other" option (e.g., "Other Food Type - Please Specify" or "其他类型 - 请注明"). Make this label distinct. For example if the main label is "Question X", and the option is "Other", the specify label could be "Question X - Other Specification".
              4.  The \`id\` of this separate text input MUST follow the convention: \`{original_field_id}_other_specify\`. For example, if the main question ID is \`q2_consumption_scenario\`, the text input ID for its "Other" option must be \`q2_consumption_scenario_other_specify\`. This is crucial for client-side JavaScript interaction. The \`required\` status for this "other\_specify" field should initially be \`false\` as it's conditional.
  
  **II. \`dataSchema\` Object (for Investigator Dashboard):**
     A structured data schema optimized for analysis.
  
     *   **\`dataSchema.formTitle\`**: Must be identical to the root \`formTitle\`.
     *   **\`dataSchema.formDescription\`**: Must be identical to the root \`formDescription\`.
     *   **\`dataSchema.fields\`**: An array of data field definitions. Each field in this array MUST correspond one-to-one with a field in the main \`fields\` array (from Part I).
          *   **\`id\`**: MUST be IDENTICAL to the \`id\` in the corresponding form field from Part I.
          *   **\`label\`**: MUST be IDENTICAL to the \`label\` in the corresponding form field from Part I.
          *   **\`type\`**: Define the data type for analysis:
              *   \`string\`: For text, textarea, radio (stores the selected option string), select.
              *   \`number\`: For number inputs.
              *   \`boolean\`: For single, standalone checkboxes (representing a true/false state).
              *   \`date\`: For date inputs.
              *   \`object_of_booleans\`: For checkbox groups (where multiple options can be selected). The keys of the object will be the option strings, and values will be booleans.
              *   \`array_of_strings\`: Alternative for multi-select dropdowns or checkbox lists if the desired data structure is an array of selected option strings. (Prefer \`object_of_booleans\` for checkbox groups unless specified otherwise).
          *   **\`analysisHint\`**: Provide a hint for dashboard visualization/analysis:
              *   \`categorical\`: For radio, select.
              *   \`numerical\`: For number.
              *   \`text_summary\`: For textarea or long text.
              *   \`boolean_summary\`: For boolean.
              *   \`multi_select_categorical\`: For checkbox groups (\`object_of_booleans\` or \`array_of_strings\`).
              *   \`date_trend\`: For dates.
          *   **\`options\`**: If \`analysisHint\` is \`categorical\` or \`multi_select_categorical\`, list the possible string options. This MUST match the options provided in the corresponding \`fields\` entry.
  
  **Processing Strategy:**
  1.  Thoroughly examine the entire document to understand its overall structure, sections, and flow.
  2.  Identify the main \`formTitle\` and \`formDescription\` first. Ensure \`formTitle\` is ALWAYS present at the root level.
  3.  Iterate through the questionnaire question by question, or section by section.
  4.  For each question or interactive element:
      *   Determine its type and extract its label.
      *   If it's a complex type (matrix, inline inputs, option with embedded input), break it down into the necessary individual fields as described above.
      *   Generate the \`fields\` entry.
      *   Simultaneously, generate the corresponding \`dataSchema.fields\` entry, ensuring \`id\` and \`label\` match, and \`type\` and \`analysisHint\` are appropriate. For "other\_specify" fields, the \`dataSchema.fields.type\` should typically be 'string' and \`analysisHint\` 'text\_summary'.
  5.  Ensure all \`id\`s are globally unique within the form and adhere to naming conventions, especially for "other_specify" fields.
  6.  Double-check that the entire output is valid JSON and strictly adheres to all specified structural and content requirements, particularly the mandatory \`formTitle\`.
  
  **Questionnaire Document:**
  {{media url=questionnaireDataUri}}
  ` // End of the template literal for the prompt
  });


const parseQuestionnaireFlow = ParsingAI.defineFlow(
  {
    name: 'parseQuestionnaireFlow',
    inputSchema: ParseQuestionnaireInputSchema,
    outputSchema: ParseQuestionnaireOutputSchema,
  },
  async input => {
    const {output} = await parseQuestionnairePrompt(input);
    // Ensure dataSchema reflects form title and description
    if (output) {
      if (!output.formTitle) {
        // This is a critical failure, the prompt MUST ensure formTitle is present.
        // Throwing an error or returning a structured error might be better long-term.
        // For now, fallback to a generic title to avoid breaking dashboard expectations if AI fails.
        console.warn("AI failed to provide a formTitle. Defaulting to 'Untitled Form'. Input:", input);
        output.formTitle = "Untitled Form"; 
      }
      if (output.dataSchema) {
        output.dataSchema.formTitle = output.formTitle;
        output.dataSchema.formDescription = output.formDescription;

        // Ensure all fields in output.fields have a corresponding entry in output.dataSchema.fields
        // This is to prevent mismatches if the AI omits some dataSchema fields.
        const dataSchemaFieldIds = new Set(output.dataSchema.fields.map(f => f.id));

        output.fields.forEach(formField => {
            if (!dataSchemaFieldIds.has(formField.id)) {
                console.warn(`DataSchema missing field for form field ID: ${formField.id}. Adding a default schema entry.`);
                let dsType = 'string';
                let dsAnalysisHint = 'text_summary';
                if (formField.type === 'number') { dsType = 'number'; dsAnalysisHint = 'numerical'; }
                else if (formField.type === 'date') { dsType = 'date'; dsAnalysisHint = 'date_trend'; }
                else if (formField.type === 'checkbox' && !formField.options) { dsType = 'boolean'; dsAnalysisHint = 'boolean_summary'; }
                else if (formField.type === 'checkbox' && formField.options) { dsType = 'object_of_booleans'; dsAnalysisHint = 'multi_select_categorical'; }
                else if (formField.type === 'radio' || formField.type === 'select') { dsType = 'string'; dsAnalysisHint = 'categorical'; }

                output.dataSchema.fields.push({
                    id: formField.id,
                    label: formField.label,
                    type: dsType,
                    analysisHint: dsAnalysisHint,
                    options: formField.options
                });
            }
        });


      } else { 
        // This case should ideally not be reached if the AI adheres to the output schema.
        console.error("AI failed to provide dataSchema. Creating a default one. Input:", input);
        output.dataSchema = {
            schemaVersion: "1.0.0",
            formTitle: output.formTitle,
            formDescription: output.formDescription,
            fields: output.fields.map(formField => { // Attempt to map fields
                 let dsType = 'string';
                let dsAnalysisHint = 'text_summary';
                if (formField.type === 'number') { dsType = 'number'; dsAnalysisHint = 'numerical'; }
                else if (formField.type === 'date') { dsType = 'date'; dsAnalysisHint = 'date_trend'; }
                else if (formField.type === 'checkbox' && !formField.options) { dsType = 'boolean'; dsAnalysisHint = 'boolean_summary'; }
                else if (formField.type === 'checkbox' && formField.options) { dsType = 'object_of_booleans'; dsAnalysisHint = 'multi_select_categorical'; }
                else if (formField.type === 'radio' || formField.type === 'select') { dsType = 'string'; dsAnalysisHint = 'categorical'; }
                return {
                    id: formField.id,
                    label: formField.label,
                    type: dsType, 
                    analysisHint: dsAnalysisHint,
                    options: formField.options
                };
            })
        };
      }
    } else {
        // This would be a major failure from the AI.
        console.error("AI returned no output for parseQuestionnairePrompt. Input:", input);
        // Consider throwing an error or returning a default ParseQuestionnaireOutput structure
        // to prevent downstream crashes.
        return {
            formTitle: "Error: Form Parsing Failed",
            formDescription: "The AI could not process the questionnaire.",
            fields: [],
            dataSchema: {
                schemaVersion: "1.0.0",
                formTitle: "Error: Form Parsing Failed",
                formDescription: "The AI could not process the questionnaire.",
                fields: []
            }
        };
    }
    return output!;
  }
);

