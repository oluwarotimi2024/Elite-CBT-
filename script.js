<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-database-compat.js"></script>

<script>

let currentUser = null;

/* ------------------ SWITCH PAGE ------------------ */
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p =>
        p.classList.remove('active-page')
    );

    document.getElementById(pageId).classList.add('active-page');

    if (pageId === 'page-forum') {
        renderForum();
    }
}

/* ------------------ FIREBASE CONFIG ------------------ */
/* ⚠️ REPLACE WITH YOUR REAL KEYS */
const firebaseConfig = {
  apiKey: "PASTE_REAL_KEY",
  authDomain: "sot-academy.firebaseapp.com",
  databaseURL: "https://sot-academy-default-rtdb.firebaseio.com",
  projectId: "sot-academy",
  storageBucket: "sot-academy.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

/* ------------------ START APP ------------------ */
function startApp() {
    let nameInput = document.getElementById('user-id').value.trim();

    if (!nameInput) {
        alert("Please enter your name!");
        return;
    }

    currentUser = nameInput;
    document.getElementById('welcome-user').innerText =
        "Hello, " + nameInput;

    switchPage('page-home');
}

function initApp() {

    // Create automatic guest user
    currentUser = "Guest_" + Math.floor(Math.random() * 1000);

    // Set welcome name
    setTimeout(() => {

        document.getElementById('welcome-user').innerText =
            "Hello, " + currentUser;

        switchPage('page-home');

    }, 5000); // 5 seconds splash
}


/* ------------------ FORUM SEND ------------------ */
function sendForumMsg() {
    let input = document.getElementById('forum-input');

    if (!input.value || !currentUser) return;

    database.ref('forum_messages').push({
        user: currentUser,
        text: input.value,
        timestamp: Date.now(),
        timeStr: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    });

    input.value = "";
}

/* ------------------ REAL TIME LISTENER ------------------ */
database.ref('forum_messages').on('value', (snapshot) => {

    let box = document.getElementById('forum-box');
    if (!box) return;

    let data = snapshot.val();
    if (!data) return;

    let html = "";

    for (let id in data) {
        let msg = data[id];
        let isMe = msg.user === currentUser;

        html += `
        <div class="${isMe ? 'msg-mine' : 'msg-other'}">
            <small style="font-size:0.6rem;font-weight:bold;display:block;">
                ${isMe ? 'Me' : msg.user}
            </small>
            ${msg.text}
            <small style="display:block;font-size:0.5rem;opacity:0.5;text-align:right;">
                ${msg.timeStr}
            </small>
        </div>`;
    }

    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
});

/* ------------------ AI LOGIC ------------------ */
function askGiantAI() {
    let input = document.getElementById('ai-input');
    let box = document.getElementById('ai-chat-box');

    if (!input.value) return;

    box.innerHTML += `<div class="msg-mine">${input.value}</div>`;
    let q = input.value;
    input.value = "";

    box.scrollTop = box.scrollHeight;

    setTimeout(() => {

        let res = `
        I've analyzed "<b>${q}</b>". 
        <br><br>
        <button class="btn btn-gold" 
        style="font-size:0.7rem;padding:5px;"
        onclick="window.open('https://www.google.com/search?q=${q}+academic+answer')">
        REVEAL ANSWER
        </button>`;

        box.innerHTML +=
        `<div class="msg-other"><b>SOT AI:</b> ${res}</div>`;

        box.scrollTop = box.scrollHeight;

    }, 1000);
}

</script>
