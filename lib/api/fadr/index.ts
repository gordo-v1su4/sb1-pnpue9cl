import axios from 'axios';
import type { AnalysisResponse, SeparationResponse } from './types';

const FADR_API_URL = 'https://api.fadr.com/v1';

interface FadrConfig {
  apiKey: string;
}

export class FadrAPI {
  private apiKey: string;

  constructor(config: FadrConfig) {
    this.apiKey = config.apiKey;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async analyzeAudio(audioFile: File): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', audioFile);

    const response = await axios.post(
      `${FADR_API_URL}/analyze`,
      formData,
      { headers: this.headers }
    );

    return response.data;
  }

  async separateTracks(audioFile: File): Promise<SeparationResponse> {
    const formData = new FormData();
    formData.append('file', audioFile);

    const response = await axios.post(
      `${FADR_API_URL}/separate`,
      formData,
      { headers: this.headers }
    );

    return response.data;
  }

  async getAnalysisStatus(analysisId: string): Promise<AnalysisResponse> {
    const response = await axios.get(
      `${FADR_API_URL}/analyze/${analysisId}`,
      { headers: this.headers }
    );

    return response.data;
  }

  async getSeparationStatus(separationId: string): Promise<SeparationResponse> {
    const response = await axios.get(
      `${FADR_API_URL}/separate/${separationId}`,
      { headers: this.headers }
    );

    return response.data;
  }
}