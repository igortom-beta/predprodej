import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Streamdown } from 'streamdown';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Bezpečné složení klíče, aby ho roboti hned nesežrali
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
  const apiKey = p1 + p2;

  const toggleListening = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.speechRecognition;
    if (!SpeechRecognition) return alert('Nepodporováno');
    const recognition = new SpeechRecognition();
    recognition.lang = 'cs-CZ';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => setInputValue(prev => prev + ' ' + e.results[0][0].transcript);
    isListening ? recognition.stop() : recognition.start();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: 'system', content: 'Jsi asistent pro Lojzovy Paseky. Cena 24tis/měsíc.' }, ...messages, { role: 'user', content: userMsg }]
        } )
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Chyba připojení.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 z-50 bg-[#22c55e] text-white p-4 rounded-full shadow-lg"><MessageCircle /></button>
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] flex flex-col bg-white border-2 border-[#22c55e] z-50">
          <div className="bg-[#22c55e] text-white p-4 font-bold">Lojzovy Paseky AI</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>{msg.content}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
            <Button type="button" onClick={toggleListening} className={isListening ? 'bg-red-500' : 'bg-gray-200'}><Mic size={18} /></Button>
            <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1" />
            <Button type="submit">Poslat</Button>
          </form>
        </Card>
      )}
    </>
  );
}
