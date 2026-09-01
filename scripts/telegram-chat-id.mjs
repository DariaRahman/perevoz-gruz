import { loadLocalEnv } from '../server/deliverLead.mjs'

const env = loadLocalEnv()
const token = env.TELEGRAM_BOT_TOKEN

if (!token) {
  console.error('Добавьте TELEGRAM_BOT_TOKEN в .env')
  process.exit(1)
}

const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`)
const data = await response.json()

if (!data.ok) {
  console.error(data.description || 'Не удалось получить обновления')
  process.exit(1)
}

const chats = new Map()
for (const update of data.result || []) {
  const chat = update.message?.chat || update.my_chat_member?.chat || update.channel_post?.chat
  if (chat) chats.set(String(chat.id), chat)
}

if (chats.size === 0) {
  console.log('Напишите боту любое сообщение в Telegram и запустите команду ещё раз:')
  console.log('npm run telegram-chat-id')
  process.exit(0)
}

console.log('Найденные chat id:')
for (const [id, chat] of chats) {
  const name = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || 'без имени'
  console.log(`  ${id}  —  ${name}`)
}
