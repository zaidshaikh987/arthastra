"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, X, Globe, Volume2, VolumeX, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVoiceAssistant } from "@/lib/voice-assistant-context"

export default function VoiceAssistantButton() {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    isListening,
    isSpeaking,
    language,
    voiceEnabled,
    transcript,
    isFormMode,
    registeredFields,
    currentFieldIndex,
    chatMessages,
    isOpen,
    setLanguage,
    setVoiceEnabled,
    startListening,
    stopListening,
    stopSpeaking,
    startFormFilling,
    stopFormFilling,
    setIsOpen,
  } = useVoiceAssistant()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      if (isSpeaking) stopSpeaking()
      startListening()
    }
  }

  const handleStartFilling = () => {
    if (!isFormMode && registeredFields.length > 0) {
      startFormFilling()
    } else if (isFormMode) {
      stopFormFilling()
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all ${
              isFormMode
                ? "bg-gradient-to-br from-red-500 to-rose-600"
                : "bg-gradient-to-br from-violet-500 to-purple-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6 text-white" />
            {isFormMode && (
              <span className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-50" />
            )}
            {isListening && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-24 z-50 w-[360px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                    <Mic className="w-5 h-5 text-white" />
                    {isListening && (
                      <span className="absolute inset-0 rounded-full border-2 border-white animate-ping" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {language === "en" ? "Voice Form Assistant" : "वॉइस फॉर्म असिस्टेंट"}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {isFormMode
                        ? `${currentFieldIndex + 1}/${registeredFields.length} ${language === "en" ? "fields" : "फील्ड"}`
                        : isListening
                          ? language === "en"
                            ? "Listening..."
                            : "सुन रहा हूं..."
                          : language === "en"
                            ? "Click mic to speak"
                            : "बोलने के लिए माइक दबाएं"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages - Compact view */}
            <div className="flex-1 max-h-[300px] overflow-y-auto p-3 space-y-2 bg-gray-50">
              {chatMessages.slice(-8).map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      message.role === "user"
                        ? "bg-violet-600 text-white rounded-br-md"
                        : message.type === "question"
                          ? "bg-gradient-to-br from-violet-50 to-purple-50 text-gray-800 border border-violet-200 rounded-bl-md"
                          : message.type === "confirmation"
                            ? "bg-green-50 text-green-800 border border-green-200 rounded-bl-md"
                            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isListening && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-2xl rounded-bl-md text-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    {transcript || (language === "en" ? "Listening..." : "सुन रहा हूं...")}
                  </div>
                </motion.div>
              )}

              {isSpeaking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-2xl rounded-bl-md text-sm flex items-center gap-2">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    {language === "en" ? "Speaking..." : "बोल रहा हूं..."}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-gray-100 bg-white">
              {/* Start filling button */}
              {registeredFields.length > 0 && (
                <button
                  onClick={handleStartFilling}
                  className={`w-full mb-3 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${
                    isFormMode
                      ? "bg-red-50 hover:bg-red-100 border border-red-200"
                      : "bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 border border-violet-200"
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isFormMode ? "text-red-600" : "text-violet-600"}`} />
                  <span className={`font-medium text-sm ${isFormMode ? "text-red-700" : "text-violet-700"}`}>
                    {isFormMode
                      ? language === "en"
                        ? "Stop Voice Filling"
                        : "वॉइस भरना बंद करें"
                      : language === "en"
                        ? "Start Auto Form Filling"
                        : "ऑटो फॉर्म भरना शुरू करें"}
                  </span>
                </button>
              )}

              {/* Mic button */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMicClick}
                  className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all flex-shrink-0 ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                  }`}
                >
                  {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </motion.button>

                <div className="flex-1 text-center">
                  <p className="text-sm text-gray-600">
                    {isListening
                      ? language === "en"
                        ? "Speak now..."
                        : "अब बोलें..."
                      : language === "en"
                        ? "Click mic or say your answer"
                        : "माइक दबाएं या जवाब बोलें"}
                  </p>
                </div>

                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  {language === "en" ? "EN" : "हिं"}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                {language === "en"
                  ? 'Say "help" for commands • "next step" to continue'
                  : '"मदद" बोलें कमांड के लिए • "अगला चरण" आगे बढ़ने के लिए'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
