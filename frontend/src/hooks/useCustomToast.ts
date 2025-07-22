import { useState, useCallback } from 'react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const useCustomToast = () => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addMessage = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString();
    const newMessage: ToastMessage = { id, message, type };
    
    console.log(`Custom Toast: ${type.toUpperCase()} - ${message}`);
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const success = useCallback((message: string) => addMessage(message, 'success'), [addMessage]);
  const error = useCallback((message: string) => addMessage(message, 'error'), [addMessage]);
  const info = useCallback((message: string) => addMessage(message, 'info'), [addMessage]);
  const warning = useCallback((message: string) => addMessage(message, 'warning'), [addMessage]);

  return {
    messages,
    removeMessage,
    success,
    error,
    info,
    warning,
  };
};
