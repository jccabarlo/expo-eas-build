// Mock OCR service for demonstration
// In a real app, you would integrate with services like:
// - Google Cloud Vision API
// - AWS Textract
// - Azure Computer Vision
// - Tesseract.js for client-side OCR

export class OCRService {
  static async extractTextFromImage(imageUri: string): Promise<string> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted text based on common scenarios
    const mockTexts = [
      "The only way to do great work is to love what you do. Stay hungry, stay foolish.",
      "Innovation distinguishes between a leader and a follower. Think different.",
      "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The mind is everything. What you think you become.",
      "Strive not to be a success, but rather to be of value.",
      "Life is what happens to you while you're busy making other plans.",
      "The future belongs to those who believe in the beauty of their dreams."
    ];
    
    // Return a random mock text
    const randomIndex = Math.floor(Math.random() * mockTexts.length);
    return mockTexts[randomIndex];
  }

  static async extractTextFromDocument(documentUri: string): Promise<string> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return "This is extracted text from a document. In a real implementation, this would use OCR services to extract actual text from PDF or other document formats.";
  }
}