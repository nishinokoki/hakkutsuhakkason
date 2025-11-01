import React, { useState, useRef, useCallback } from 'react';
import { TextBoxComponent } from './TextBoxComponent.jsx';
import { AnswerBoxComponent } from './AnswerBoxComponent.jsx';
import { QuestionSelectorComponent } from './QuestionSelectorComponent.jsx';
import { LoadingIndicator } from './components/LoadingIndicator.jsx';
import { MovieComponent } from './MovieComponent.js';
import { CharacterMoveComponent } from './CharacterMoveComponent.js';
import { ApiService, AudioUtils } from './services/apiService.js';
import { delay, ensureAudioContext, setElementDisabled } from './utils/helpers.js';
import {
  CHARACTER_IMAGES,
  CHARACTER_POSITIONS,
  PRESET_QUESTIONS,
  ANIMATION_CONFIG,
} from './config/constants.js';

/**
 * メインアプリケーションコンポーネント（React）
 */
export const App = () => {
  // 状態管理
  const [currentFeelingId, setCurrentFeelingId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Refs
  const textBoxRef = useRef(null);
  const answerBoxRef = useRef(null);
  const audioContextRef = useRef(null);
  const movieRef = useRef(null);
  const characterRef = useRef(null);
  const appContainerRef = useRef(null);

  // 質問を選択したときのハンドラ
  const handleQuestionSelect = useCallback((question) => {
    if (textBoxRef.current) {
      textBoxRef.current.setValue(question);
      const textarea = textBoxRef.current.getTextarea();
      if (textarea) textarea.focus();
    }
  }, []);

  // 送信処理
  const handleSend = useCallback(async () => {
    if (isSending) return;

    console.log('送信ボタンがクリックされました');
    setIsSending(true);
    setIsLoading(true);

    // 動画をリセット
    if (movieRef.current) {
      movieRef.current.stop();
    }

    try {
      // AudioContextの準備
      audioContextRef.current = ensureAudioContext(audioContextRef.current);

      // メッセージを取得
      const message = textBoxRef.current?.getValue() || '';
      
      // API送信
      const data = await ApiService.sendQuestion(message, ANIMATION_CONFIG.CHARACTER_SHAKE_SPEED);

      if (data) {
        const { answer, videoUrl, videoStart, voiceLength, feelingId, audioData } = data;
        console.log('feelingId:', feelingId);

        // キャラクター表情の更新
        if (feelingId !== undefined && feelingId !== currentFeelingId && characterRef.current) {
          characterRef.current.showCharacter(
            CHARACTER_IMAGES[currentFeelingId],
            CHARACTER_IMAGES[feelingId],
            CHARACTER_POSITIONS[currentFeelingId],
            CHARACTER_POSITIONS[feelingId]
          );
          setCurrentFeelingId(feelingId);
        }

        // 音声再生
        if (audioData && audioContextRef.current) {
          AudioUtils.playAudio(audioData, audioContextRef.current, 3.0);
        }

        // 回答をアニメーション表示
        if (answerBoxRef.current) {
          answerBoxRef.current.setValueAnimated(answer, ANIMATION_CONFIG.ANSWER_DELAY_PER_CHAR);
        }

        // キャラクターを揺らす
        if (characterRef.current) {
          characterRef.current.startShaking();
          await delay(answer.length * ANIMATION_CONFIG.ANSWER_DELAY_PER_CHAR);
          characterRef.current.stopShaking();
        }

        // 動画を再生
        if (movieRef.current) {
          movieRef.current.play(videoUrl, videoStart);
        }
      }
    } catch (error) {
      console.error('送信エラー:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
      setIsSending(false);
    }
  }, [isSending, currentFeelingId]);

  // キャラクターの初期化（useEffectの代わりにrefコールバックを使用）
  const handleAppContainerRef = useCallback((node) => {
    if (node && !characterRef.current) {
      appContainerRef.current = node;
      const character = new CharacterMoveComponent(node);
      character.showCharacter(
        CHARACTER_IMAGES[0],
        null,
        CHARACTER_POSITIONS[0]
      );
      character.setPosition(-90, 0);
      characterRef.current = character;
    }
  }, []);

  // Movieの初期化
  const handleMovieRef = useCallback((node) => {
    if (node && !movieRef.current) {
      const movie = new MovieComponent();
      node.appendChild(movie.getElement());
      movieRef.current = movie;
    }
  }, []);

  return (
    <div ref={handleAppContainerRef}>
      <h1></h1>
      
      <div id="controls">
        <QuestionSelectorComponent 
          questions={PRESET_QUESTIONS} 
          onSelect={handleQuestionSelect}
        />
      </div>

      <div id="text-box">
        <AnswerBoxComponent ref={answerBoxRef} />
        <TextBoxComponent ref={textBoxRef} />
        <div ref={handleMovieRef}></div>
      </div>

      <LoadingIndicator show={isLoading} />

      <div id="send-button2">
        <button
          id="send-button"
          type="button"
          onClick={handleSend}
          disabled={isSending}
          style={{
            opacity: isSending ? 0.6 : 1,
            cursor: isSending ? 'not-allowed' : 'pointer'
          }}
        >
          送信
        </button>
      </div>
    </div>
  );
};
