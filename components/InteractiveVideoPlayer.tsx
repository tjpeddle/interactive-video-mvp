'use client';

import { useRef, useState, useEffect } from 'react';

interface Question {
  id: string;
  timestamp: number;
  question: string;
  options: Array<{
    id: string;
    text: string;
    correct: boolean;
  }>;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

interface InteractiveVideoPlayerProps {
  videoUrl: string;
  captionsUrl?: string;
  questions: Question[];
}

export default function InteractiveVideoPlayer({
  videoUrl,
  captionsUrl,
  questions
}: InteractiveVideoPlayerProps) {
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastCheckTimeRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  
  const [isZoomed, setIsZoomed] = useState(false);
  
  useEffect(() => {
    if (currentTime >= 15 && currentTime < 15.5 && !isZoomed) {
      setIsZoomed(true);
    } else if (currentTime >= 20 && isZoomed) {
      setIsZoomed(false);
    }
  }, [currentTime, isZoomed]);
  
  useEffect(() => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      if (tracks.length > 0) {
        tracks[0].mode = captionsEnabled ? 'showing' : 'hidden';
      }
    }
  }, [captionsEnabled]);
  
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    
    if (Math.floor(time) !== Math.floor(lastCheckTimeRef.current)) {
      lastCheckTimeRef.current = time;
      
      const pendingQuestion = questions.find(q => {
        const atTimestamp = Math.floor(time) === Math.floor(q.timestamp);
        const notAnswered = !answeredQuestions.has(q.id);
        return atTimestamp && notAnswered;
      });
      
      if (pendingQuestion) {
        videoRef.current.pause();
        setIsPlaying(false);
        setActiveQuestion(pendingQuestion);
      }
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answerId);
  };
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !activeQuestion) return;
    
    const selectedOption = activeQuestion.options.find(opt => opt.id === selectedAnswer);
    const correct = selectedOption?.correct || false;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setAnsweredQuestions(prev => new Set(prev).add(activeQuestion.id));
      
      setTimeout(() => {
        setActiveQuestion(null);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsCorrect(null);
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }, 2000);
    }
  };
  
  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
  };
  
  const handleCaptionsToggle = () => {
    setCaptionsEnabled(prev => !prev);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      
      <div className={`relative transition-transform duration-1000 ease-in-out ${isZoomed ? 'scale-125' : 'scale-100'}`}>
        <video
          ref={videoRef}
          className="w-full aspect-video cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={handlePlayPause}
        >
          <source src={videoUrl} type="video/mp4" />
          
          {captionsUrl && (
            <track
              kind="captions"
              src={captionsUrl}
              srcLang="en"
              label="English"
              default
            />
          )}
        </video>
      </div>
      
      {activeQuestion && (
        <div 
          className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 animate-fadeIn"
          role="dialog"
          aria-labelledby="question-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 animate-slideUp">
            
            <h2 id="question-title" className="text-2xl font-bold mb-6 text-gray-900">
              {activeQuestion.question}
            </h2>
            
            <div className="space-y-3 mb-6" role="group" aria-label="Answer options">
              {activeQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const showCorrect = showFeedback && option.correct;
                const showIncorrect = showFeedback && isSelected && !option.correct;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showFeedback}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${isSelected && !showFeedback ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                      ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                      ${showIncorrect ? 'border-red-500 bg-red-50' : ''}
                      ${!showFeedback ? 'hover:border-blue-400 hover:bg-blue-50 cursor-pointer' : 'cursor-not-allowed'}
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    `}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      {showCorrect && <span className="text-green-600 font-bold">✓</span>}
                      {showIncorrect && <span className="text-red-600 font-bold">✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {showFeedback && (
              <div 
                className={`p-4 rounded-lg mb-6 border-l-4 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-500 text-green-900' 
                    : 'bg-red-50 border-red-500 text-red-900'
                }`}
                role="alert"
                aria-live="polite"
              >
                <p className="font-semibold mb-1">
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="text-sm">
                  {isCorrect ? activeQuestion.feedback.correct : activeQuestion.feedback.incorrect}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              {!showFeedback && (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              )}
              
              {showFeedback && !isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              )}
              
              {isCorrect && (
                <p className="text-sm text-gray-600 italic">
                  Video will continue in 2 seconds...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 text-white p-4">
        
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label={`Video progress: ${formatTime(currentTime)} of ${formatTime(duration)}`}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          
          <button
            onClick={handleCaptionsToggle}
            className={`px-4 py-2 rounded transition-colors ${
              captionsEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
            }`}
            aria-label={`Captions ${captionsEnabled ? 'enabled' : 'disabled'}`}
            aria-pressed={captionsEnabled}
          >
            CC {captionsEnabled ? 'On' : 'Off'}
          </button>
          
          {isZoomed && (
            <span className="text-sm text-yellow-400 animate-pulse">
              🔍 Zoom Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}