const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "yourname-ai-chats-v1";
let chats = loadChats();
let currentId = chats[0]?.id || makeId();
let busy = false;
// After deploying worker/worker.js, paste your Worker URL below. Keep secret keys on the server, never here.
const WORKER_API_URL = "";

const translations = {
 en:{newChat:"New chat",recent:"RECENT",language:"LANGUAGE",guest:"Guest user",localOnly:"Chats saved on this device",eyebrow:"YOUR PERSONAL AI ASSISTANT",headline:"What can I help you with?",subhead:"Ask a question, explore an idea, or get help with a task.",idea1:"Explain AI simply",idea2:"Write a job email",idea3:"Make a learning plan",idea4:"Write a Bengali story",hint:"AI can make mistakes. Check important information.",disclaimer:"Starter project • Demo mode does not use a real AI model."},
 bn:{newChat:"নতুন চ্যাট",recent:"সাম্প্রতিক",language:"ভাষা",guest:"অতিথি ব্যবহারকারী",localOnly:"চ্যাট এই ডিভাইসে সংরক্ষিত",eyebrow:"আপনার ব্যক্তিগত AI সহকারী",headline:"কীভাবে সাহায্য করতে পারি?",subhead:"প্রশ্ন করুন, নতুন ধারণা খুঁজুন অথবা কোনো কাজে সাহায্য নিন।",idea1:"সহজ ভাষায় AI বুঝুন",idea2:"চাকরির ইমেইল লিখুন",idea3:"শেখার পরিকল্পনা তৈরি",idea4:"বাংলা গল্প লিখুন",hint:"AI ভুল করতে পারে। গুরুত্বপূর্ণ তথ্য যাচাই করুন।",disclaimer:"প্রাথমিক সংস্করণ • ডেমো মোডে প্রকৃত AI মডেল ব্যবহার হয় না।"},
 es:{newChat:"Nuevo chat",recent:"RECIENTE",language:"IDIOMA",guest:"Usuario invitado",localOnly:"Chats guardados en este dispositivo",eyebrow:"TU ASISTENTE DE IA",headline:"¿En qué puedo ayudarte?",subhead:"Haz una pregunta o pide ayuda con una tarea.",idea1:"Explicar la IA",idea2:"Escribir un correo laboral",idea3:"Crear un plan de aprendizaje",idea4:"Escribir un cuento bengalí",hint:"La IA puede equivocarse. Verifica la información importante.",disclaimer:"Proyecto inicial • El modo demo no usa un modelo de IA real."},
 fr:{newChat:"Nouveau chat",recent:"RÉCENT",language:"LANGUE",guest:"Utilisateur invité",localOnly:"Chats enregistrés sur cet appareil",eyebrow:"VOTRE ASSISTANT IA",headline:"Comment puis-je vous aider ?",subhead:"Posez une question ou demandez de l'aide.",idea1:"Expliquer l'IA",idea2:"Écrire un e-mail professionnel",idea3:"Créer un plan d'apprentissage",idea4:"Écrire une histoire bengalie",hint:"L'IA peut se tromper. Vérifiez les informations importantes.",disclaimer:"Projet de départ • Le mode démo n'utilise pas de vrai modèle d'IA."},
 ar:{newChat:"محادثة جديدة",recent:"الأخيرة",language:"اللغة",guest:"مستخدم ضيف",localOnly:"المحادثات محفوظة على هذا الجهاز",eyebrow:"مساعدك الشخصي",headline:"كيف يمكنني مساعدتك؟",subhead:"اطرح سؤالاً أو اطلب المساعدة في مهمة.",idea1:"شرح الذكاء الاصطناعي",idea2:"كتابة بريد للتوظيف",idea3:"إنشاء خطة تعلم",idea4:"كتابة قصة بنغالية",hint:"قد يخطئ الذكاء الاصطناعي. تحقق من المعلومات المهمة.",disclaimer:"مشروع أولي • الوضع التجريبي لا يستخدم نموذج ذكاء اصطناعي حقيقياً."},
 hi:{newChat:"नई चैट",recent:"हाल के",language:"भाषा",guest:"अतिथि उपयोगकर्ता",localOnly:"चैट इस डिवाइस पर सहेजी गई हैं",eyebrow:"आपका निजी AI सहायक",headline:"मैं आपकी क्या मदद कर सकता हूँ?",subhead:"प्रश्न पूछें या किसी काम में सहायता लें।",idea1:"AI को सरलता से समझें",idea2:"नौकरी का ईमेल लिखें",idea3:"सीखने की योजना बनाएँ",idea4:"बंगाली कहानी लिखें",hint:"AI गलतियाँ कर सकता है। महत्वपूर्ण जानकारी जाँचें।",disclaimer:"स्टार्टर प्रोजेक्ट • डेमो मोड वास्तविक AI मॉडल का उपयोग नहीं करता।"}
};

function makeId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function loadChats(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return []}}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(chats))}catch{toast("Browser storage is full. Clear some old chats.")}}
function currentChat(){let c=chats.find(x=>x.id===currentId);if(!c){c={id:currentId,title:"New chat",messages:[]};chats.unshift(c)}return c}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
function renderHistory(){
 const host=$("history");host.innerHTML="";
 chats.forEach(c=>{const b=document.createElement("button");b.className="history-item"+(c.id===currentId?" active":"");b.textContent=c.title||"New chat";b.title=b.textContent;b.onclick=()=>{currentId=c.id;renderAll();$("sidebar").classList.remove("open")};host.appendChild(b)});
}
function renderMessages(){
 const chat=currentChat(), host=$("messages");host.innerHTML="";
 $("welcome").style.display=chat.messages.length?"none":"block";
 chat.messages.forEach(m=>{
  const row=document.createElement("div");row.className="message "+m.role;
  const icon=document.createElement("div");icon.className="message-icon";icon.textContent=m.role==="user"?"Y":"✦";
  const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=m.content;
  if(m.role==="assistant"){row.append(icon,bubble)}else{row.append(bubble)}
  host.appendChild(row);
 });
 $("conversation").scrollTop=$("conversation").scrollHeight;
}
function renderAll(){renderHistory();renderMessages();document.title=(currentChat().title==="New chat"?"YourName AI":currentChat().title+" — YourName AI")}
function newChat(){currentId=makeId();chats.unshift({id:currentId,title:"New chat",messages:[]});save();renderAll();$("prompt").focus()}
function setLanguage(lang){const dict=translations[lang]||translations.en;document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(dict[k])el.textContent=dict[k]});$("prompt").placeholder=lang==="bn"?"আপনার বার্তা লিখুন...":"Message YourName AI..."}
function demoAnswer(q){
 const s=q.toLowerCase();
 if(/hello|hi\b|hey|হ্যালো|আসসালামু|নমস্কার/.test(s))return "Hello! I’m YourName AI, your starter assistant. This is demo mode, so I can show sample responses but I’m not connected to a real AI model yet.";
 if(/who are you|তুমি কে|আপনি কে/.test(s))return "I’m YourName AI, a starter AI chat interface. To answer questions intelligently, connect a real model through a secure backend.";
 if(/বাংলা|bangla|bengali/.test(s))return "অবশ্যই! এই প্রাথমিক সংস্করণে বাংলা ইন্টারফেস ও চ্যাট লেখা কাজ করে। তবে প্রকৃত বুদ্ধিমান উত্তর পেতে একটি AI মডেল সংযুক্ত করতে হবে।";
 if(/code|javascript|python|html|কোড/.test(s))return "I can display code-related prompts in this demo, but this response is only a sample. Connect an AI model through a backend to generate useful, context-aware code.";
 return "Thanks for your message!\n\nYourName AI is running successfully in **demo mode**. This starter version saves chats on this device, supports multiple interface languages, and provides the chat UI.\n\nTo get real, context-aware answers like ChatGPT, configure the Cloudflare Workers AI backend described in README.md. Never put a private API token in browser-side JavaScript.";
}
function addMessage(role,content){const c=currentChat();c.messages.push({role,content});if(c.title==="New chat"&&role==="user")c.title=content.slice(0,38)+(content.length>38?"…":"");save();renderAll()}
async function sendMessage(text){
 const q=(text||"").trim();if(!q||busy)return;
 if($("model").value==="cloudflare" && !WORKER_API_URL){toast("Set WORKER_API_URL in app.js after deploying the backend.");return}
 busy=true;$("sendBtn").disabled=true;addMessage("user",q);
 const wait=document.createElement("div");wait.className="message assistant";wait.id="typing";
 wait.innerHTML='<div class="message-icon">✦</div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>';$("messages").appendChild(wait);
 try {
   let answer;
   if($("model").value==="cloudflare"){
     const history=currentChat().messages.slice(-20).map(m=>({role:m.role,content:m.content}));
     const res=await fetch(WORKER_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history})});
     const data=await res.json();
     if(!res.ok) throw new Error(data.error||"AI request failed");
     answer=data.response||"No response returned.";
   } else {
     await new Promise(r=>setTimeout(r,450));answer=demoAnswer(q);
   }
   wait.remove();addMessage("assistant",answer);
 } catch(err) {
   wait.remove();addMessage("assistant","I couldn't reach the AI service. Check the Worker URL, deployment, model availability, and quota.\n\nTechnical detail: "+err.message);
 } finally {
   busy=false;$("sendBtn").disabled=false;$("prompt").focus();
 }
}
$("chatForm").addEventListener("submit",e=>{e.preventDefault();const q=$("prompt").value;$("prompt").value="";$("prompt").style.height="auto";sendMessage(q)});
$("prompt").addEventListener("input",()=>{const t=$("prompt");t.style.height="auto";t.style.height=Math.min(t.scrollHeight,180)+"px"});
$("prompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();$("chatForm").requestSubmit()}});
$("newChat").onclick=newChat;
$("clearBtn").onclick=()=>{const c=currentChat();if(!c.messages.length)return toast("This chat is already empty.");if(confirm("Clear messages in this chat?")){c.messages=[];c.title="New chat";save();renderAll()}};
$("language").onchange=e=>setLanguage(e.target.value);
$("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
document.querySelectorAll(".suggestion").forEach(b=>b.onclick=()=>sendMessage(b.dataset.prompt));
if(!chats.length)chats=[{id:currentId,title:"New chat",messages:[]}];
if(!chats.some(c=>c.id===currentId))currentId=chats[0].id;
save();setLanguage("en");renderAll();