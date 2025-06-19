import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Thought {
  id: string;
  content: string;
  category: string;
  timestamp: number;
}

const STORAGE_KEY = 'thoughts';

export class ThoughtStorage {
  static async getThoughts(): Promise<Thought[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading thoughts:', error);
      return [];
    }
  }

  static async saveThought(thought: Omit<Thought, 'id'>): Promise<void> {
    try {
      const thoughts = await this.getThoughts();
      const newThought: Thought = {
        ...thought,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      
      thoughts.unshift(newThought);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
    } catch (error) {
      console.error('Error saving thought:', error);
      throw error;
    }
  }

  static async deleteThought(id: string): Promise<void> {
    try {
      const thoughts = await this.getThoughts();
      const filteredThoughts = thoughts.filter(thought => thought.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredThoughts));
    } catch (error) {
      console.error('Error deleting thought:', error);
      throw error;
    }
  }

  static async updateThought(id: string, updates: Partial<Thought>): Promise<void> {
    try {
      const thoughts = await this.getThoughts();
      const index = thoughts.findIndex(thought => thought.id === id);
      
      if (index !== -1) {
        thoughts[index] = { ...thoughts[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
      }
    } catch (error) {
      console.error('Error updating thought:', error);
      throw error;
    }
  }
}