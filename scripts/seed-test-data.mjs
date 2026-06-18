const BASE = 'https://mindflow-backend-mlbg.onrender.com'

async function api(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }
  if (!res.ok) console.warn(`  [${res.status}] ${method} ${path}`)
  return { ok: res.ok, status: res.status, data }
}

async function createUser(email, password) {
  console.log(`\n=== Registrando ${email} ===`)
  await api('POST', '/api/v1/users/sign-up', { email, password })

  const login = await api('POST', '/api/v1/users/sign-in', { email, password })
  if (!login.ok) {
    console.error('  Error en login')
    return null
  }
  console.log(`  Login OK — id: ${login.data.id}`)
  return { id: login.data.id, token: login.data.token, email }
}

async function createHabits(token) {
  console.log('  Creando habitos...')
  const habits = [
    { name: 'Meditacion diaria', description: '10 minutos de meditacion cada manana', frequency: 'daily', category: 'wellness', status: 'pending', streak: 3 },
    { name: 'Ejercicio', description: '30 minutos de actividad fisica', frequency: 'daily', category: 'fitness', status: 'completed', streak: 7 },
    { name: 'Lectura', description: 'Leer al menos 20 paginas', frequency: 'daily', category: 'education', status: 'pending', streak: 5 },
    { name: 'Hidratacion', description: 'Beber 8 vasos de agua', frequency: 'daily', category: 'health', status: 'completed', streak: 12 },
    { name: 'Journaling', description: 'Escribir en el diario antes de dormir', frequency: 'daily', category: 'wellness', status: 'pending', streak: 2 }
  ]

  for (const habit of habits) {
    const res = await api('POST', '/habits', habit, token)
    console.log(`    ${res.ok ? 'OK' : 'FAIL'} — ${habit.name}`)
  }
}

async function createJournalEntries(token) {
  console.log('  Creando entradas de journal...')
  const entries = [
    { date: '2026-06-18', title: 'Dia productivo', content: 'Hoy tuve un dia muy productivo en el trabajo. Logre completar todas mis tareas y me siento satisfecho con mi rendimiento.', category: 'Trabajo' },
    { date: '2026-06-17', title: 'Ansiedad por examenes', content: 'Me siento ansioso por los examenes de la proxima semana. No he podido dormir bien y me cuesta concentrarme en los estudios.', category: 'Estudios' },
    { date: '2026-06-16', title: 'Reunion familiar', content: 'Pasamos un dia increible en familia. Fuimos al parque y los ninos disfrutaron mucho. Me siento agradecido por estos momentos.', category: 'Familia' },
    { date: '2026-06-15', title: 'Estres laboral', content: 'El proyecto tiene deadline esta semana y estamos retrasados. Me siento estresado y cansado por las largas horas de trabajo.', category: 'Trabajo' },
    { date: '2026-06-14', title: 'Meditacion matutina', content: 'Empece el dia con 15 minutos de meditacion. Me siento en calma y con energia positiva para afrontar el dia de hoy.', category: 'Personal' }
  ]

  let anyOk = false
  for (const entry of entries) {
    const res = await api('POST', '/journal/entries', entry, token)
    if (res.ok) anyOk = true
    console.log(`    ${res.ok ? 'OK' : 'FAIL (500 — error interno del backend)'} — ${entry.title}`)
  }
  if (!anyOk) console.log('    NOTA: Journal entries fallan con 500. Esto es un error del backend (probablemente la IA).')
}

async function createChatConversations(token) {
  console.log('  Creando conversaciones de chat...')
  const conversations = [
    { content: 'Hoy me siento ansioso por una presentacion importante en el trabajo', category: 'Trabajo' },
    { content: 'Estoy agradecido por mi familia y los buenos momentos que compartimos', category: 'Personal' }
  ]

  let anyOk = false
  for (const conv of conversations) {
    const res = await api('POST', '/chat/conversations', conv, token)
    if (res.ok) anyOk = true
    console.log(`    ${res.ok ? 'OK' : 'FAIL (500 — error interno del backend)'} — ${conv.content.slice(0, 40)}...`)
  }
  if (!anyOk) console.log('    NOTA: Chat conversations fallan con 500. Esto es un error del backend (probablemente la IA).')
}

async function computeAnalytics(token) {
  console.log('  Computando analytics...')
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const weekStart = new Date(new Date().setDate(diff)).toISOString().slice(0, 10)

  const analytics = await api('POST', `/analyticsCache/compute?weekStart=${weekStart}`, null, token)
  console.log(`    Analytics: ${analytics.ok ? 'OK' : 'FAIL'}`)

  const wordCloud = await api('POST', '/wordCloud/compute', null, token)
  console.log(`    Word Cloud: ${wordCloud.ok ? 'OK' : 'FAIL'}`)
}

async function main() {
  console.log('========================================')
  console.log('  MindFlow — Seed Test Data')
  console.log('========================================')

  // Usuario FREE
  const freeUser = await createUser('freeuser2026@mindflow.com', 'Test1234!')
  if (freeUser) {
    await createHabits(freeUser.token)
    await createJournalEntries(freeUser.token)
    await createChatConversations(freeUser.token)
    await computeAnalytics(freeUser.token)
    console.log(`\n  Usuario FREE listo:`)
    console.log(`    Email: freeuser2026@mindflow.com`)
    console.log(`    Password: Test1234!`)
  }

  // Usuario PREMIUM
  const premiumUser = await createUser('premiumuser2026@mindflow.com', 'Test1234!')
  if (premiumUser) {
    await createHabits(premiumUser.token)
    await createJournalEntries(premiumUser.token)
    await createChatConversations(premiumUser.token)
    await computeAnalytics(premiumUser.token)
    console.log(`\n  Usuario PREMIUM listo:`)
    console.log(`    Email: premiumuser2026@mindflow.com`)
    console.log(`    Password: Test1234!`)
    console.log(`    NOTA: Para activar premium, inicia sesion y haz el pago desde /subscription`)
  }

  console.log('\n========================================')
  console.log('  Seed completado')
  console.log('========================================')
}

main().catch(console.error)
