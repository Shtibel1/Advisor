'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MdClose, MdSend } from 'react-icons/md'
import { IoChatbubblesOutline } from 'react-icons/io5'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'assistant',
  content: 'שלום! אני מאיה 👋 עוזרת האישית של נדב. אשמח לענות על שאלות ולעזור לך להבין איך AI יכול לשדרג את העסק שלך. במה אני יכולה לעזור?',
}

const QUICK_ACTIONS: { label: string; answer: string }[] = [
  {
    label: 'מה השירותים שלכם?',
    answer: `אנחנו מציעים שלושה פתרונות עיקריים:

1. 🧠 סוכן ידע ארגוני – AI שמחפש ועונה על שאלות לפי המסמכים של החברה שלך, ומחליף עובד תמיכה שלם.
2. 💬 צ'אט-בוט חכם לאתר או WhatsApp – בדיוק כמוני, משרת לקוחות 24/7.
3. 📊 דוחות אוטומטיים – הפקת דוחות BI מ-CSV או מאגר נתונים בלחיצת כפתור.

רוצה לשמוע יותר על אחד מהם?`,
  },
  {
    label: 'כמה זה עולה?',
    answer: `המחיר תלוי בהיקף הפרויקט ובמה שהעסק שלך צריך — אין תעריף אחד לכולם.

הדרך הכי טובה לקבל מספר מדויק היא לשוחח עם נדב קצר. אפשר למלא את הטופס בדף ונחזור אליך תוך 24 שעות 🙂`,
  },
  {
    label: 'תנו לי דוגמה ממשית',
    answer: `בטח! הנה דוגמה אמיתית:

חברת שירות עם 3 נציגי תמיכה קיבלה סוכן ידע שמחפש בכל הנהלים הפנימיים שלה. תוך שבועיים — זמן הטיפול בפנייה ירד ב-40% ונציגים פנו לעבודה מורכבת יותר.

רוצה לשמוע דוגמה רלוונטית לתחום שלך? ספר לי קצת על העסק 👇`,
  },
  {
    label: 'רוצה ליצור קשר',
    answer: `מעולה! פשוט גללו מטה לטופס "בואו נדבר" — ממלאים שם, מייל ומה הצורך, ונדב חוזר אליך תוך 24 שעות ⚡`,
  },
]

export default function MayaChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendInstant = useCallback(
    (text: string, answer: string) => {
      if (isLoading) return
      setMessages(prev => [
        ...prev,
        { id: `${Date.now()}-user`, role: 'user', content: text },
        { id: `${Date.now()}-assistant`, role: 'assistant', content: answer },
      ])
    },
    [isLoading]
  )

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const userMessage: Message = {
        id: `${Date.now()}-user`,
        role: 'user',
        content: trimmed,
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setInput('')
      setIsLoading(true)

      try {
        const apiMessages = updatedMessages
          .filter(m => m.id !== 'initial')
          .map(m => ({ role: m.role, content: m.content }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        })

        const data = await res.json()

        setMessages(prev => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: 'assistant',
            content: data.reply ?? 'מצטערת, לא הצלחתי לענות. נסה שוב.',
          },
        ])

      } catch {
        setMessages(prev => [
          ...prev,
          {
            id: `${Date.now()}-err`,
            role: 'assistant',
            content: 'אופס, הייתה תקלה זמנית. נסה שוב עוד רגע.',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const showQuickActions = messages.length === 1 && !isLoading

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? "סגור צ'אט" : "פתח צ'אט עם מאיה"}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-700 shadow-lg shadow-cyan-500/40 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        {isOpen ? (
          <MdClose size={26} />
        ) : (
          <>
            <IoChatbubblesOutline size={26} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 left-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 transition-all duration-300 origin-bottom-left
          w-[360px] max-w-[calc(100vw-3rem)]
          ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}
        `}
        style={{ height: '500px', maxHeight: 'calc(100dvh - 7rem)' }}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0a1628] border-b border-white/10 flex-shrink-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg select-none">
              מ
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a1628]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">מאיה</p>
            <p className="text-green-400 text-xs">מחוברת עכשיו</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="סגור"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0d1b2e] scrollbar-hidden">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ml-2 mt-0.5 self-end">
                  מ
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-cyan-600/25 text-blue-50 rounded-tr-sm border border-cyan-500/20'
                    : 'bg-[#162030] text-gray-100 rounded-tl-sm border border-white/8'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-end">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ml-2 mt-0.5 self-end">
                מ
              </div>
              <div className="bg-[#162030] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3.5">
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        {showQuickActions && (
          <div className="px-4 py-2 bg-[#0d1b2e] border-t border-white/5 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(({ label, answer }) => (
                <button
                  key={label}
                  onClick={() => sendInstant(label, answer)}
                  className="text-xs bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 px-3 py-1.5 rounded-full hover:bg-cyan-500/20 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <form
          onSubmit={handleSubmit}
          className="px-3 py-3 bg-[#0a1628] border-t border-white/10 flex gap-2 items-end flex-shrink-0"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="כתוב הודעה..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-[#162030] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-60 leading-relaxed"
            style={{ maxHeight: '96px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white hover:opacity-90 disabled:opacity-40 transition-opacity flex-shrink-0"
            aria-label="שלח"
          >
            <MdSend size={18} className="scale-x-[-1]" />
          </button>
        </form>
      </div>
    </>
  )
}
