import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function VoiceChatButton() {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          speak(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClick = () => {
    if (!isActive && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const initialTop = rect.top;
      const initialLeft = rect.left;

      setButtonPosition({
        top: initialTop,
        left: initialLeft
      });

      setIsActive(true);

      // Animate to center after positioning is set
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setButtonPosition({
            top: window.innerHeight / 2 - 40,
            left: window.innerWidth / 2 - 40
          });
        });
      });

      setTimeout(() => {
        setIsListening(true);
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      }, 800);
    } else {
      setIsListening(false);
      setTranscript('');
      setButtonPosition(null);
      setIsActive(false);

    //   if(buttonRef.current){
    //     buttonRef.current.classList.add("animate-fade-in-down delay-200 opacity-0")
    //   }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const getButtonStyle = () => {
    if (!isActive || !buttonPosition) {
      return {};
    }

    return {
      position: 'fixed' as const,
      top: `${buttonPosition.top}px`,
      left: `${buttonPosition.left}px`,
    };
  };

  useEffect(() =>{
    if(isListening){
        setTimeout(() => {
                if (buttonRef.current) {
                  buttonRef.current.classList.add("animate-fade-out-up");
                }
        }, 200);
    }
  },[isListening])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={`
          z-50
          transition-all duration-700 ease-in-out
          ${isActive ? 'w-20 h-20' : 'w-14 h-14'}
          bg-gradient-to-br from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          rounded-full
          flex items-center justify-center
          shadow-lg hover:shadow-xl
          active:scale-95
        `}
        style={getButtonStyle()}
      >
        <Mic
          className={`
            text-white transition-all duration-500
            ${isActive ? (isListening ? 'w-0 h-0 opacity-0' : 'w-8 h-8') : 'w-6 h-6'}
          `}
        />
      </button>

      <div
        className={`
          fixed inset-0 z-40
          bg-gradient-to-br from-blue-500 to-blue-600
          transition-all duration-700 ease-in-out
          ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          flex items-center justify-center
        `}
        style={{
          transformOrigin: buttonRef.current
            ? `${buttonRef.current.getBoundingClientRect().left + buttonRef.current.getBoundingClientRect().width / 2}px ${buttonRef.current.getBoundingClientRect().top + buttonRef.current.getBoundingClientRect().height / 2}px`
            : 'center'
        }}
      >
        <Button onClick={handleClick} variant={'ghost'} className='fixed top-3 left-3 rounded-full'>X</Button>
        {isListening && (
          <div className="flex flex-col items-center gap-8">
            <SoundWave />
            {transcript && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 max-w-2xl">
                <p className="text-white text-xl text-center">{transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function SoundWave() {
  return (
    <div className="flex items-center gap-2 h-32">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2 bg-white rounded-full animate-sound-wave"
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}
