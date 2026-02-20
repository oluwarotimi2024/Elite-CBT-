<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-database-compat.js"></script>

<script src="script.js"></script>
let currentUser = null;

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(pageId).classList.add('active-page');
    if(pageId === 'page-forum') renderForum();
}

// --- FORUM LOGIC (Fixed) ---
function sendForumMsg() {
    let input = document.getElementById('forum-input');
    if(!input.value || !currentUser) return;

    let chats = JSON.parse(localStorage.getItem('sot_forum') || "[]");
    chats.push({ user: currentUser, text: input.value, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) });
    localStorage.setItem('sot_forum', JSON.stringify(chats));
    input.value = "";
    renderForum();
}

function renderForum() {
    let box = document.getElementById('forum-box');
    if(!box) return;
    let chats = JSON.parse(localStorage.getItem('sot_forum') || "[]");
    box.innerHTML = chats.map(c => {
        let isMe = c.user === currentUser;
        return `<div class="${isMe ? 'msg-mine' : 'msg-other'}">
            <small style="font-size:0.6rem; font-weight:bold; display:block;">${isMe ? 'Me' : c.user}</small>
            ${c.text}
        </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
}

// AUTO-REFRESH FORUM
setInterval(() => {
    if(document.getElementById('page-forum').classList.contains('active-page')) renderForum();
}, 3000);

// --- AI LOGIC (Fixed) ---
function askGiantAI() {
    let input = document.getElementById('ai-input');
    let box = document.getElementById('ai-chat-box');
    if(!input.value) return;

    box.innerHTML += `<div class="msg-mine">${input.value}</div>`;
    let q = input.value;
    input.value = "";
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
        let res = `I've analyzed "<b>${q}</b>". Click below for the SOT global academic research: <br><br> <button class="btn btn-gold" style="font-size:0.7rem; padding:5px;" onclick="window.open('https://www.google.com/search?q=${q}+academic+answer')">REVEAL ANSWER</button>`;
        box.innerHTML += `<div class="msg-other"><b>SOT AI:</b> ${res}</div>`;
        box.scrollTop = box.scrollHeight;
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Analyzing request"));
    }, 1000);
}

// --- AUTH ---
function handleAuth(type) {
    let u = document.getElementById(type==='login'?'user-id':'reg-user').value.trim();
    let p = document.getElementById(type==='login'?'user-pass':'reg-pass').value.trim();
    let users = JSON.parse(localStorage.getItem('sot_users') || "{}");

    if(!u || !p) return alert("Fill all fields");
    if(type === 'signup') {
        users[u] = {pass:p, library:false};
        localStorage.setItem('sot_users', JSON.stringify(users));
        alert("Account Created!"); toggleAuth('login');
    } else {
        if(users[u] && users[u].pass === p) {
            currentUser = u;
            document.getElementById('welcome-user').innerText = "Hello, " + u;
            switchPage('page-home');
        } else alert("Invalid Login");
    }
}

function toggleAuth(m) {
    document.getElementById('login-form').style.display = m==='login'?'block':'none';
    document.getElementById('signup-form').style.display = m==='signup'?'block':'none';
}

function initApp() {}
