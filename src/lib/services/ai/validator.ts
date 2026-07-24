import { Assessment, Question, QuestionType } from "@/lib/types";
import { GeneratorInput } from "@/lib/schemas";

export class Validator {
  /**
   * Validates the parsed Groq JSON and normalizes it to fit our internal types.
   * Performs automatic recovery for missing fields, incorrect indices, and duplicate IDs.
   */
  static validateAndNormalize(
    parsedJson: any,
    params: GeneratorInput
  ): Assessment {
    
    // 1. Guard against null or missing JSON objects
    const data = parsedJson || {};

    // 2. Validate and recover the 'questions' array
    let questionsList = data.questions;
    if (!questionsList) {
      console.warn("[Validator] 'questions' block is missing. Creating a default fallback array.");
      questionsList = [];
    } else if (!Array.isArray(questionsList)) {
      console.warn("[Validator] 'questions' is not an array. Wrapping the object inside a list.");
      questionsList = [questionsList];
    }

    // 3. Track and recover duplicate IDs
    const seenIds = new Set<string>();

    const validatedQuestions: Question[] = questionsList.map((q: any, index: number) => {
      // Clean target question object
      const targetQ = q || {};

      // 4. Normalize type mapping
      let type: QuestionType = 'multiple-choice';
      const rawType = (targetQ.type || "").toLowerCase();
      if (rawType === 'mcq' || rawType === 'multiple-choice') {
        type = 'multiple-choice';
      } else if (rawType === 'true-false' || rawType === 'true_false') {
        type = 'true-false';
      } else if (rawType === 'short-answer' || rawType === 'short_answer') {
        type = 'short-answer';
      } else if (rawType === 'fill-in-the-blank' || rawType === 'fill_in_the_blank') {
        type = 'fill-in-the-blank';
      } else {
        type = params.questionType === 'mixed' ? 'multiple-choice' : (params.questionType as QuestionType);
      }

      // 5. Normalize options array
      let options: string[] | undefined = undefined;
      if (type === 'multiple-choice' || type === 'true-false') {
        if (type === 'true-false') {
          options = ["True", "False"];
        } else {
          options = Array.isArray(targetQ.options) && targetQ.options.length > 0
            ? targetQ.options.map((o: any) => o.toString().trim())
            : ["Option A", "Option B", "Option C", "Option D"]; // Fallback standard options list
        }
      }

      // 6. Resolve and recover correctAnswer (Index vs. String vs. Out of Bounds)
      let correctAnswer = "";
      const rawCorrectAnswer = targetQ.correctAnswer;

      if (type === 'multiple-choice' || type === 'true-false') {
        if (options) {
          const indexVal = Number(rawCorrectAnswer);
          if (!isNaN(indexVal) && indexVal >= 0 && indexVal < options.length) {
            correctAnswer = options[indexVal];
          } else {
            // Out of bounds index or string answer representation. Try to find string match in options.
            const stringAnswer = (rawCorrectAnswer || "").toString().trim().toLowerCase();
            const matchedIndex = options.findIndex(o => o.toLowerCase() === stringAnswer);
            
            if (matchedIndex !== -1) {
              correctAnswer = options[matchedIndex];
              console.warn(`[Validator] Recovered out-of-bounds MCQ correctAnswer index by text matching: "${correctAnswer}"`);
            } else {
              // Fallback to the first option
              correctAnswer = options[0];
              console.warn(`[Validator] Out-of-bounds correctAnswer index detected. Fallback set to options[0]: "${correctAnswer}"`);
            }
          }
        }
      } else {
        // String value matching for short answers
        correctAnswer = (rawCorrectAnswer || "").toString().trim();
        if (!correctAnswer) {
          correctAnswer = "Answer not provided.";
          console.warn("[Validator] Correct answer missing on short-answer/blank question. Fallback set.");
        }
      }

      // 7. Resolve and recover duplicate IDs
      let qId = targetQ.id ? targetQ.id.toString().trim() : `q_${index + 1}`;
      if (seenIds.has(qId)) {
        const uniqueId = `q_${index + 1}_${Math.random().toString(36).substr(2, 4)}`;
        console.warn(`[Validator] Duplicate question ID detected: "${qId}". Replaced with unique: "${uniqueId}"`);
        qId = uniqueId;
      }
      seenIds.add(qId);

      const question: Question = {
        id: qId,
        type,
        questionText: targetQ.question || targetQ.questionText || `Question topic covering ${params.topic}.`,
        options,
        correctAnswer,
        explanation: targetQ.explanation || "No explanation provided.",
        bloomLevel: targetQ.bloomLevel || params.bloomTaxonomy,
        estimatedTime: targetQ.estimatedTime || "2 minutes",
      };

      return question;
    });

    // 8. If all questions are empty, inject a default educational question to avoid blank dashboards
    if (validatedQuestions.length === 0) {
      console.warn("[Validator] Final assessment question list is empty. Injecting educational placeholder question.");
      validatedQuestions.push({
        id: "q_1_fallback",
        type: "multiple-choice",
        questionText: `What is the core target of Sustainable Development Goal 4 (Quality Education)?`,
        options: [
          "Ensure inclusive and equitable quality education for all",
          "Restrict educational assessment accesses",
          "Prioritize high-cost proprietary tutoring frameworks",
          "Abolish examination models completely"
        ],
        correctAnswer: "Ensure inclusive and equitable quality education for all",
        explanation: "SDG Goal 4 targets inclusive, equitable quality education and promoting lifelong learning opportunities for all.",
      });
    }

    // 9. Recover missing top level metadata
    const title = (data.title || `Assessment: ${params.subject} - ${params.topic}`).trim();
    const description = (data.description || `Pedagogical evaluation sheet for ${params.topic} (${params.difficulty} difficulty).`).trim();
    const subject = (data.subject || params.subject).trim();
    const topic = (data.topic || params.topic).trim();
    const difficulty = (data.difficulty || params.difficulty).trim();
    const language = (data.language || params.language).trim();

    return {
      id: data.id || `assessment_${Date.now()}`,
      title,
      description,
      subject,
      topic,
      difficulty,
      bloomTaxonomy: params.bloomTaxonomy,
      language,
      educationalLevel: params.educationalLevel,
      questions: validatedQuestions,
      createdAt: data.createdAt || new Date().toISOString(),
    };
  }
}
