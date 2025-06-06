import { setSpeak } from "@/redux/slice/authSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e: any) => {
      console.error("Speech recognition error", e);
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(finalTranscript);
        }
      }
    };

    recognitionRef.current = recognition;
  }, []);
  const startListening = () => {
    console.log('truuuuuuuuuuuuu');
    
    dispatch(setSpeak(true));
    recognitionRef.current?.start();
  };
  const stopListening = () => recognitionRef.current?.stop();

  return {
    transcript,
    listening,
    startListening,
    stopListening,
  };
};
