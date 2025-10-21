// server/test-gemini-final.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  try {
    console.log('Testing Gemini 2.5 Flash...\n');
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent('Write a short blog title about AI in healthcare');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS!\n');
    console.log('Generated Text:');
    console.log(text);
    console.log('\n🎉 Your Gemini API is ready to use!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

test();
