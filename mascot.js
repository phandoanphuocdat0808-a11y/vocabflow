/**
 * =========================================================================================
 * VOCABFLOW - AUTONOMOUS MASCOT MODULE (mascot.js)
 * =========================================================================================
 * - Layered SVG Rigging Model (Body, Tail, Head, Hat, Eyes & Pupils, Wings, Feet)
 * - Mouse-Tracking Pupils & Eye Dynamics
 * - Autonomous State Machine: PATROL, IDLE/CURIOUS, PLAYFUL, CELEBRATE, SLEEPY (AFK)
 * - Public API: window.VocabMascot
 * =========================================================================================
 */

(function () {
  'use strict';

  // 25+ CÂU NÓI TRUYỀN CẢM HỨNG HỌC TẬP TỰ ĐỘNG
  const MASCOT_QUOTES = [
    "Phát âm chuẩn từng âm vị IPA là chìa khóa để người bản xứ hiểu bạn ngay từ giây đầu tiên! 🎙️",
    "Đừng sợ phát âm sai. Mỗi lần sửa là một lần bạn tiến gần hơn tới sự lưu loát! ✨",
    "Shadowing không chỉ là nhại giọng, đó là cách bạn học nhịp thở và ngữ điệu tự nhiên! 🗣️",
    "Một từ vựng mới là một cánh cửa mới mở ra thế giới! 🌍",
    "Chuỗi học tập của bạn đang rực cháy, đừng để ngọn lửa này tắt nhé! 🔥",
    "Não bộ ghi nhớ tốt nhất khi bạn lặp lại ngắt quãng theo 5 Hộp Leitner! 🧠",
    "15 phút luyện tập nghiêm túc mỗi ngày hơn hẳn 3 tiếng học dồn dập cuối tuần! ⏱️",
    "Khi bạn phát âm đúng, kỹ năng nghe của bạn sẽ tự động tăng vọt gấp đôi! 🎧",
    "Hãy chú ý các âm đuôi /s/, /z/, /t/, /d/ – chúng tạo nên đẳng cấp của người nói tiếng Anh! 💎",
    "Âm /θ/ và /ð/ rất dễ: chỉ cần đặt nhẹ đầu lưỡi ở giữa 2 hàm răng và đẩy luồng hơi! 👅",
    "Tự tin nói to là bí quyết nhanh nhất để cơ miệng quen với các âm vị quốc tế! 🚀",
    "Mỗi từ vựng được đưa vào Hộp 5 là một chiến thắng vĩnh viễn trong trí nhớ dài hạn! 🏆",
    "Nghe chép chính tả Dictation giúp bạn triệt tiêu hoàn toàn thói quen đoán mò từ vựng! ✍️",
    "Cố lên bạn nhé! Trí thông minh là kết quả của sự kiên trì rèn luyện mỗi ngày! 🌟",
    "Thử luyện nói đuổi theo đúng tốc độ 0.9x để cảm nhận nhịp ngắt tự nhiên nhé! 🎵",
    "Không có lối tắt để thành thạo tiếng Anh, nhưng VocabFlow là người bạn đồng hành thông minh nhất! 🦉",
    "Khi đọc câu Shadowing, hãy thả lỏng vai và thở đều bằng cơ hoành! 🧘",
    "Đích đến của việc học phát âm không phải là hoàn hảo, mà là sự tự tin và truyền cảm hứng! 💬",
    "Hôm nay bạn đã sẵn sàng chinh phục thêm những từ vựng đỉnh cao chưa nào? 🎯"
  ];

  class VocabMascotEngine {
    constructor() {
      this.container = null;
      this.rootElement = null;
      this.svgElement = null;
      this.speechBubble = null;
      this.speechText = null;

      // State Management
      this.state = 'idle'; // 'idle', 'patrol', 'playful', 'celebrate', 'sleepy'
      this.direction = 1; // 1 = right, -1 = left
      this.positionX = 0;
      this.isWalking = false;
      this.idleTimer = null;
      this.afkTimer = null;
      this.lastInteractionTime = Date.now();
      this.speechTimer = null;

      // Mouse tracking coordinates
      this.mouseTarget = { x: 0, y: 0 };
      this.currentLook = { x: 0, y: 0 };

      // Bind methods
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleUserActivity = this.handleUserActivity.bind(this);
      this.stepMascotLoop = this.stepMascotLoop.bind(this);
    }

    /**
     * Khởi tạo Mascot vào container DOM
     */
    init(containerSelector = '#hero-mascot-container') {
      this.container = document.querySelector(containerSelector);
      if (!this.container) {
        console.warn('[VocabMascot] Container not found:', containerSelector);
        return;
      }

      this.injectStyles();
      this.buildDOM();
      this.bindEvents();
      this.startLoop();

      // Greeting ban đầu sau 600ms
      setTimeout(() => {
        this.flapWings();
        this.wobbleHat();
        this.speak("Chào bạn! Hãy chạm vào tôi hoặc bắt đầu ôn tập hôm nay nhé! 🚀", 4000);
      }, 600);
    }

    /**
     * Thêm CSS Styles riêng cho Mascot
     */
    injectStyles() {
      if (document.getElementById('vocab-mascot-styles')) return;

      const style = document.createElement('style');
      style.id = 'vocab-mascot-styles';
      style.textContent = `
        /* Mascot Root Container */
        #vocab-mascot-root {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
          touch-action: manipulation;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #mascot-owl-stage {
          position: relative;
          width: 130px;
          height: 130px;
          cursor: pointer;
          filter: drop-shadow(0 10px 20px rgba(99, 102, 241, 0.22));
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        #mascot-owl-stage:hover {
          transform: scale(1.06);
        }

        #mascot-owl-stage:active {
          transform: scale(0.94);
        }

        /* 3D Somersault Flip Animation */
        @keyframes mascotSomersault3D {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          20% { transform: translateY(-30px) rotate(-20deg) scale(1.18); }
          50% { transform: translateY(-48px) rotate(180deg) scale(1.3); }
          80% { transform: translateY(-18px) rotate(340deg) scale(1.12); }
          100% { transform: translateY(0) rotate(360deg) scale(1); }
        }

        .mascot-anim-somersault {
          transform-origin: center center;
          animation: mascotSomersault3D 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Float Animation */
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .mascot-anim-float {
          animation: mascotFloat 3.2s infinite ease-in-out;
        }

        /* Cute Walk Cycle Animation */
        @keyframes mascotCuteWalk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(-6deg); }
          75% { transform: translateY(-6px) rotate(6deg); }
        }

        .mascot-anim-walk {
          transform-origin: center bottom;
          animation: mascotCuteWalk 0.45s infinite ease-in-out;
        }

        /* Look Around Animation */
        @keyframes mascotLookAround {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) translateX(-4px) scale(1.03); }
          75% { transform: rotate(10deg) translateX(4px) scale(1.03); }
        }

        .mascot-anim-look {
          transform-origin: center center;
          animation: mascotLookAround 1.8s ease-in-out;
        }

        /* Playful Wiggle Butt Animation */
        @keyframes mascotWiggleButt {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-9deg) scaleX(1.06); }
          40% { transform: rotate(9deg) scaleX(0.94); }
          60% { transform: rotate(-9deg) scaleX(1.06); }
          80% { transform: rotate(9deg) scaleX(0.94); }
        }

        .mascot-anim-wiggle {
          transform-origin: center bottom;
          animation: mascotWiggleButt 0.8s ease-in-out;
        }

        /* Wing Flapping */
        @keyframes mascotWingLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-45deg) scaleY(1.2); }
        }

        @keyframes mascotWingRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(45deg) scaleY(1.2); }
        }

        .mascot-wing-flap-l {
          transform-origin: 26px 64px;
          animation: mascotWingLeft 0.16s infinite ease-in-out;
        }

        .mascot-wing-flap-r {
          transform-origin: 94px 64px;
          animation: mascotWingRight 0.16s infinite ease-in-out;
        }

        /* Hat Wobble */
        @keyframes mascotHatWobble {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(16deg) translateY(-4px); }
        }

        .mascot-hat-wobble {
          transform-origin: 60px 26px;
          animation: mascotHatWobble 0.6s ease-in-out;
        }

        /* Natural Eye Blinking */
        @keyframes mascotEyeBlink {
          0%, 88%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.08); }
        }

        .mascot-eye-blink-l {
          transform-origin: 44px 50px;
          animation: mascotEyeBlink 3.6s infinite ease-in-out;
        }

        .mascot-eye-blink-r {
          transform-origin: 76px 50px;
          animation: mascotEyeBlink 3.6s infinite ease-in-out;
        }

        /* Sleepy / AFK State */
        @keyframes mascotZzzFloat {
          0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
          50% { opacity: 1; transform: translate(8px, -14px) scale(1); }
          100% { opacity: 0; transform: translate(16px, -28px) scale(1.3); }
        }

        .mascot-zzz-particle {
          position: absolute;
          top: 10px;
          right: 15px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          color: #818CF8;
          font-size: 14px;
          pointer-events: none;
          animation: mascotZzzFloat 2.2s infinite ease-out;
        }

        /* Speech Bubble Glassmorphism */
        .mascot-speech-bubble {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.14);
          border-radius: 18px;
          padding: 10px 14px;
          max-width: 320px;
          font-size: 12px;
          line-height: 1.5;
          color: #334155;
          font-weight: 600;
          transition: all 0.25s ease-out;
          position: relative;
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Dựng cấu trúc DOM của Mascot và SVG đa lớp
     */
    buildDOM() {
      // Tìm vị trí cấy Mascot
      let stageContainer = document.getElementById('mascot-wrapper');
      if (!stageContainer) {
        stageContainer = document.createElement('div');
        stageContainer.id = 'mascot-wrapper';
        stageContainer.className = 'flex flex-col items-center justify-center flex-shrink-0 transition-all duration-700';
        this.container.appendChild(stageContainer);
      }

      stageContainer.innerHTML = `
        <div id="vocab-mascot-root">
          <!-- SVG Rigged Owl Mascot -->
          <div id="mascot-owl-stage" class="mascot-anim-float" title="Chạm vào Cú để xem nhào lộn 3D & nghe cảm hứng!">
            <svg id="mascot-svg" viewBox="0 0 120 120" class="w-full h-full select-none pointer-events-none">
              <defs>
                <linearGradient id="mOwlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#818CF8" />
                  <stop offset="50%" stop-color="#6366F1" />
                  <stop offset="100%" stop-color="#4F46E5" />
                </linearGradient>
                <linearGradient id="mOwlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#FFFFFF" />
                  <stop offset="100%" stop-color="#F1F5F9" />
                </linearGradient>
                <linearGradient id="mBeakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FBBF24" />
                  <stop offset="100%" stop-color="#F59E0B" />
                </linearGradient>
                <linearGradient id="mCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1E293B" />
                  <stop offset="100%" stop-color="#0F172A" />
                </linearGradient>
                <filter id="mOwlShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#4338CA" flood-opacity="0.25" />
                </filter>
              </defs>

              <!-- Feet / Paws -->
              <g id="mascot-feet">
                <ellipse id="mascot-foot-left" cx="46" cy="108" rx="8" ry="4.5" fill="#F59E0B" />
                <ellipse id="mascot-foot-right" cx="74" cy="108" rx="8" ry="4.5" fill="#F59E0B" />
              </g>

              <!-- Tail Feathers -->
              <g id="mascot-tail">
                <path d="M54 102 Q60 114 66 102 Z" fill="#3730A3" opacity="0.9" />
              </g>

              <!-- Main Body -->
              <g id="mascot-body">
                <rect x="22" y="32" width="76" height="76" rx="38" fill="url(#mOwlBodyGrad)" filter="url(#mOwlShadow)" />
              </g>

              <!-- Wings -->
              <g id="mascot-wings">
                <path id="mascot-wing-left" d="M22 62 Q10 75 24 88 Q28 75 28 64 Z" fill="#3730A3" opacity="0.95" />
                <path id="mascot-wing-right" d="M98 62 Q110 75 96 88 Q92 75 92 64 Z" fill="#3730A3" opacity="0.95" />
              </g>

              <!-- Belly Bib -->
              <g id="mascot-belly">
                <path d="M38 64 Q60 52 82 64 Q86 96 60 98 Q34 96 38 64 Z" fill="url(#mOwlBellyGrad)" />
                <path d="M52 74 Q60 78 68 74" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" fill="none" />
                <path d="M48 82 Q60 86 72 82" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" fill="none" />
              </g>

              <!-- Cheeks -->
              <ellipse cx="36" cy="62" rx="5.5" ry="4" fill="#FDA4AF" opacity="0.85" />
              <ellipse cx="84" cy="62" rx="5.5" ry="4" fill="#FDA4AF" opacity="0.85" />

              <!-- Eyes & Mouse-Tracking Pupils -->
              <g id="mascot-eyes">
                <!-- Left Eye -->
                <g id="mascot-eye-l" class="mascot-eye-blink-l">
                  <circle cx="44" cy="50" r="14" fill="#FFFFFF" />
                  <circle id="mascot-pupil-l" cx="44" cy="50" r="9" fill="#1E1B4B" />
                  <circle id="mascot-iris-l" cx="44" cy="50" r="5.5" fill="#3B82F6" opacity="0.85" />
                  <circle id="mascot-sparkle-l1" cx="41.5" cy="47.5" r="3.2" fill="#FFFFFF" />
                  <circle id="mascot-sparkle-l2" cx="46" cy="52" r="1.5" fill="#FFFFFF" />
                </g>

                <!-- Right Eye -->
                <g id="mascot-eye-r" class="mascot-eye-blink-r">
                  <circle cx="76" cy="50" r="14" fill="#FFFFFF" />
                  <circle id="mascot-pupil-r" cx="76" cy="50" r="9" fill="#1E1B4B" />
                  <circle id="mascot-iris-r" cx="76" cy="50" r="5.5" fill="#3B82F6" opacity="0.85" />
                  <circle id="mascot-sparkle-r1" cx="73.5" cy="47.5" r="3.2" fill="#FFFFFF" />
                  <circle id="mascot-sparkle-r2" cx="78" cy="52" r="1.5" fill="#FFFFFF" />
                </g>
              </g>

              <!-- Amber Beak -->
              <polygon id="mascot-beak" points="60,53 52,65 68,65" fill="url(#mBeakGrad)" rx="2" />

              <!-- Graduation Hat with Wobble -->
              <g id="mascot-hat-group" transform="translate(60, 26) rotate(-8) translate(-60, -26)">
                <path d="M42 26 Q60 18 78 26 L74 33 Q60 28 46 33 Z" fill="#0F172A" />
                <polygon points="60,10 92,23 60,34 28,23" fill="url(#mCapGrad)" />
                <circle cx="60" cy="22" r="2.5" fill="#FBBF24" />
                <path d="M60 22 Q72 26 78 36" stroke="#FBBF24" stroke-width="1.8" fill="none" stroke-linecap="round" />
                <circle cx="78" cy="37" r="2.2" fill="#F59E0B" />
              </g>
            </svg>
            <div id="mascot-zzz-box" class="hidden">
              <span class="mascot-zzz-particle" style="animation-delay: 0s;">Z</span>
              <span class="mascot-zzz-particle" style="animation-delay: 0.7s; font-size: 18px; right: 8px; top: -5px;">z</span>
              <span class="mascot-zzz-particle" style="animation-delay: 1.4s; font-size: 22px; right: 0px; top: -20px;">z</span>
            </div>
          </div>
          <span id="mascot-title-badge" class="text-[10px] font-extrabold text-slate-400 mt-1">Cú Giáo Sư VocabFlow</span>
        </div>
      `;

      this.rootElement = document.getElementById('vocab-mascot-root');
      this.svgElement = document.getElementById('mascot-owl-stage');
      this.speechBubble = document.getElementById('mascot-speech-text');
    }

    /**
     * Gắn sự kiện tương tác chuột, chạm, AFK listener
     */
    bindEvents() {
      if (this.svgElement) {
        this.svgElement.addEventListener('click', (e) => {
          e.stopPropagation();
          this.poke();
        });
      }

      // Theo dõi vị trí chuột để điều hướng con ngươi (Eye Tracking)
      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      window.addEventListener('keydown', this.handleUserActivity, { passive: true });
      window.addEventListener('touchstart', this.handleUserActivity, { passive: true });
      window.addEventListener('scroll', this.handleUserActivity, { passive: true });

      // Cập nhật vị trí mắt mượt mà bằng requestAnimationFrame
      const updatePupils = () => {
        if (this.state !== 'sleepy') {
          this.currentLook.x += (this.mouseTarget.x - this.currentLook.x) * 0.12;
          this.currentLook.y += (this.mouseTarget.y - this.currentLook.y) * 0.12;

          const pupilL = document.getElementById('mascot-pupil-l');
          const irisL = document.getElementById('mascot-iris-l');
          const sparkleL1 = document.getElementById('mascot-sparkle-l1');
          const sparkleL2 = document.getElementById('mascot-sparkle-l2');

          const pupilR = document.getElementById('mascot-pupil-r');
          const irisR = document.getElementById('mascot-iris-r');
          const sparkleR1 = document.getElementById('mascot-sparkle-r1');
          const sparkleR2 = document.getElementById('mascot-sparkle-r2');

          const dx = this.currentLook.x * 4;
          const dy = this.currentLook.y * 3.5;

          if (pupilL && irisL) {
            pupilL.setAttribute('cx', 44 + dx);
            pupilL.setAttribute('cy', 50 + dy);
            irisL.setAttribute('cx', 44 + dx);
            irisL.setAttribute('cy', 50 + dy);
            if (sparkleL1) { sparkleL1.setAttribute('cx', 41.5 + dx); sparkleL1.setAttribute('cy', 47.5 + dy); }
            if (sparkleL2) { sparkleL2.setAttribute('cx', 46 + dx); sparkleL2.setAttribute('cy', 52 + dy); }
          }

          if (pupilR && irisR) {
            pupilR.setAttribute('cx', 76 + dx);
            pupilR.setAttribute('cy', 50 + dy);
            irisR.setAttribute('cx', 76 + dx);
            irisR.setAttribute('cy', 50 + dy);
            if (sparkleR1) { sparkleR1.setAttribute('cx', 73.5 + dx); sparkleR1.setAttribute('cy', 47.5 + dy); }
            if (sparkleR2) { sparkleR2.setAttribute('cx', 78 + dx); sparkleR2.setAttribute('cy', 52 + dy); }
          }
        }
        requestAnimationFrame(updatePupils);
      };
      requestAnimationFrame(updatePupils);
    }

    handleMouseMove(e) {
      this.handleUserActivity();
      if (!this.svgElement) return;
      const rect = this.svgElement.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - mascotCenterX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - mascotCenterY) / (window.innerHeight / 2);

      // Giới hạn trong khoảng [-1, 1]
      this.mouseTarget.x = Math.max(-1, Math.min(1, deltaX));
      this.mouseTarget.y = Math.max(-1, Math.min(1, deltaY));
    }

    handleUserActivity() {
      this.lastInteractionTime = Date.now();
      if (this.state === 'sleepy') {
        this.wakeUp();
      }
    }

    /**
     * Vòng lặp State Machine tự vận hành
     */
    startLoop() {
      if (this.idleTimer) clearInterval(this.idleTimer);

      this.idleTimer = setInterval(() => {
        // Kiểm tra AFK (> 2 phút = 120,000ms không tương tác)
        if (Date.now() - this.lastInteractionTime > 120000 && this.state !== 'sleepy') {
          this.setState('sleepy');
          return;
        }

        if (this.state === 'sleepy') return;

        // Ngẫu nhiên chọn 1 trong các hành vi tự động
        const actions = ['patrol', 'look', 'wiggle', 'flap', 'speak'];
        const chosen = actions[Math.floor(Math.random() * actions.length)];

        switch (chosen) {
          case 'patrol':
            this.setState('patrol');
            break;
          case 'look':
            this.setState('look');
            break;
          case 'wiggle':
            this.setState('playful');
            break;
          case 'flap':
            this.flapWings();
            break;
          case 'speak':
          default:
            const randomQuote = MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)];
            this.speak(randomQuote, 5000);
            break;
        }
      }, 4500);
    }

    /**
     * Chuyển đổi trạng thái Mascot
     */
    setState(newState) {
      if (!this.svgElement) return;
      this.state = newState;

      const zzzBox = document.getElementById('mascot-zzz-box');
      if (zzzBox) {
        if (newState === 'sleepy') zzzBox.classList.remove('hidden');
        else zzzBox.classList.add('hidden');
      }

      if (newState === 'patrol') {
        this.svgElement.classList.add('mascot-anim-walk');
        this.direction *= -1;
        if (this.rootElement) {
          this.rootElement.style.transform = this.direction === -1
            ? 'rotateY(180deg) translateX(12px)'
            : 'rotateY(0deg) translateX(0px)';
        }
        setTimeout(() => {
          if (this.svgElement) this.svgElement.classList.remove('mascot-anim-walk');
          this.state = 'idle';
        }, 2200);
      } else if (newState === 'look') {
        this.svgElement.classList.add('mascot-anim-look');
        this.wobbleHat();
        setTimeout(() => {
          if (this.svgElement) this.svgElement.classList.remove('mascot-anim-look');
          this.state = 'idle';
        }, 1800);
      } else if (newState === 'playful') {
        this.svgElement.classList.add('mascot-anim-wiggle');
        setTimeout(() => {
          if (this.svgElement) this.svgElement.classList.remove('mascot-anim-wiggle');
          this.state = 'idle';
        }, 1200);
      } else if (newState === 'celebrate') {
        this.triggerCelebration();
      } else if (newState === 'sleepy') {
        this.speak("Zzz... Cú nghỉ ngơi một chút nhé... Hãy chạm để đánh thức! 🌙", 6000);
      }
    }

    /**
     * Đánh thức Cú khi người dùng hoạt động lại
     */
    wakeUp() {
      this.state = 'idle';
      const zzzBox = document.getElementById('mascot-zzz-box');
      if (zzzBox) zzzBox.classList.add('hidden');
      this.flapWings();
      this.wobbleHat();
      this.speak("Oa... Cú đã tỉnh giấc rồi! Cùng tiếp tục bứt phá nào! ☀️", 3500);
    }

    /**
     * Vỗ cánh
     */
    flapWings() {
      const leftWing = document.getElementById('mascot-wing-left');
      const rightWing = document.getElementById('mascot-wing-right');
      if (leftWing && rightWing) {
        leftWing.classList.add('mascot-wing-flap-l');
        rightWing.classList.add('mascot-wing-flap-r');
        setTimeout(() => {
          leftWing.classList.remove('mascot-wing-flap-l');
          rightWing.classList.remove('mascot-wing-flap-r');
        }, 1000);
      }
    }

    /**
     * Lắc Mũ Tốt Nghiệp
     */
    wobbleHat() {
      const hat = document.getElementById('mascot-hat-group');
      if (hat) {
        hat.classList.add('mascot-hat-wobble');
        setTimeout(() => hat.classList.remove('mascot-hat-wobble'), 700);
      }
    }

    /**
     * Cú phát biểu câu nói trong Bong bóng thoại
     */
    speak(message, duration = 4000) {
      if (!message) return;
      const speechEl = document.getElementById('mascot-speech-text');
      if (speechEl) {
        speechEl.style.opacity = '0';
        setTimeout(() => {
          speechEl.textContent = '"' + message + '"';
          speechEl.style.opacity = '1';
        }, 180);
      }

      if (this.speechTimer) clearTimeout(this.speechTimer);
      if (duration > 0) {
        this.speechTimer = setTimeout(() => {
          // Trở lại trạng thái bình thường nếu cần
        }, duration);
      }
    }

    /**
     * Chạm trực tiếp vào Cú (Poke)
     */
    poke() {
      this.handleUserActivity();
      if (this.svgElement) {
        this.svgElement.classList.remove('mascot-anim-somersault', 'mascot-anim-float');
        void this.svgElement.offsetWidth; // Force Reflow
        this.svgElement.classList.add('mascot-anim-somersault');
        setTimeout(() => {
          if (this.svgElement) {
            this.svgElement.classList.remove('mascot-anim-somersault');
            this.svgElement.classList.add('mascot-anim-float');
          }
        }, 900);
      }

      this.flapWings();
      this.wobbleHat();
      this.triggerConfetti();
      this.playChime();

      const quote = MASCOT_QUOTES[Math.floor(Math.random() * MASCOT_QUOTES.length)];
      this.speak(quote, 5000);

      if (window.showToast) {
        window.showToast('🦉 Cú Giáo Sư: ' + quote, 'info');
      }
    }

    /**
     * Kích hoạt chuỗi ăn mừng Celebrate (Nhào lộn 360 + Confetti + Chuông)
     */
    triggerCelebration() {
      this.poke();
    }

    /**
     * Hiệu ứng Pháo hoa Confetti
     */
    triggerConfetti() {
      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.72 },
          colors: ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6']
        });
      }
    }

    /**
     * Âm thanh Web Audio Chime trong trẻo
     */
    playChime() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.45);
        });
      } catch (e) { }
    }
  }

  // Khởi tạo instance Mascot duy nhất và công khai API ra window
  const mascotInstance = new VocabMascotEngine();

  window.VocabMascot = {
    init: (selector) => mascotInstance.init(selector),
    setState: (stateName) => mascotInstance.setState(stateName),
    speak: (msg, dur) => mascotInstance.speak(msg, dur),
    triggerCelebration: () => mascotInstance.triggerCelebration(),
    poke: () => mascotInstance.poke()
  };

  // Tự động khởi chạy khi trang đã sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.VocabMascot.init());
  } else {
    window.VocabMascot.init();
  }
})();
