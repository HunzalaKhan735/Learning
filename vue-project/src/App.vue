<template>
  <div>
    <h1>Chat Bot</h1>
    <input v-model="chatting" placeholder="Type message" @keyup.enter="sendMessage" />
    <button @click="sendMessage">Send</button>
  </div>

  <div v-for="(msg, index) in chatHistory" :key="index" class="chat-line">
    <p><strong>You:</strong> {{ msg.question }}</p>
    <p><strong>AI:</strong> {{ msg.answer }}</p>
    <hr>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OpenAI from 'openai' // ✅ aapka local DB

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const chatting = ref('')
const reply   = ref('')
const chatHistory = ref([])

// ✅ Helper: local DB se answer nikalne wala function
function getSchoolAnswer(question) {
  // schoolDB agar object hai to key check karo
  if (typeof schoolDB === 'object' && !Array.isArray(schoolDB)) {
    const key = Object.keys(schoolDB).find(k =>
      question.toLowerCase().includes(k.toLowerCase())
    )
    if (key) return schoolDB[key]
  }

  // agar array hai to har item check karo
  if (Array.isArray(schoolDB)) {
    const found = schoolDB.find(item =>
      question.toLowerCase().includes((item.name || '').toLowerCase())
    )
    if (found) return found.info || JSON.stringify(found)
  }
  return null
}

// ✅ Updated sendMessage
function sendMessage() {
  if (!chatting.value) return

  const userMsg = chatting.value
  chatting.value = ''

  // 1️⃣ Pehle local schoolDB check karo
  const localAnswer = getSchoolAnswer(userMsg)
  if (localAnswer) {
    chatHistory.value.push({ question: userMsg, answer: localAnswer })
    return
  }

  // 2️⃣ Agar local DB me na mile to AI se pucho
  const contextMessages = chatHistory.value
    .slice(-15)
    .flatMap(m => [
      { role: 'user', content: m.question },
      { role: 'assistant', content: m.answer }
    ])

  openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      ...contextMessages,
      { role: 'user', content: userMsg }
    ]
  })
  .then(res => {
    reply.value = res.choices?.[0]?.message?.content || 'No reply'
    chatHistory.value.push({
      question: userMsg,
      answer: reply.value
    })
  })
  .catch(err => {
    reply.value = 'Error: ' + err.message
    chatHistory.value.push({
      question: userMsg,
      answer: reply.value
    })
    console.error(err)
  })
}
</script>

<style>
/* ----- Page base ----- */
body {
  background: #f1f1f1;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

/* ----- Main wrapper ----- */
div {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* ----- Heading ----- */
h1 {
  text-align: center;
  color: #000000;
  margin-bottom: 20px;
}

/* ----- Input area ----- */
input[type="text"] {
  width: 75%;
  padding: 10px;
  border: 1px solid #efefef;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

button {
  padding: 10px 18px;
  margin-left: 5px;
  border: none;
  border-radius: 20px;
  background-color: #000000;
  color: #ffefef;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  background-color: #dbdbdb;
}

/* ----- Chat lines ----- */
.chat-line {
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #ffffff;
  border-left: 4px solid #000000;
}

.chat-line p {
  margin: 5px 0;
  line-height: 1.4;
}

.chat-line strong {
  color: #ff0000;
}

/* ----- Scrollbar if history is long ----- */
.chat-container {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
