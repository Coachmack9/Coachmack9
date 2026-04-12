/* ═══════════════════════════════════════════
   ProBot Solutions — Chat Widget
   Floating AI assistant bubble for probotma.boston
   Calls Cloudflare Worker proxy → Claude API
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Config ──────────────────────────────── */
  var WORKER_URL = 'https://probot-chat.coachmack9.workers.dev';
  var MAX_HISTORY = 12; /* keep last N messages in context */
  var BOT_NAME    = 'ProBot';
  var BOT_TAGLINE = 'AI Assistant · ProBot Solutions';

  /* ─── State ───────────────────────────────── */
  var messages  = [];   /* [{role, content}] */
  var isOpen    = false;
  var isLoading = false;

  /* ─── Inject styles ───────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    ':root{--pb-primary:#0EA5E9;--pb-dark:#0c1a2e;--pb-navy:#0f2847;--pb-muted:#94a3b8;--pb-radius:14px;}',
    '#pb-bubble{position:fixed;bottom:24px;right:24px;z-index:9999;width:56px;height:56px;border-radius:50%;background:var(--pb-primary);',
      'box-shadow:0 4px 20px rgba(14,165,233,0.45);cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'transition:transform 0.2s,box-shadow 0.2s;border:none;outline:none;}',
    '#pb-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(14,165,233,0.55);}',
    '#pb-bubble svg{width:26px;height:26px;fill:#fff;transition:opacity 0.15s;}',
    '#pb-badge{position:absolute;top:-3px;right:-3px;background:#ef4444;color:#fff;border-radius:50%;',
      'width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;',
      'font-family:Inter,Arial,sans-serif;border:2px solid #fff;}',

    '#pb-window{position:fixed;bottom:92px;right:24px;z-index:9998;width:360px;',
      'background:#fff;border-radius:18px;box-shadow:0 16px 60px rgba(0,0,0,0.18);',
      'display:flex;flex-direction:column;overflow:hidden;',
      'transition:opacity 0.2s,transform 0.2s;transform-origin:bottom right;}',
    '#pb-window.pb-hidden{opacity:0;transform:scale(0.92) translateY(12px);pointer-events:none;}',

    '#pb-header{background:linear-gradient(135deg,#0c1a2e,#0f2847);padding:16px 18px;',
      'display:flex;align-items:center;gap:12px;cursor:pointer;}',
    '#pb-avatar{width:40px;height:40px;border-radius:50%;background:var(--pb-primary);',
      'display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;}',
    '#pb-header-text{}',
    '#pb-header-name{color:#fff;font-weight:700;font-size:15px;font-family:Inter,Arial,sans-serif;line-height:1.2;}',
    '#pb-header-tag{color:var(--pb-muted);font-size:11px;font-family:Inter,Arial,sans-serif;}',
    '#pb-online{display:inline-block;width:8px;height:8px;background:#22c55e;border-radius:50%;margin-right:5px;}',
    '#pb-close-btn{margin-left:auto;background:rgba(255,255,255,0.1);border:none;border-radius:8px;',
      'color:#fff;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;',
      'font-size:16px;transition:background 0.15s;flex-shrink:0;}',
    '#pb-close-btn:hover{background:rgba(255,255,255,0.2);}',

    '#pb-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;',
      'min-height:280px;max-height:360px;background:#f8fafc;}',
    '#pb-messages::-webkit-scrollbar{width:4px;}',
    '#pb-messages::-webkit-scrollbar-track{background:transparent;}',
    '#pb-messages::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px;}',

    '.pb-msg{display:flex;gap:8px;align-items:flex-end;max-width:100%;}',
    '.pb-msg--bot{flex-direction:row;}',
    '.pb-msg--user{flex-direction:row-reverse;}',
    '.pb-msg__avatar{width:28px;height:28px;border-radius:50%;background:var(--pb-primary);',
      'display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}',
    '.pb-msg__bubble{padding:10px 14px;border-radius:14px;font-size:13.5px;line-height:1.55;',
      'font-family:Inter,Arial,sans-serif;max-width:calc(100% - 44px);}',
    '.pb-msg--bot .pb-msg__bubble{background:#fff;color:#1a202c;border-radius:4px 14px 14px 14px;',
      'box-shadow:0 1px 4px rgba(0,0,0,0.08);}',
    '.pb-msg--user .pb-msg__bubble{background:var(--pb-primary);color:#fff;border-radius:14px 4px 14px 14px;}',

    '.pb-typing{display:flex;align-items:center;gap:5px;padding:12px 14px;}',
    '.pb-dot{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:pb-bounce 1.2s infinite;}',
    '.pb-dot:nth-child(2){animation-delay:0.2s;}',
    '.pb-dot:nth-child(3){animation-delay:0.4s;}',
    '@keyframes pb-bounce{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-6px);}}',

    '#pb-input-row{padding:12px;background:#fff;border-top:1px solid #e2e8f0;display:flex;gap:8px;align-items:flex-end;}',
    '#pb-input{flex:1;border:1.5px solid #e2e8f0;border-radius:10px;padding:9px 12px;',
      'font-family:Inter,Arial,sans-serif;font-size:13.5px;color:#1a202c;resize:none;outline:none;',
      'max-height:100px;min-height:38px;transition:border-color 0.2s;background:#f8fafc;line-height:1.5;}',
    '#pb-input:focus{border-color:var(--pb-primary);background:#fff;}',
    '#pb-send{width:38px;height:38px;border-radius:10px;background:var(--pb-primary);border:none;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;transition:background 0.2s;flex-shrink:0;}',
    '#pb-send:hover{background:#0284C7;}',
    '#pb-send:disabled{background:#cbd5e1;cursor:not-allowed;}',
    '#pb-send svg{width:16px;height:16px;fill:#fff;}',

    '#pb-footer{text-align:center;padding:6px;background:#fff;border-top:1px solid #f1f5f9;}',
    '#pb-footer a{font-size:10px;color:#94a3b8;text-decoration:none;font-family:Inter,Arial,sans-serif;}',
    '#pb-footer a:hover{color:var(--pb-primary);}',

    '@media(max-width:420px){#pb-window{width:calc(100vw - 24px);right:12px;bottom:80px;}',
      '#pb-bubble{right:12px;bottom:12px;}}',
  ].join('');
  document.head.appendChild(style);

  /* ─── Build DOM ───────────────────────────── */
  function buildWidget() {
    /* Bubble button */
    var bubble = document.createElement('button');
    bubble.id = 'pb-bubble';
    bubble.setAttribute('aria-label', 'Open ProBot chat');
    bubble.innerHTML = [
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
        '<path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
      '</svg>',
    ].join('');

    /* Chat window */
    var win = document.createElement('div');
    win.id = 'pb-window';
    win.classList.add('pb-hidden');
    win.setAttribute('aria-hidden', 'true');
    win.innerHTML = [
      '<div id="pb-header">',
        '<div id="pb-avatar">🤖</div>',
        '<div id="pb-header-text">',
          '<div id="pb-header-name">' + BOT_NAME + '</div>',
          '<div id="pb-header-tag"><span id="pb-online"></span>' + BOT_TAGLINE + '</div>',
        '</div>',
        '<button id="pb-close-btn" aria-label="Close chat">✕</button>',
      '</div>',
      '<div id="pb-messages" role="log" aria-live="polite"></div>',
      '<div id="pb-input-row">',
        '<textarea id="pb-input" placeholder="Ask about AI voice agents…" rows="1" aria-label="Message ProBot"></textarea>',
        '<button id="pb-send" aria-label="Send message" disabled>',
          '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
        '</button>',
      '</div>',
      '<div id="pb-footer"><a href="https://probotma.boston" target="_blank">Powered by ProBot Solutions</a></div>',
    ].join('');

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    /* Wire events */
    bubble.addEventListener('click', toggleWidget);
    document.getElementById('pb-close-btn').addEventListener('click', closeWidget);
    document.getElementById('pb-header').addEventListener('click', function (e) {
      if (e.target.id !== 'pb-close-btn') closeWidget();
    });

    var input   = document.getElementById('pb-input');
    var sendBtn = document.getElementById('pb-send');

    input.addEventListener('input', function () {
      sendBtn.disabled = !this.value.trim() || isLoading;
      /* auto-resize */
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) sendMessage();
      }
    });

    sendBtn.addEventListener('click', sendMessage);

    /* Show welcome message */
    addBotMessage("Hi! I'm ProBot — your AI assistant for ProBot Solutions. I can answer questions about our AI voice agent service, pricing, the 25-Industry Playbook, or our partner program. What would you like to know?");
  }

  /* ─── Toggle / open / close ───────────────── */
  function toggleWidget() {
    if (isOpen) closeWidget(); else openWidget();
  }

  function openWidget() {
    isOpen = true;
    var win = document.getElementById('pb-window');
    win.classList.remove('pb-hidden');
    win.setAttribute('aria-hidden', 'false');
    document.getElementById('pb-bubble').setAttribute('aria-label', 'Close ProBot chat');
    document.getElementById('pb-bubble').innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    setTimeout(function () { document.getElementById('pb-input').focus(); }, 150);
  }

  function closeWidget() {
    isOpen = false;
    var win = document.getElementById('pb-window');
    win.classList.add('pb-hidden');
    win.setAttribute('aria-hidden', 'true');
    document.getElementById('pb-bubble').setAttribute('aria-label', 'Open ProBot chat');
    document.getElementById('pb-bubble').innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  }

  /* ─── Messages ────────────────────────────── */
  function addBotMessage(text) {
    var log = document.getElementById('pb-messages');
    var el  = document.createElement('div');
    el.className = 'pb-msg pb-msg--bot';
    el.innerHTML = [
      '<div class="pb-msg__avatar">🤖</div>',
      '<div class="pb-msg__bubble">' + escHtml(text) + '</div>',
    ].join('');
    log.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addUserMessage(text) {
    var log = document.getElementById('pb-messages');
    var el  = document.createElement('div');
    el.className = 'pb-msg pb-msg--user';
    el.innerHTML = '<div class="pb-msg__bubble">' + escHtml(text) + '</div>';
    log.appendChild(el);
    scrollToBottom();
  }

  function showTyping() {
    var log = document.getElementById('pb-messages');
    var el  = document.createElement('div');
    el.className = 'pb-msg pb-msg--bot';
    el.id = 'pb-typing-indicator';
    el.innerHTML = [
      '<div class="pb-msg__avatar">🤖</div>',
      '<div class="pb-msg__bubble pb-typing">',
        '<span class="pb-dot"></span>',
        '<span class="pb-dot"></span>',
        '<span class="pb-dot"></span>',
      '</div>',
    ].join('');
    log.appendChild(el);
    scrollToBottom();
  }

  function removeTyping() {
    var el = document.getElementById('pb-typing-indicator');
    if (el) el.parentNode.removeChild(el);
  }

  function scrollToBottom() {
    var log = document.getElementById('pb-messages');
    log.scrollTop = log.scrollHeight;
  }

  /* ─── Send message ────────────────────────── */
  function sendMessage() {
    var input = document.getElementById('pb-input');
    var text  = input.value.trim();
    if (!text || isLoading) return;

    addUserMessage(text);
    messages.push({ role: 'user', content: text });

    /* trim history */
    if (messages.length > MAX_HISTORY) {
      messages = messages.slice(messages.length - MAX_HISTORY);
    }

    input.value = '';
    input.style.height = 'auto';
    document.getElementById('pb-send').disabled = true;
    isLoading = true;

    showTyping();

    fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages }),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        removeTyping();
        var reply = data.content && data.content[0] && data.content[0].text
          ? data.content[0].text
          : 'Sorry, I had trouble responding. Please try again.';
        messages.push({ role: 'assistant', content: reply });
        addBotMessage(reply);
      })
      .catch(function () {
        removeTyping();
        addBotMessage("I'm having trouble connecting right now. Try emailing rob@probotsolutions.com or calling (781) 307-3117.");
      })
      .finally(function () {
        isLoading = false;
        var inp = document.getElementById('pb-input');
        document.getElementById('pb-send').disabled = !inp.value.trim();
      });
  }

  /* ─── Helpers ─────────────────────────────── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');
  }

  /* ─── Init ────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

})();
