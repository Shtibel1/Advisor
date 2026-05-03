'use client'

import { useState } from 'react'
import { CheckIcon } from '@/components/ui/Icons'
import { MdSend } from 'react-icons/md'
// RTL: mirror the send icon to point left

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactSection() {
  const [formState, setFormState] = useState<FormState>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/xvzlkoqg', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (response.ok) {
        setFormState('success')
        form.reset()
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  return (
    <section id="contact" className="py-24 bg-slate-50 scroll-mt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            מוכנים לייעל את העסק?
            <br />
            <span className="text-cyan-600">בואו נדבר</span>
          </h2>
          <p className="text-lg text-gray-500">
            ספרו לנו על האתגר שלכם ונחזור אליכם תוך 24 שעות
          </p>
        </div>

        {formState === 'success' ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckIcon />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">ההודעה נשלחה בהצלחה!</h3>
            <p className="text-gray-500 max-w-sm mx-auto">תודה! נחזור אליכם בהקדם האפשרי.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            action="https://formspree.io/f/xvzlkoqg"
            method="POST"
            className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  שם מלא <span className="text-cyan-600">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 bg-slate-50/50 text-gray-900 placeholder:text-gray-400 transition-all"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                  שם חברה
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  autoComplete="organization"
                  placeholder="שם החברה"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 bg-slate-50/50 text-gray-900 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                כתובת אימייל <span className="text-cyan-600">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="israel@example.com"
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 bg-slate-50/50 text-gray-900 placeholder:text-gray-400 transition-all"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                ספרו לנו על האתגר שלכם <span className="text-cyan-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="מה התהליכים שאתם רוצים לייעל? מה המערכת הקיימת? מה המטרה העסקית?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 bg-slate-50/50 text-gray-900 placeholder:text-gray-400 transition-all resize-none"
              />
            </div>

            {formState === 'error' && (
              <p className="text-red-500 text-sm mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                אירעה שגיאה בשליחה. אנא נסה שוב או פנה ישירות אל{' '}
                <a href="mailto:nadavshtibel@gmail.com" className="underline" dir="ltr">nadavshtibel@gmail.com</a>
              </p>
            )}

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-[1.02] active:scale-[0.99] shadow-lg shadow-cyan-500/25 inline-flex items-center justify-center gap-2"
            >
              {formState === 'submitting' ? 'שולח...' : <><span>שלח הודעה</span><MdSend size={20} style={{ transform: 'scaleX(-1)' }} /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
