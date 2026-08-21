document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  loadWishes();
  initMusicPlayer();
  initQuiz();
});

/* ==========================================================================
   PARTICLE ENGINE (Floating Hearts)
   ========================================================================== */
function initParticles() {
  const container = document.getElementById("particle-container");
  const heartSymbols = ["❤️", "💖", "💝", "💕", "🌸"];
  let counter = 0;
  
  setInterval(() => {
    counter++;
    const isPhoto = (counter % 3 === 0);
    const particle = document.createElement("div");
    
    if (isPhoto) {
      particle.className = "floating-heart floating-photo-particle";
      particle.innerHTML = `<img src="assets/background.jpeg" alt="Shravani" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.5);">`;
    } else {
      particle.className = "floating-heart";
      particle.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      particle.style.fontSize = Math.random() * 1.5 + 0.8 + "rem";
    }
    
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.animationDuration = Math.random() * 4 + 6 + "s"; // 6s to 10s
    
    container.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 10000);
  }, 800);
}

/* ==========================================================================
   LOAD WISHES (Dynamically from Config)
   ========================================================================== */
function loadWishes() {
  const container = document.getElementById("wishes-container");
  if (!container) return;
  
  // Clear any existing dummy wishes
  container.innerHTML = "";

  // Check if configuration exists
  if (typeof friendsWishes === "undefined" || !friendsWishes.length) {
    container.innerHTML = "<p style='text-align: center; grid-column: 1/-1;'>Wishes will appear here when configured in friends_config.js!</p>";
    return;
  }

  friendsWishes.forEach(item => {
    const card = document.createElement("div");
    card.className = "wish-card glass";
    
    // Add clickable styling and event listener if link exists
    if (item.link) {
      card.style.cursor = "pointer";
      card.classList.add("clickable-wish");
      card.addEventListener("click", () => {
        window.location.href = item.link;
      });
    }
    
    const imageSrc = item.photo ? item.photo : "assets/placeholder.jpg";
    const secondImgHtml = item.secondPhoto ? `<img class="wish-avatar second-avatar" src="${item.secondPhoto}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); margin-left: -15px;">` : '';

    // Unique storage key for each friend reply
    const friendKey = item.name.replace(/[^a-zA-Z0-9]/g, "");
    const savedReply = localStorage.getItem("reply_" + friendKey) || "";

    card.innerHTML = `
      <div class="wish-header" style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;" ${item.link ? `onclick="window.location.href='${item.link}'" style="cursor: pointer;"` : ''}>
          <img class="wish-avatar" src="${imageSrc}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%220.9em%22 font-size=%2290%22>❤️</text></svg>';" alt="${item.name}">
          ${secondImgHtml}
          <span class="wish-name">${item.name}</span>
        </div>
        ${item.link ? `<a href="${item.link}" style="font-size: 0.8rem; color: var(--primary); font-weight: 600; text-decoration: none; background: rgba(224,176,255,0.15); padding: 4px 10px; border-radius: 12px; border: 1px solid var(--glass-border);">Gallery 📸</a>` : ''}
      </div>
      <p class="wish-text">${item.wish}</p>
      
      <!-- Shravani's Reply Box -->
      <div class="wish-reply-box" style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed var(--glass-border);" onclick="event.stopPropagation();">
        <label style="font-size: 0.85rem; color: var(--accent); font-weight: 600; display: block; margin-bottom: 8px;">
          💌 Reply to ${item.name}:
        </label>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="input_reply_${friendKey}" value="${savedReply}" placeholder="Write your sweet reply..." style="flex: 1; padding: 8px 12px; border-radius: 20px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.06); color: white; font-size: 0.85rem; outline: none; font-family: var(--font-sans);">
          <button onclick="saveWishReply('${friendKey}')" class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem; border-radius: 20px; white-space: nowrap;">Send 💌</button>
        </div>
        <p id="status_reply_${friendKey}" style="font-size: 0.75rem; color: #4caf50; margin-top: 6px; display: ${savedReply ? 'block' : 'none'};">
          ${savedReply ? '❤️ Reply saved!' : ''}
        </p>
      </div>
    `;
    container.appendChild(card);
  });
}

function saveWishReply(friendKey) {
  const input = document.getElementById("input_reply_" + friendKey);
  const status = document.getElementById("status_reply_" + friendKey);
  if (!input) return;

  const text = input.value.trim();
  if (text) {
    localStorage.setItem("reply_" + friendKey, text);
    if (status) {
      status.innerText = "❤️ Reply saved!";
      status.style.display = "block";
    }
  } else {
    localStorage.removeItem("reply_" + friendKey);
    if (status) {
      status.style.display = "none";
    }
  }
}

/* ==========================================================================
   MUSIC PLAYER CONTROLLER
   ========================================================================== */
function initMusicPlayer() {
  // Handled by toggleTrack function
}

function toggleTrack(audioId, btnId, vinylId) {
  const audio = document.getElementById(audioId);
  const btn = document.getElementById(btnId);
  const vinyl = document.getElementById(vinylId);

  if (!audio || !btn) return;

  // Pause all other audio elements first
  document.querySelectorAll("audio").forEach(a => {
    if (a.id !== audioId) {
      a.pause();
      a.currentTime = 0;
    }
  });
  document.querySelectorAll("[id^='play-btn-']").forEach(b => {
    if (b.id !== btnId) b.innerText = "▶ Play";
  });
  document.querySelectorAll("[id^='vinyl-disc-']").forEach(v => {
    if (v.id !== vinylId) v.classList.remove("spin");
  });

  if (audio.paused) {
    audio.play().then(() => {
      btn.innerText = "⏸ Pause";
      if (vinyl) vinyl.classList.add("spin");
    }).catch(err => {
      console.log("Audio play error", err);
    });
  } else {
    audio.pause();
    btn.innerText = "▶ Play";
    if (vinyl) vinyl.classList.remove("spin");
  }
}

/* ==========================================================================
   PLAYFUL QUESTIONS ENGINE (EVASIVE "NO" BUTTON & GROWING "YES")
   ========================================================================== */
const playfulQuestions = [
  {
    question: "Do you like this website I built for you?",
    yesMsg: "Yay! I knew you'd love it! You mean the world to me ❤️✨",
    mode: "normal" // Normal: YES grows, NO flees/shrinks
  },
  {
    question: "Did you like my birthday gift?",
    yesMsg: "Aww! I'm so happy it brought a smile to your face! 🎁🥰",
    mode: "normal"
  },
  {
    question: "Do you want to kill me?",
    noMsg: "Phew! Thank goodness! I love you so much! 😂❤️✨",
    mode: "reverse" // Reverse: YES shrinks/flees, NO grows!
  }
];

let currentQIndex = 0;
let yesScale = 1;
let noScale = 1;
let clickCount = 0;

function initQuiz() {
  renderPlayfulQuestion();
}

function renderPlayfulQuestion() {
  const qNumText = document.getElementById("q-number");
  const scoreText = document.getElementById("q-score");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const feedback = document.getElementById("feedback-text");

  if (!questionText || !optionsContainer) return;

  feedback.classList.add("hide");
  optionsContainer.innerHTML = "";
  yesScale = 1;
  noScale = 1;
  clickCount = 0;

  if (scoreText) scoreText.style.display = "none";

  if (currentQIndex >= playfulQuestions.length) {
    if (qNumText) qNumText.innerText = "All Answered! ❤️";
    questionText.innerText = "Thank you for answering all my questions! You're the best girlfriend ever! I love you so much! 🥰👑🎉";
    optionsContainer.innerHTML = `<button class="btn-primary" onclick="resetPlayfulQuestions()" style="margin: 0 auto;">Replay Questions 🔄</button>`;
    return;
  }

  const currentQ = playfulQuestions[currentQIndex];
  if (qNumText) qNumText.innerText = `Question ${currentQIndex + 1} of ${playfulQuestions.length}`;
  questionText.innerText = currentQ.question;

  // Create Yes / No buttons wrapper
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "center";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "20px";
  wrapper.style.marginTop = "20px";
  wrapper.style.minHeight = "120px";
  wrapper.style.position = "relative";

  const yesBtn = document.createElement("button");
  yesBtn.className = "btn-primary";
  yesBtn.id = "yes-btn";
  yesBtn.innerText = "YES! 😍";
  yesBtn.style.transition = "all 0.3s ease";
  yesBtn.style.padding = "12px 30px";
  yesBtn.style.fontSize = "1.1rem";

  const noBtn = document.createElement("button");
  noBtn.className = "control-btn";
  noBtn.id = "no-btn";
  noBtn.innerText = "No 🙈";
  noBtn.style.transition = "all 0.3s ease";
  noBtn.style.padding = "12px 30px";
  noBtn.style.fontSize = "1.1rem";

  if (currentQ.mode === "reverse") {
    // Reverse mode: clicking YES shrinks YES and grows NO until she chooses NO!
    yesBtn.innerText = "Yes 😈";
    noBtn.innerText = "NO! ❤️";
    noBtn.className = "btn-primary";
    yesBtn.className = "control-btn";

    yesBtn.onclick = () => handleReverseYesClick(yesBtn, noBtn);
    noBtn.onclick = () => handleQuestionSuccess(currentQ.noMsg);
  } else {
    // Normal mode: clicking NO shrinks NO and grows YES until she chooses YES!
    yesBtn.onclick = () => handleQuestionSuccess(currentQ.yesMsg);
    noBtn.onclick = () => handleNormalNoClick(yesBtn, noBtn);
  }

  wrapper.appendChild(yesBtn);
  wrapper.appendChild(noBtn);
  optionsContainer.appendChild(wrapper);
}

function handleNormalNoClick(yesBtn, noBtn) {
  clickCount++;
  yesScale += 0.45;
  noScale -= 0.25;

  yesBtn.style.transform = `scale(${yesScale})`;
  yesBtn.style.zIndex = "10";

  if (noScale <= 0.1 || clickCount >= 4) {
    noBtn.style.display = "none";
  } else {
    noBtn.style.transform = `scale(${noScale})`;
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 40;
    noBtn.style.transform += ` translate(${randomX}px, ${randomY}px)`;
  }
}

function handleReverseYesClick(yesBtn, noBtn) {
  clickCount++;
  noScale += 0.45;
  yesScale -= 0.25;

  noBtn.style.transform = `scale(${noScale})`;
  noBtn.style.zIndex = "10";

  if (yesScale <= 0.1 || clickCount >= 4) {
    yesBtn.style.display = "none";
  } else {
    yesBtn.style.transform = `scale(${yesScale})`;
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 40;
    yesBtn.style.transform += ` translate(${randomX}px, ${randomY}px)`;
  }
}

function handleQuestionSuccess(msg) {
  const feedback = document.getElementById("feedback-text");
  const optionsContainer = document.getElementById("options-container");

  optionsContainer.innerHTML = "";
  feedback.innerText = msg;
  feedback.style.color = "#f0c27b";
  feedback.style.fontSize = "1.3rem";
  feedback.classList.remove("hide");

  setTimeout(() => {
    currentQIndex++;
    renderPlayfulQuestion();
  }, 2500);
}

function resetPlayfulQuestions() {
  currentQIndex = 0;
  renderPlayfulQuestion();
}

function redeemCoupon(element, title) {
  if (!element || element.classList.contains("redeemed")) return;
  
  element.classList.add("redeemed");
  const btn = element.querySelector(".coupon-btn");
  if (btn) {
    btn.innerText = "Redeemed 🎉";
    btn.style.background = "var(--primary)";
    btn.style.color = "var(--bg-primary)";
  }
}

/* ==========================================================================
   SECRET MEMORY LOCK UNLOCKER
   ========================================================================== */
function unlockSecretMemory() {
  const input = document.getElementById("secret-pass");
  const lockScreen = document.getElementById("lock-screen");
  const unlockedContent = document.getElementById("unlocked-content");
  const errorMsg = document.getElementById("lock-error");

  if (!input) return;

  const val = input.value.trim().replace(/\s+/g, "");

  // Accept 12:50 or 1250 or 12.50
  if (val === "12:50" || val === "1250" || val === "12.50") {
    lockScreen.style.display = "none";
    unlockedContent.style.display = "block";
    errorMsg.style.display = "none";
  } else {
    errorMsg.style.display = "block";
  }
}

/* ==========================================================================
   GLOBAL SITE PASSCODE PROTECTION
   ========================================================================== */
function checkSitePasscode() {
  const input = document.getElementById("site-passcode-input");
  const gate = document.getElementById("site-passcode-gate");
  const errorMsg = document.getElementById("site-passcode-error");

  if (!input) return;

  const val = input.value.trim().replace(/\s+/g, "").toLowerCase();

  // Accept passwords: "shravani", "12:50", "1250", "shravu"
  if (val === "shravani" || val === "12:50" || val === "1250" || val === "shravu" || val === "12.50") {
    sessionStorage.setItem("site_unlocked", "true");
    if (gate) gate.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";
  } else {
    if (errorMsg) errorMsg.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gate = document.getElementById("site-passcode-gate");
  if (gate) {
    if (sessionStorage.getItem("site_unlocked") === "true") {
      gate.style.display = "none";
    } else {
      gate.style.display = "flex";
      const input = document.getElementById("site-passcode-input");
      if (input) {
        input.addEventListener("keyup", (e) => {
          if (e.key === "Enter") checkSitePasscode();
        });
      }
    }
  }
});
