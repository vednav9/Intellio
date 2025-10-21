import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateContent = async (prompt, temperature = 0.7) => {
  try {
    // Use Gemini 2.5 Flash - stable and fast
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content');
  }
};

export const generateContentWithImage = async (prompt, imageBase64) => {
  try {
    // Gemini 2.5 Flash supports images too
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash'
    });
    
    // Remove data URL prefix if present
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    throw new Error('Failed to process image');
  }
};
