import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ReservationData {
  name?: string;
  email?: string;
  phone?: string;
  startDate?: string;
  months?: number;
  language?: string;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function AIReservationWidget() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({});
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const languageGreetings: Record<string, string> = {
    cs: 'Ahoj! 👋 Jak ti mohu pomoci s rezervací bungalovu?',
    de: 'Hallo! 👋 Wie kann ich dir bei der Buchung eines Bungalows helfen?',
    fr: 'Bonjour! 👋 Comment puis-je vous aider avec la réservation d\'un bungalow?',
    es: '¡Hola! 👋 ¿Cómo puedo ayudarte con la reserva de un bungalow?',
    en: 'Hello! 👋 How can I help you with a bungalow reservation?'
  };

  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Scroll error:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = languageGreetings[language] || languageGreetings['cs'];
      setMessages([{
        id: '1',
        text: greeting,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        if (recordingTimer) {
          clearTimeout(recordingTimer);
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      const aiResponse = await generateAIResponse(inputValue, language, reservationData);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setReservationData(prev => ({ ...prev, ...aiResponse.extractedData }));
    } catch (error) {
      console.error('Send message error:', error);
      const errorMessages: Record<string, string> = {
        cs: 'Omlouvám se, došlo k chybě. Zkus to prosím znovu.',
        de: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        en: 'Sorry, an error occurred. Please try again.',
        fr: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        es: 'Lo siento, ocurrió un error. Por favor, inténtelo de nuevo.'
      };
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: errorMessages[language] || errorMessages['cs'],
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    try {
      // Check if Speech Recognition is supported
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        console.error('Speech Recognition not supported');
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'cs' ? 'cs-CZ' : 
                        language === 'de' ? 'de-DE' :
                        language === 'fr' ? 'fr-FR' :
                        language === 'es' ? 'es-ES' : 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        try {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setInputValue(transcript);
        } catch (error) {
          console.error('Recognition result error:', error);
        }
      };

      recognition.onerror = (event: Event) => {
        console.error('Recognition error:', event);
        stopRecording();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);

      // Auto-send after 7 seconds
      const timer = setTimeout(() => {
        stopRecording();
        if (inputValue.trim()) {
          handleSendMessage(new Event('submit') as any);
        }
      }, 7000);
      
      setRecordingTimer(timer);
    } catch (error) {
      console.error('Start recording error:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (recordingTimer) {
        clearTimeout(recordingTimer);
        setRecordingTimer(null);
      }
      setIsRecording(false);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const generateAIResponse = async (
    userInput: string,
    lang: string,
    currentData: ReservationData
  ): Promise<{ text: string; extractedData: ReservationData }> => {
    try {
      // Placeholder - in production, call Manus AI API
      const responses: Record<string, Record<string, string>> = {
        cs: {
          greeting: 'Rád ti pomůžu! Jaké máš požadavky na pronájem?',
          contact: 'Můžeš nás kontaktovat na lojzovky.lipno@gmail.com nebo zavolat.',
          confirmation: 'Rozumím. Pronajmout si chceš bungalov od {date} na {months} měsíců. Kontaktujeme tě brzy!'
        },
        de: {
          greeting: 'Gerne helfe ich dir! Was sind deine Anforderungen?',
          contact: 'Sie können uns unter lojzovky.lipno@gmail.com kontaktieren.',
          confirmation: 'Verstanden. Du möchtest einen Bungalow vom {date} für {months} Monate mieten. Wir kontaktieren dich bald!'
        },
        en: {
          greeting: 'I\'d be happy to help! What are your requirements?',
          contact: 'You can contact us at lojzovky.lipno@gmail.com.',
          confirmation: 'I understand. You want to rent from {date} for {months} months. We\'ll contact you soon!'
        },
        fr: {
          greeting: 'Je serais ravi de vous aider! Quelles sont vos exigences?',
          contact: 'Vous pouvez nous contacter à lojzovky.lipno@gmail.com.',
          confirmation: 'Je comprends. Vous voulez louer à partir du {date} pour {months} mois. Nous vous contacterons bientôt!'
        },
        es: {
          greeting: '¡Estaré encantado de ayudarte! ¿Cuáles son tus requisitos?',
          contact: 'Puedes contactarnos en lojzovky.lipno@gmail.com.',
          confirmation: 'Entiendo. Quieres alquilar desde {date} por {months} meses. ¡Te contactaremos pronto!'
        }
      };

      const extractedData: ReservationData = { ...currentData };
      
      // Extract dates
      const dateMatch = userInput.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
      if (dateMatch) {
        extractedData.startDate = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
      }

      // Extract duration
      const durationMatch = userInput.match(/(\d+)\s*(měsíc|mesiac|monat|mois|mes|month)/i);
      if (durationMatch) {
        extractedData.months = parseInt(durationMatch[1]);
      }

      let responseText = responses[lang]?.greeting || responses['cs'].greeting;
      
      if (userInput.toLowerCase().includes('kontakt') || userInput.toLowerCase().includes('email') || userInput.toLowerCase().includes('contact')) {
        responseText = responses[lang]?.contact || responses['cs'].contact;
      }

      return {
        text: responseText,
        extractedData
      };
    } catch (error) {
      console.error('Generate AI response error:', error);
      return {
        text: languageGreetings[lang] || languageGreetings['cs'],
        extractedData: currentData
      };
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#6B8E6F] text-white p-4 rounded-full shadow-lg hover:bg-[#5a7a5f] transition-colors"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-24px)] h-[500px] max-h-[calc(100vh-200px)] flex flex-col bg-white border-2 border-[#6B8E6F] shadow-2xl rounded-lg z-50">
          {/* Header */}
          <div className="bg-[#6B8E6F] text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">🤖 AI Rezervační asistent</h3>
            <p className="text-sm text-gray-200">Lojzovy Paseky</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-[#6B8E6F] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-[#6B8E6F] rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-[#6B8E6F] px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#6B8E6F] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#6B8E6F] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#6B8E6F] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-[#6B8E6F] p-4 bg-white rounded-b-lg flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={language === 'cs' ? 'Napiš zprávu...' : 'Type a message...'}
              className="flex-1 border-[#6B8E6F] border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
              disabled={isLoading || isRecording}
            />
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              disabled={isLoading}
            >
              <Mic size={20} className={isRecording ? 'text-white' : 'text-gray-600'} />
            </button>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#6B8E6F] hover:bg-[#5a7a5f] text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
