export interface Prediction {
  class_name: string;
  class_index: number;
  confidence: number;
}

export interface ModelResult {
  predictions: Prediction[];
  inference_time_ms: number;
}

export interface PredictResponse extends ModelResult {
  model: string;
}

export interface CompareResponse {
  results: Record<string, ModelResult>;
}

export interface AttackScenario {
  attack: string;
  epsilon: number;
  image_b64: string;
  predictions: Record<string, ModelResult>;
}

export interface RobustnessResponse {
  clean: {
    image_b64: string;
    predictions: Record<string, ModelResult>;
  };
  scenarios: AttackScenario[];
  true_label: string;
  models_used: string[];
}

export interface HealthResponse {
  status: string;
  version: string;
  device: string;
  models: Record<string, boolean>;
}

export type AppMode = "compare" | "robustness";
export type AppStatus = "idle" | "predicting" | "done" | "error";
