import axios from 'axios';

const FADR_API_URL = 'https://api.fadr.com/v1';

interface FadrConfig {
  apiKey: string;
}

interface AnalysisResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: {
    tempo: number;
    key: string;
    energy: number;
    vocals: number;
    instruments: number;
  };
}

interface SeparationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tracks?: {
    vocals: string;
    drums: string;
    bass: string;
    other: string;
  };
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