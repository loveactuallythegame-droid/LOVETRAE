import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT || 'love-actually-game',
  location: 'us-central1',
});

// Model configurations
const MODEL_CONFIG = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
};

// Initialize the generative model
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-pro',
  generationConfig: MODEL_CONFIG,
});

/**
 * Generate personalized game content using Vertex AI
 */
export const generateGameContent = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { gameType, coupleContext, prompt } = data;
    
    if (!gameType || !prompt) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
    }

    // Generate content based on game type
    let systemPrompt = '';
    let userPrompt = prompt;

    switch (gameType) {
      case 'jeopardy':
        systemPrompt = `You are Dr. Marcie Liss, a witty relationship therapist. Create personalized Jeopardy categories for a couple based on their relationship context. 
        
Relationship Context: ${JSON.stringify(coupleContext)}

Generate 5 categories with 5 clues each (200-1000 points). Each clue should be:
- Personal to their relationship journey
- Include Marcie's signature sassy commentary
- Progress from easy (200) to challenging (1000)
- Focus on relationship rebuilding themes

Format as JSON:
{
  "categories": [
    {
      "id": "string",
      "name": "Category Name",
      "clues": [
        {
          "id": "string",
          "value": 200,
          "clue": "Clue text with Marcie's commentary",
          "answer": "Correct answer",
          "answered": false,
          "buzz_times": {}
        }
      ]
    }
  ]
}`;
        break;

      case 'millionaire':
        systemPrompt = `You are Dr. Marcie Liss. Create 15 escalating relationship knowledge questions for the couple.
        
Relationship Context: ${JSON.stringify(coupleContext)}

Structure:
Questions 1-5: Factual knowledge (favorites, habits, preferences)
Questions 6-10: Emotional intelligence (feelings, reactions, needs)
Questions 11-15: Deep vulnerability (fears, dreams, traumas, values)

Each question should have:
- Question text
- 4 options (A, B, C, D)
- Correct answer
- Marcie's commentary for each option
- Point value (escalating: 100 to 1,000,000)

Format as JSON with "questions" array.`;
        break;

      case 'newlywed':
        systemPrompt = `You are Dr. Marcie Liss. Create "Newlywed Game" style questions testing how well partners know each other.
        
Relationship Context: ${JSON.stringify(coupleContext)}

Generate questions about:
- Daily habits and preferences
- Emotional responses and needs
- Future dreams and fears
- Intimate knowledge

Include Marcie's signature wit and relationship insights.
Format as JSON with "questions" array.`;
        break;

      case 'marcie_commentary':
        systemPrompt = `You are Dr. Marcie Liss, relationship therapist with signature sass and wit. 
Respond to this game event with your unique personality: ${prompt}

Be encouraging but honest, use your catchphrases like "darling", and provide relationship insights.
Keep it under 3 sentences. Be specific to the context.`;
        break;

      default:
        systemPrompt = `You are Dr. Marcie Liss, a relationship therapist with signature sass and wit.
Create content for a ${gameType} game based on this couple's context: ${JSON.stringify(coupleContext)}

User request: ${prompt}

Respond in JSON format appropriate for the game type.`;
    }

    // Generate content
    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
    });

    const response = await result.response;
    const text = response.text();

    // Parse the response
    let content;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, return the text as commentary
        content = { commentary: text };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      content = { 
        commentary: text,
        error: 'Failed to parse structured response'
      };
    }

    // Log for monitoring
    await logAIGeneration(gameType, context.auth.uid, prompt, text);

    return { content };

  } catch (error) {
    console.error('Vertex AI generation error:', error);
    
    // Return fallback content
    const fallbackContent = getFallbackContent(gameType, coupleContext);
    
    throw new functions.https.HttpsError(
      'internal',
      'AI content generation failed',
      { fallback: fallbackContent }
    );
  }
});

/**
 * Analyze user input for emotional content and sentiment
 */
export const analyzeUserInput = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { input, context: analysisContext } = data;
    
    if (!input) {
      throw new functions.https.HttpsError('invalid-argument', 'Input is required');
    }

    const prompt = `Analyze this user input for emotional content and relationship significance:
"${input}"

Context: ${JSON.stringify(analysisContext)}

Provide analysis in JSON format:
{
  "sentiment": "positive|negative|neutral|vulnerable",
  "confidence": 0.0-1.0,
  "triggers": ["array of emotional triggers detected"],
  "marcieResponse": "Dr. Marcie's empathetic but witty response",
  "intensity": 1-10,
  "relationshipImpact": "brief insight about relationship significance"
}`;

    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    const text = response.text();

    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        sentiment: 'neutral',
        confidence: 0.5,
        triggers: [],
        marcieResponse: "Tell me more about that, darling...",
        intensity: 5,
        relationshipImpact: "I'm here to listen."
      };
    } catch (error) {
      analysis = {
        sentiment: 'neutral',
        confidence: 0.5,
        triggers: [],
        marcieResponse: "I sense there's something important here. Tell me more.",
        intensity: 5,
        relationshipImpact: "Let's explore this together."
      };
    }

    return analysis;

  } catch (error) {
    console.error('Input analysis error:', error);
    
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      triggers: [],
      marcieResponse: "I'm having trouble analyzing that right now, but I'm here to listen.",
      intensity: 5,
      relationshipImpact: "Let's talk about it."
    };
  }
});

/**
 * Synthesize speech for Marcie's responses
 */
export const synthesizeSpeech = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { text, voiceSettings } = data;
    
    if (!text) {
      throw new functions.https.HttpsError('invalid-argument', 'Text is required');
    }

    // For now, return a mock response since ElevenLabs integration would require API key
    // In production, integrate with ElevenLabs or Google Cloud Text-to-Speech
    
    const mockAudioUrl = `https://mock-tts-service.com/audio/${encodeURIComponent(text)}.mp3`;
    const duration = text.split(' ').length * 0.2; // Rough estimate: 0.2s per word

    return {
      audioUrl: mockAudioUrl,
      duration: Math.round(duration * 1000), // Convert to milliseconds
      text: text,
    };

  } catch (error) {
    console.error('Speech synthesis error:', error);
    throw new functions.https.HttpsError('internal', 'Speech synthesis failed');
  }
});

/**
 * Helper function to get fallback content when AI generation fails
 */
function getFallbackContent(gameType: string, coupleContext: any): any {
  const fallbacks = {
    jeopardy: {
      categories: [
        {
          id: 'fallback-1',
          name: 'First Encounters',
          clues: [
            { id: 'c1-1', value: 200, clue: 'The place where you first met', answer: 'Where we first met', answered: false, buzz_times: {} },
            { id: 'c1-2', value: 400, clue: 'Your first impression of each other', answer: 'What we first thought', answered: false, buzz_times: {} },
          ]
        }
      ]
    },
    millionaire: {
      questions: [
        {
          question: "What's your partner's favorite food?",
          options: ['A) Pizza', 'B) Sushi', 'C) Tacos', 'D) Pasta'],
          correctAnswer: 'A',
          marcieCommentary: "Food is the way to the heart, darling!"
        }
      ]
    },
    marcie_commentary: {
      commentary: "Well, that was... interesting, darling. Let's try again!"
    }
  };

  return fallbacks[gameType as keyof typeof fallbacks] || { content: "Let's play!" };
}

/**
 * Log AI generation for monitoring and analytics
 */
async function logAIGeneration(
  gameType: string, 
  userId: string, 
  prompt: string, 
  response: string
): Promise<void> {
  try {
    const logEntry = {
      userId,
      gameType,
      prompt,
      response,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      tokens: Math.ceil((prompt + response).length / 4), // Rough estimate
    };

    await admin.firestore()
      .collection('ai_generation_logs')
      .add(logEntry);
  } catch (error) {
    console.error('Failed to log AI generation:', error);
  }
}