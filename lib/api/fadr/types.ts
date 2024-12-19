export interface Asset {
  _id: string;
  name: string;
  key: string;
  uploadComplete: boolean;
  user: string;
  fileType: string;
  assetType: string;
  metaData: {
    stemType?: string;
    tempo?: number;
    key?: string;
    beats?: any[];
    length?: number;
    sampleRate?: number;
  };
  group: string;
  public: boolean;
  stems: string[];
  midi: string[];
}

export interface Task {
  _id: string;
  asset: string | Asset;
  user: string;
  type: string;
  api: boolean;
  stemQuality: string;
  stemNumber: number;
  status: {
    msg: string;
    progress: number;
    complete: boolean;
  };
  startDate: string;
  output: {
    assets: string[];
  };
}

export interface ApiResponse<T> {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: T;
}

export interface AnalysisResult {
  tempo: number;
  key: string;
  energy: number;
  vocals: number;
  instruments: number;
}

export interface SeparatedTracks {
  vocals: string;
  drums: string;
  bass: string;
  other: string;
}

export type AnalysisResponse = ApiResponse<AnalysisResult>;
export type SeparationResponse = ApiResponse<SeparatedTracks>;