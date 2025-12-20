
// Web Speech API
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;

// Vite / ImportMeta
interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
