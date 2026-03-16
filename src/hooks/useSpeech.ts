import { useCallback, useState } from 'react'

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.volume = 1

    // Prefer an English voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && v.localService
    ) || voices.find((v) => v.lang.startsWith('en'))
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const isSupported = 'speechSynthesis' in window

  return { speak, stop, isSpeaking, isSupported }
}