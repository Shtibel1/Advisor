import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── Mock Accounting Data (simulating iCount / Rivhit export) ───────────────
const MOCK_ACCOUNTING_DATA = {
  businessName: 'טכנולוגיות אלפא בע"מ',
  period: 'ינואר–יוני 2026',
  monthly: [
    { month: 'ינואר', revenue: 120000, expenses: 74000 },
    { month: 'פברואר', revenue: 135000, expenses: 80000 },
    { month: 'מרץ', revenue: 142000, expenses: 118000 }, // spike due to one-time vendor payment
    { month: 'אפריל', revenue: 128000, expenses: 76000 },
    { month: 'מאי', revenue: 138000, expenses: 85000 },
    { month: 'יוני', revenue: 145000, expenses: 82000 },
  ],
  topVendors: [
    { name: 'Google Ads', totalPaid: 54000, category: 'שיווק דיגיטלי' },
    { name: 'שכירות משרד', totalPaid: 48000, category: 'הוצאות קבועות' },
    { name: 'פרילנסרים', totalPaid: 73000, category: 'כוח אדם חיצוני' },
    { name: 'AWS', totalPaid: 18000, category: 'תשתית טכנולוגית' },
    { name: 'ציוד משרדי', totalPaid: 12000, category: 'ציוד' },
  ],
  marchAnomalyNote:
    'בחודש מרץ בוצע תשלום חד-פעמי לפרילנסרים בסך ₪42,000 עבור פרויקט פיתוח שלא תוקצב מראש.',
  currentMonth: { revenue: 145000, expenses: 82000, profit: 63000, margin: '43.4%' },
}

// ─── Hardcoded AI responses keyed by detected intent ─────────────────────────
// TODO: Replace this entire section with a real LLM call, e.g.:
//
//   import OpenAI from 'openai'
//   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
//
//   const systemPrompt = `
//     אתה אנליסט פיננסי בכיר. להלן נתוני הנהלת חשבונות של הלקוח:
//     ${JSON.stringify(MOCK_ACCOUNTING_DATA, null, 2)}
//     ענה בעברית, בקצרה ובמקצועיות, עם מספרים מדויקים מהנתונים.
//   `
//   const completion = await openai.chat.completions.create({
//     model: 'gpt-4o',
//     messages: [
//       { role: 'system', content: systemPrompt },
//       { role: 'user', content: userPrompt },
//     ],
//   })
//   return NextResponse.json({ reply: completion.choices[0].message.content })

function buildResponse(prompt: string): string {
  const lower = prompt.toLowerCase()

  if (lower.includes('מרץ') || lower.includes('הוצאות גבוהות') || lower.includes('הוצאות במרץ')) {
    return `בבדיקת הנתונים, הזינוק בהוצאות בחודש מרץ (₪118,000 לעומת ממוצע של ₪79,400) נובע בעיקר מתשלום חד-פעמי לפרילנסרים בסך ₪42,000 — תשלום על פרויקט פיתוח שלא הופיע בתקציב המקורי. ₪${MOCK_ACCOUNTING_DATA.topVendors[2].totalPaid.toLocaleString()} שולמו לפרילנסרים בסך הכל בתקופה זו. המלצה: להוסיף סעיף "פרויקטים מיוחדים" לתקציב הרבעוני.`
  }

  if (lower.includes('רווחיות') || lower.includes('ברווח') || lower.includes('מרווח')) {
    const d = MOCK_ACCOUNTING_DATA.currentMonth
    return `כן — החודש (יוני 2026) אתם ברווחיות חיובית. הכנסות: ₪${d.revenue.toLocaleString()}, הוצאות: ₪${d.expenses.toLocaleString()}, רווח גולמי: ₪${d.profit.toLocaleString()} (מרווח ${d.margin}). זהו אחד החודשים הטובים מתחילת השנה — גבוה ב-7% מממוצע הרווח הרבעוני.`
  }

  if (lower.includes('ספק') || lower.includes('הוצאנו הכי') || lower.includes('הוצאנו עליו')) {
    const top = MOCK_ACCOUNTING_DATA.topVendors[2]
    return `הספק שהוצאתם עליו הכי הרבה הוא **${top.name}** — סה"כ ₪${top.totalPaid.toLocaleString()} בחצי השנה הראשונה (קטגוריה: ${top.category}). אחריו Google Ads עם ₪54,000 ושכירות משרד עם ₪48,000. שלושת הספקים האלו מהווים כ-72% מסך ההוצאות.`
  }

  if (lower.includes('הכנסות') || lower.includes('מכירות') || lower.includes('revenue')) {
    return `ההכנסות הכוללות מינואר עד יוני 2026 עומדות על ₪${MOCK_ACCOUNTING_DATA.monthly.reduce((s, m) => s + m.revenue, 0).toLocaleString()}. מגמה חיובית — יוני (₪145,000) הוא שיא ההכנסות מתחילת השנה. פברואר ומאי הציגו צמיחה יציבה. ממוצע חודשי: ₪${Math.round(MOCK_ACCOUNTING_DATA.monthly.reduce((s, m) => s + m.revenue, 0) / 6).toLocaleString()}.`
  }

  if (lower.includes('תחזית') || lower.includes('צפי') || lower.includes('Q3')) {
    return `בהתבסס על המגמה הנוכחית, צפי ההכנסות לרבעון השלישי (Q3) עומד על כ-₪430,000–₪450,000, בהנחה שלא יחולו הוצאות חד-פעמיות נוספות כמו בחודש מרץ. לשמירה על מרווח של 40%+, ממליץ לרדת בהוצאות שיווק ב-10% ולהצמיד תשלומי פרילנסרים לאבני דרך.`
  }

  // Default fallback response
  return `בהתבסס על נתוני ${MOCK_ACCOUNTING_DATA.businessName} לתקופה ${MOCK_ACCOUNTING_DATA.period}: הכנסות כוללות ₪${MOCK_ACCOUNTING_DATA.monthly.reduce((s, m) => s + m.revenue, 0).toLocaleString()}, הוצאות ₪${MOCK_ACCOUNTING_DATA.monthly.reduce((s, m) => s + m.expenses, 0).toLocaleString()}. רווח לפני מס: ₪${(MOCK_ACCOUNTING_DATA.monthly.reduce((s, m) => s + m.revenue, 0) - MOCK_ACCOUNTING_DATA.monthly.reduce((s, m) => s + m.expenses, 0)).toLocaleString()}. כדי לקבל תשובה מדויקת יותר, נסה לשאול על חודש ספציפי, ספק מסוים, או את מצב הרווחיות.`
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: { prompt: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { prompt } = body

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }

  // Sanitize: cap length to prevent abuse
  const sanitizedPrompt = prompt.trim().slice(0, 500)

  // Simulate processing latency (remove in production LLM integration)
  await new Promise(resolve => setTimeout(resolve, 600))

  const reply = buildResponse(sanitizedPrompt)

  return NextResponse.json({ reply })
}
