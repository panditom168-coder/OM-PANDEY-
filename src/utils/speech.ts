/**
 * Speech utilities for Voice Input (STT) and Voice Audio Reader (TTS)
 * Specifically optimized for Hindi (hi-IN) with fallback for English
 */

type SpeechCallback = (status: 'started' | 'paused' | 'resumed' | 'ended' | 'error', text?: string) => void;

class SpeechManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<SpeechCallback> = new Set();
  public isSpeaking: boolean = false;
  public isPaused: boolean = false;
  public currentText: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded in browser
      };
    }
  }

  public subscribe(cb: SpeechCallback) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(status: 'started' | 'paused' | 'resumed' | 'ended' | 'error', text?: string) {
    this.listeners.forEach((cb) => cb(status, text));
  }

  public speak(text: string, lang: string = 'hi', rate: number = 0.9) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      this.notify('error', 'आवाज की सुविधा इस ब्राउज़र में उपलब्ध नहीं है।');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map supported codes
    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      bho: 'hi-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      pa: 'pa-IN',
      en: 'en-IN',
    };

    utterance.lang = langMap[lang] || 'hi-IN';
    utterance.rate = rate; // Configurable speech rate
    utterance.pitch = 1.0;

    // Pick best available voice if found
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang.startsWith(lang.slice(0, 2)) ||
        v.name.toLowerCase().includes(lang.toLowerCase()) ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('india')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.currentText = text;
      this.notify('started', text);
    };

    utterance.onpause = () => {
      this.isPaused = true;
      this.notify('paused', text);
    };

    utterance.onresume = () => {
      this.isPaused = false;
      this.notify('resumed', text);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentText = '';
      this.notify('ended');
    };

    utterance.onerror = (e) => {
      // Ignore if user cancelled
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.error('Speech synthesis error:', e);
        this.notify('error', 'आवाज प्लेबैक में त्रुटि आई।');
      }
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentText = '';
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause();
      this.isPaused = true;
      this.notify('paused', this.currentText);
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
      this.notify('resumed', this.currentText);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentText = '';
      this.notify('ended');
    }
  }
}

export const speechSpeaker = new SpeechManager();

/**
 * Speech-to-Text Recognition Hook/Helper
 */
export interface VoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  lang?: 'hi-IN' | 'en-IN';
}

export class VoiceRecognition {
  private recognition: any = null;
  public isListening: boolean = false;

  constructor(private props: VoiceRecognitionProps) {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = props.lang || 'hi-IN';

        this.recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript;
          }
          this.props.onResult(fullTranscript);
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          this.isListening = false;
          if (this.props.onError) {
            this.props.onError(event.error);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.props.onEnd) {
            this.props.onEnd();
          }
        };
      }
    }
  }

  public start() {
    if (!this.recognition) {
      if (this.props.onError) {
        this.props.onError('इस ब्राउज़र में माइक्रोफोन वॉइस टाइपिंग समर्थित नहीं है।');
      }
      return;
    }
    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.warn('Recognition start failed or already active:', e);
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn(e);
      }
      this.isListening = false;
    }
  }
}
