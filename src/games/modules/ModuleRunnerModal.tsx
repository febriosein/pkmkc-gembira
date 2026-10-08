import React, { useState, useEffect, useRef } from 'react';
import { Volume2, X, Sparkles, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { ChildProfile, DifficultyLevel } from '../../types';
import { ModuleItem, ModuleQuestion } from '../../data/modulesData';
import { storage } from '../../services/storage';
import { audio } from '../../services/audio';
import { questionPool } from '../../services/questionPool';
import { ResultSummaryModal } from '../../components/game/ResultSummaryModal';

interface ModuleRunnerModalProps {
  child: ChildProfile;
  module: ModuleItem;
  difficulty?: DifficultyLevel;
  onExit: () => void;
  onCoinsUpdated: (newCoins: number) => void;
}

export const ModuleRunnerModal: React.FC<ModuleRunnerModalProps> = ({
  child,
  module,
  difficulty = 'mudah',
  onExit,
  onCoinsUpdated,
}) => {
  const multiplier = questionPool.getDifficultyMultiplier(difficulty);
  const diffInfo = questionPool.getDifficultyInfo(difficulty);

  const getCandidateQuestions = (): ModuleQuestion[] => {
    const matched = module.questions.filter(q => q.difficulty === difficulty);
    const pool = matched.length > 0 ? matched : module.questions;
    return questionPool.getFreshQuestions(pool, child.id, `mod_${module.id}_${difficulty}`, 3);
  };

  const [sessionQuestions, setSessionQuestions] = useState<ModuleQuestion[]>(() => getCandidateQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [explanationText, setExplanationText] = useState<string>('');
  const [correctCount, setCorrectCount] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionId] = useState(() => 'sess-mod-' + module.id + '-' + Date.now());

  const questionStartTimeRef = useRef(Date.now());
  const currentQuestion = sessionQuestions[currentQuestionIndex];

  // Auto speech narration when question loads
  useEffect(() => {
    if (!currentQuestion) return;
    questionStartTimeRef.current = Date.now();
    setSelectedOptionId(null);
    setIsAnswerCorrect(null);
    setExplanationText('');
    audio.speak(currentQuestion.speechText);

    return () => {
      audio.stopSpeech();
    };
  }, [currentQuestionIndex, currentQuestion]);

  const handleSelectOption = (option: any) => {
    if (selectedOptionId !== null || isFinished) return;

    const responseMs = Date.now() - questionStartTimeRef.current;
    const isCorrect = option.isCorrect;

    setSelectedOptionId(option.id);
    setIsAnswerCorrect(isCorrect);
    setExplanationText(option.explanation || (isCorrect ? 'Jawabanmu benar sekali!' : 'Yuk coba lagi!'));

    // Record attempt for parents accuracy analytics
    storage.recordAttempt({
      sessionId,
      childId: child.id,
      questionId: currentQuestion.id,
      domain: module.domain,
      userAnswer: option.label,
      isCorrect,
      responseMs,
      clientEventId: 'evt-mod-' + Date.now() + '-' + option.id,
    });

    if (isCorrect) {
      audio.playSuccess();
      setScore(prev => prev + 20);
      setCorrectCount(prev => prev + 1);

      // Award coins scaled by difficulty multiplier
      const baseReward = 15;
      const coinReward = Math.round(baseReward * multiplier);
      if (storage.canRewardQuestion(sessionId, currentQuestion.id)) {
        const newBalance = storage.recordCoinDelta(child.id, coinReward, `${module.title} (${diffInfo.label}): Jawaban Benar`, sessionId);
        setCoinsEarned(prev => prev + coinReward);
        onCoinsUpdated(newBalance);
      }
    } else {
      audio.playGentleBoing();
      setTimeout(() => {
        setSelectedOptionId(null);
        setIsAnswerCorrect(null);
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    audio.playClick();
    if (currentQuestionIndex + 1 >= sessionQuestions.length) {
      finishSession();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const finishSession = () => {
    setIsFinished(true);

    const bonus = Math.round(25 * multiplier);
    const newBalance = storage.recordCoinDelta(child.id, bonus, `Bonus Selesai Modul ${module.moduleNumber} (${diffInfo.label})`, sessionId);
    setCoinsEarned(prev => prev + bonus);
    onCoinsUpdated(newBalance);

    const accuracy = sessionQuestions.length > 0 ? (correctCount / sessionQuestions.length) : 0;
    let stars = 1;
    if (accuracy >= 0.8) stars = 3;
    else if (accuracy >= 0.5) stars = 2;

    storage.recordCompletedSession({
      childId: child.id,
      gameId: module.id as any,
      domain: module.domain,
      startedAt: new Date(Date.now() - 30000).toISOString(),
      score,
      stars,
      coinsEarned: coinsEarned + bonus,
      totalQuestions: sessionQuestions.length,
      correctCount,
    });
  };

  const handlePlayAgain = () => {
    const freshQs = getCandidateQuestions();
    setSessionQuestions(freshQs);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerCorrect(null);
    setExplanationText('');
    setScore(0);
    setCorrectCount(0);
    setCoinsEarned(0);
    setIsFinished(false);
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between py-2">
      {/* Header bar */}
      <div className={`bg-white/95 rounded-3xl p-4 border-2 ${module.borderColor} shadow-md flex items-center justify-between mb-4`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audio.playClick();
              onExit();
            }}
            className="w-9 h-9 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
            title="Keluar ke Daftar Modul"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base text-gemdark flex items-center gap-1.5">
                <span>{module.icon} Modul {module.moduleNumber}: {module.title}</span>
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${diffInfo.badge}`}>
                {diffInfo.label} • ×{multiplier}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              Pertanyaan {currentQuestionIndex + 1} dari {sessionQuestions.length} • {module.subtitle}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> +{coinsEarned} Koin
        </div>
      </div>

      {/* Main Question Card */}
      <div className={`flex-1 ${module.bgLight} rounded-3xl border-4 border-white shadow-xl p-6 sm:p-8 flex flex-col items-center justify-between text-center relative`}>
        {/* Media / Visual Illustration Area */}
        {currentQuestion.media && (
          <div className="my-2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-3 border-purple-200 flex items-center justify-center text-5xl sm:text-6xl shadow-md mx-auto animate-float">
              {currentQuestion.media.value.length <= 4 ? currentQuestion.media.value : module.icon}
            </div>
            {currentQuestion.media.value.length > 4 && (
              <div className="mt-2 text-xs font-black text-gemdark bg-white/80 px-3 py-1 rounded-full border border-gray-200 inline-block">
                {currentQuestion.media.value}
              </div>
            )}
          </div>
        )}

        {/* Prompt with speaker button */}
        <div className="bg-white/95 backdrop-blur-md px-5 py-4 rounded-3xl border-2 border-gray-200 shadow-sm max-w-lg w-full my-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Pertanyaan Belajar:</span>
            <button
              onClick={() => audio.speak(currentQuestion.speechText)}
              className="p-1 rounded-full bg-purple-50 hover:bg-purple-100 text-gempurple transition-colors"
              title="Dengarkan Pertanyaan"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-base sm:text-lg font-black text-gemdark leading-snug">
            {currentQuestion.prompt}
          </h4>
        </div>

        {/* Feedback message banner if answered */}
        {isAnswerCorrect !== null && (
          <div className={`w-full max-w-lg p-3 rounded-2xl text-xs font-black flex items-center justify-between gap-2 my-2 animate-in fade-in ${
            isAnswerCorrect ? 'bg-emerald-100 text-gemgreen border border-emerald-300' : 'bg-red-100 text-red-600 border border-red-300 animate-wiggle'
          }`}>
            <div className="flex items-center gap-2 text-left">
              {isAnswerCorrect ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <HelpCircle className="w-5 h-5 flex-shrink-0" />}
              <span>{explanationText}</span>
            </div>
            {isAnswerCorrect && (
              <button
                onClick={handleNextQuestion}
                className="px-3.5 py-1.5 bg-gemgreen text-white rounded-xl font-black text-xs hover:bg-emerald-600 transition-colors flex items-center gap-1 shadow-sm flex-shrink-0"
              >
                Lanjut <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Options grid */}
        <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
          {currentQuestion.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={selectedOptionId !== null && isAnswerCorrect === true}
                className={`p-4 rounded-2xl border-3 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all gem-card-hover gem-btn-press shadow-sm ${
                  isSelected && isAnswerCorrect
                    ? 'border-gemgreen bg-emerald-100 text-gemgreen ring-2 ring-emerald-300 scale-102'
                    : isSelected && !isAnswerCorrect
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-gray-200 bg-white hover:border-gempurple hover:bg-purple-50 text-gemdark'
                }`}
              >
                {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-gray-500 font-bold mt-2">
          💡 Setiap jawaban benar memperoleh <strong className="text-amber-600">+15 Koin Bintang</strong>!
        </div>
      </div>

      {/* Result Summary Modal */}
      <ResultSummaryModal
        isOpen={isFinished}
        gameTitle={`Modul ${module.moduleNumber}: ${module.title}`}
        score={score}
        stars={correctCount === sessionQuestions.length ? 3 : correctCount > 0 ? 2 : 1}
        coinsEarned={coinsEarned}
        correctCount={correctCount}
        totalQuestions={sessionQuestions.length}
        onPlayAgain={handlePlayAgain}
        onBackToMap={onExit}
      />
    </div>
  );
};
