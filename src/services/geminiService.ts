import { GoogleGenerativeAI } from '@google/generative-ai';
import { College } from '../App';


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export class GeminiCollegeService {
  private model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });
  private cache = new Map<string, { data: College[], timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  async searchColleges(location: string): Promise<College[]> {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }


    const cacheKey = location.toLowerCase().trim();
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Returning cached results for:', location);
      return cached.data;
    }


    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Search timeout - please try again')), 15000);
    });

    try {
      const searchPromise = this.performSearch(location);
      const colleges = await Promise.race([searchPromise, timeoutPromise]);
      
      
      this.cache.set(cacheKey, { data: colleges, timestamp: Date.now() });
      
      return colleges;
    } catch (error: any) {
      console.error('Search error:', error);
      if (error.message?.includes('timeout')) {
        throw new Error('Search is taking too long. Please try a different location or try again later.');
      }
      throw error;
    }
  }

  private async performSearch(location: string): Promise<College[]> {
    try {
      const prompt = `List exactly 12 top colleges/universities in ${location}, India offering IT or Management courses. 

Return ONLY valid JSON array:
[
  {
    "name": "College Name",
    "address": "Full Address", 
    "contactDetails": {"phone": "+91-xxx", "email": "college@edu.in", "website": "https://college.edu"},
    "coursesAvailable": ["B.Tech CSE", "MBA"],
    "fees": [{"course": "B.Tech CSE", "amount": "200000"}],
    "type": "Both"
  }
]

Include: IITs, NITs, government colleges, private universities, management institutes.
Keep response under 4000 characters to avoid truncation.`;

      console.log('Sending request to Gemini AI for location:', location);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      console.log('Raw Gemini response:', text);
      
      
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }
      
      
      try {
        
        let fixedText = text;
        
        
        const openBrackets = (text.match(/\[/g) || []).length;
        const closeBrackets = (text.match(/\]/g) || []).length;
        const openBraces = (text.match(/\{/g) || []).length;
        const closeBraces = (text.match(/\}/g) || []).length;
        
        
        if (openBrackets > closeBrackets || openBraces > closeBraces) {
          
          
          for (let i = 0; i < (openBraces - closeBraces); i++) {
            fixedText += '}';
          }
          
          
          for (let i = 0; i < (openBrackets - closeBrackets); i++) {
            fixedText += ']';
          }
        }
        
        const colleges = JSON.parse(fixedText);
        
        if (Array.isArray(colleges) && colleges.length > 0) {
          console.log(`Successfully parsed ${colleges.length} colleges from Gemini AI`);
          
          
          const validColleges = colleges.filter(college => 
            college.name && 
            college.address && 
            college.coursesAvailable && 
            Array.isArray(college.coursesAvailable) &&
            college.fees &&
            Array.isArray(college.fees)
          ).map(college => ({
            ...college,
            contactDetails: college.contactDetails || {},
            type: college.type || 'Both'
          }));
          
          if (validColleges.length > 0) {
            console.log(`Returning ${validColleges.length} valid colleges`);
            return validColleges;
          }
        }
        
        throw new Error('No valid colleges found in response');
        
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        console.error('Response text length:', text.length);
        console.error('Response text preview:', text.substring(0, 500) + '...');
        
        
        return await this.searchCollegesSimple(location);
      }
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      
      
      return await this.searchCollegesSimple(location);
    }
  }

  private async searchCollegesSimple(location: string): Promise<College[]> {
    try {
      const prompt = `List 8 major IT/Management colleges in ${location}, India.
      
Return JSON array:
[{"name":"College","address":"Address","contactDetails":{"phone":"+91-xxx","email":"email","website":"url"},"coursesAvailable":["B.Tech","MBA"],"fees":[{"course":"B.Tech","amount":"150000"}],"type":"Both"}]

Keep response brief.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        text = jsonMatch[0];
      }
      
      const colleges = JSON.parse(text);
      
      if (Array.isArray(colleges) && colleges.length > 0) {
        return colleges.map(college => ({
          name: college.name || `College in ${location}`,
          address: college.address || `${location}, India`,
          contactDetails: {
            phone: college.phone || college.contactDetails?.phone || "Contact college directly",
            email: college.email || college.contactDetails?.email || "Not available",
            website: college.website || college.contactDetails?.website || "Not available"
          },
          coursesAvailable: college.courses || college.coursesAvailable || [
            "B.Tech Computer Science",
            "MBA",
            "BBA"
          ],
          fees: college.fees || [
            { course: "B.Tech", amount: "₹1,50,000 - ₹3,00,000 per year" },
            { course: "MBA", amount: "₹2,00,000 - ₹5,00,000 per year" }
          ],
          type: college.type || "Both"
        }));
      }
      
      throw new Error('No colleges found');
      
    } catch (error) {
      console.error('Simple search also failed:', error);
      throw new Error(`Unable to find colleges in ${location}. Please check your internet connection and API key, or try a different location.`);
    }
  }
}

export const geminiService = new GeminiCollegeService();
