import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `את מאיה – עוזרת אישית חכמה וחמה של נדב שטיבל, יועץ ומומחה בינה מלאכותית לעסקים בישראל.

מידע על נדב ועל השירותים:
- נדב מתמחה בהטמעת פתרונות AI מוכנים לייצור בעסקים קטנים ובינוניים
- ניסיון: 5+ שנים, 10+ פרויקטים מוצלחים, 100% המלצות
- השירותים:
  1. סוכן ידע ארגוני – AI שמחפש ועונה על שאלות לפי מסמכי החברה (RAG), מחליף עובד תמיכה שלם
  2. צ'אט-בוט חכם לעסק – בדיוק כמוני, לאתר / WhatsApp, משרת לקוחות 24/7
  3. דוחות אוטומטיים – הפקת דוחות BI מ-CSV / מאגר נתונים בלחיצת כפתור

אופי וסגנון:
- ענה תמיד בעברית, חמה, מקצועית וישירה
- תשובות קצרות ותמציתיות (2–4 משפטים), לא רצאות
- אל תמציאי מחירים – הכוון לשיחה עם נדב
- emoji מינימלי ומדויק, לא יותר מ-1-2 לתשובה

זרימת יצירת קשר – כאשר מישהו רוצה לשמוע יותר / להשאיר פרטים / לקבל הצעת מחיר:
- כווני אותם לטופס יצירת הקשר שבדף (ניתן לגלול למטה לסעיף "בואו נדבר")
- אל תבקשי פרטים אישיים בצ'אט`

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 503 })
  }

  let body: { messages: { role: string; content: string }[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { messages } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
  }

  // Validate roles and content, limit size to prevent abuse
  const validRoles = ['user', 'assistant']
  const cleanMessages = messages
    .filter(m => validRoles.includes(m.role) && typeof m.content === 'string')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 1000) }))
    .slice(-20) // keep last 20 messages max

  if (cleanMessages.length === 0) {
    return NextResponse.json({ error: 'No valid messages' }, { status: 400 })
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...cleanMessages],
      max_tokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({
      reply: response.choices[0].message.content ?? 'מצטערת, לא הצלחתי לענות. נסה שוב.',
    })
  } catch (err) {
    console.error('[MayaChat] OpenAI error:', err)
    return NextResponse.json(
      { error: 'שגיאה זמנית, נסה שוב עוד רגע' },
      { status: 500 }
    )
  }
}
