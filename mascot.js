/**
 * =========================================================================================
 * VOCABFLOW - MASTER AUTONOMOUS UBIQUITOUS MASCOT & STRICT TUTOR ENGINE (mascot.js)
 * =========================================================================================
 * - Omnipresent Companion: Appears across ALL screens (Dashboard, Flashcard, Shadowing, Dictation, Words)
 * - 3 Dynamic Personas: Strict Tutor (Gia sư khó tính), Cute Buddy (Bạn học dễ thương), Wise Scholar
 * - Interactive Drag & Drop Physics with Parachute Touchdown & Belly Tickling
 * - Diamond Feeding 💎 Animation with Golden Gulp
 * - Sound FX Engine with Persistent Mute/Unmute Toggle (Web Audio API)
 * - Context-Aware Screen Monitoring (Flashcard Proctor, DJ Coach, Dictation Examiner)
 * - Redesigned Clean Minimalist Apple Glass UI & Floating Companion Dock
 * - Public API: window.VocabMascot
 * =========================================================================================
 */

(function () {
  'use strict';

  // 1. KHO CÂU NÓI: VỊ GIA SƯ KHÓ TÍNH & SẮC SẢO (STRICT TUTOR QUOTES)
  const STRICT_TUTOR_QUOTES = [
    "Đừng có lướt lướt nữa, đọc to rõ ràng từng âm cuối /s/, /t/, /d/ cho tôi! 🤨📏",
    "Học mới 5 phút đã định thoát à? Mục tiêu hôm nay còn chưa xong đâu đấy! ⏱️😤",
    "Âm đuôi nuốt mất rồi kìa! Đọc lại ngay, không được lười biếng! 🧐",
    "Đừng có đoán mò mặt chữ, mở to mắt nhìn phiên âm IPA bên dưới đi! 📖👀",
    "Tập trung cao độ! Não bộ đang xây dựng liên kết thần kinh, cấm vừa học vừa bấm điện thoại! ⚡🧠",
    "Lại bấm Again à? Tập trung nhìn vào thẻ 3 giây trước khi lật xem nào! 😤",
    "Tốt lắm, tạm chấp nhận được! Nhưng đừng vội tự mãn, còn nhiều từ nữa đang chờ! 🧐✨",
    "Đọc Shadowing là phải bắt chước cả nhịp thở và ngữ điệu, không được đọc đều đều như trả bài! 🎵🗣️",
    "Luyện âm vị là phải cử động cơ miệng dứt khoát! Ngậm ngậm trong miệng sao người bản xứ hiểu! 👅",
    "Sai một lần là bài học, sai 3 lần liên tiếp là do chưa tập trung! Nghe lại câu mẫu ngay! 🔍",
    "Nhanh lên nào, một ngày có 24 giờ mà tiếc 15 phút rèn luyện tương lai sao? ⏰",
    "Hộp 1 còn tồn nhiều từ kìa, vào dọn sạch ngay cho tôi trước khi đi ngủ! 🗂️",
    "Phát âm không có chỗ cho sự cẩu thả. Chuẩn từng milimet mới là đẳng cấp! 💎",
    "Muốn nói hay như người bản xứ thì phải chịu khó nghe đi nghe lại 10 lần! Cố lên! 🎧",
    "Trí nhớ ngắn hạn sẽ bốc hơi sau 24h nếu bạn không ôn Spaced Repetition hôm nay! 🧠🔥"
  ];

  // 2. KHO CÂU NÓI: BẠN HỌC THÂN THIỆN & CỔ VŨ (CUTE BUDDY QUOTES)
  const CUTE_BUDDY_QUOTES = [
    "Cố lên bạn ơi! Bạn đang làm rất tốt, mỗi ngày tiến bộ một chút là siêu lắm rồi! 🌟",
    "Shadowing cùng Cú nào! Nghe giai điệu câu tiếng Anh vui như một bài hát vậy! 🎶",
    "Một từ vựng mới là một cánh cửa mới mở ra thế giới! 🌍✨",
    "Chuỗi học tập của bạn đang rực cháy, đừng để ngọn lửa này tắt nhé! 🔥",
    "Bạn có thể nhấc bổng Cú lên hoặc cù lét vào bụng Cú để xả stress nha! 🪂🥰",
    "Đích đến của việc học phát âm không phải là hoàn hảo, mà là sự tự tin truyền cảm hứng! 💬",
    "Nghỉ mắt một chút rồi cùng Cú chinh phục tiếp thẻ từ vựng tiếp theo nhé! ☕🌈"
  ];

  // 3. KHO CÂU NÓI: GIÁO SƯ THÔNG THÁI (WISE SCHOLAR QUOTES)
  const SCHOLAR_QUOTES = [
    "Theo đường cong lãng quên Ebbinghaus, ôn tập đúng thời điểm giúp củng cố trí nhớ vĩnh viễn! 📚",
    "Âm vô thanh (Voiceless) và hữu thanh (Voiced) là nền tảng cốt lõi của ngữ âm học tiếng Anh! 🔬",
    "Não bộ học từ vựng hiệu quả gấp 3 lần khi đặt từ vào ngữ cảnh câu Shadowing hoàn chỉnh! 🧠",
    "Hệ thống 5 Hộp Leitner là thuật toán Spaced Repetition tối ưu nhất cho người tự học! 🗂️"
  ];

  class VocabMascotEngine {
    constructor() {
      this.container = null;
      this.rootElement = null;
      this.stageElement = null;
      this.svgElement = null;
      this.speechText = null;

      // Persona & Settings
      this.persona = localStorage.getItem('vocab_mascot_persona') || 'strict'; // 'strict', 'cute', 'scholar'
      this.isMuted = localStorage.getItem('vocab_mascot_muted') === 'true';
      this.isMinimized = localStorage.getItem('vocab_mascot_minimized') === 'true';
      this.currentScreen = 'screen-dashboard';

      // State Management
      this.state = 'idle'; // 'idle', 'patrol', 'playful', 'celebrate', 'sleepy', 'listening', 'dragging', 'falling', 'acting'
      this.direction = 1;
      this.idleTimer = null;
      this.lastInteractionTime = Date.now();
      this.speechTimer = null;
      this.blinkTimer = null;
      this.currentExpression = 'normal'; // 'normal', 'happy', 'sleepy', 'wink', 'shocked', 'dizzy', 'laser', 'strict'

      // Mouse tracking coordinates
      this.mouseTarget = { x: 0, y: 0 };
      this.currentLook = { x: 0, y: 0 };

      // Drag & Drop Physics State
      this.isDragging = false;
      this.dragStart = { x: 0, y: 0 };
      this.dragVelocity = { x: 0, y: 0 };
      this.lastDragTime = 0;

      // Tickle State
      this.tickleCount = 0;
      this.lastTickleTime = 0;

      // Bind methods
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleUserActivity = this.handleUserActivity.bind(this);
      this.handlePointerDown = this.handlePointerDown.bind(this);
      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerUp = this.handlePointerUp.bind(this);
    }

    /**
     * Khởi tạo Mascot đa màn hình toàn cục
     */
    init(containerSelector = '#mascot-wrapper') {
      this.container = document.querySelector(containerSelector) || document.querySelector('#mascot-wrapper') || document.querySelector('#hero-mascot-container');

      this.injectStyles();
      this.buildDOM();
      this.buildGlobalFloatingDock();
      this.bindEvents();
      this.startNaturalBlinking();
      this.startAutonomousLoop();
      this.updateSoundIconUI();
      this.updatePersonaBadgeUI();

      // Đồng bộ theo dõi màn hình
      this.detectCurrentScreen();

      // Lời chào mở đầu
      setTimeout(() => {
        this.flapWings();
        this.wobbleHat();
        if (this.persona === 'strict') {
          this.speak("Gia sư Cú đã sẵn sàng! Đọc to rõ ràng, không được lơ là một giây nào! 🧐📏", 4500);
        } else {
          this.speak("Chào bạn! Hãy chạm, kéo thả hoặc cùng Cú ôn tập phát âm nhé! 🚀", 4000);
        }
      }, 600);
    }

    /**
     * Thêm CSS Animations & Styles hiện đại
     */
    injectStyles() {
      if (document.getElementById('vocab-mascot-styles')) return;

      const style = document.createElement('style');
      style.id = 'vocab-mascot-styles';
      style.textContent = `
        /* Mascot Root Wrapper */
        #vocab-mascot-root {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
          touch-action: none;
          transition: transform 2.4s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 30;
        }

        #mascot-owl-stage {
          position: relative;
          width: 125px;
          height: 125px;
          cursor: grab;
          filter: drop-shadow(0 10px 22px rgba(99, 102, 241, 0.24));
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: center bottom;
        }

        #mascot-owl-stage:active {
          cursor: grabbing;
        }

        /* 3D Somersault Flip Animation */
        @keyframes mascotSomersault3D {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          20% { transform: translateY(-32px) rotate(-25deg) scale(1.2); }
          50% { transform: translateY(-52px) rotate(180deg) scale(1.32); }
          80% { transform: translateY(-18px) rotate(335deg) scale(1.12); }
          100% { transform: translateY(0) rotate(360deg) scale(1); }
        }

        .mascot-anim-somersault {
          transform-origin: center center;
          animation: mascotSomersault3D 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Idle Floating Animation */
        @keyframes mascotFloatSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .mascot-anim-float {
          animation: mascotFloatSubtle 3.4s infinite ease-in-out;
        }

        /* Waddling Walk Cycle */
        @keyframes mascotCuteWalk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-7px) rotate(-6deg); }
          75% { transform: translateY(-7px) rotate(6deg); }
        }

        .mascot-anim-walk {
          transform-origin: center bottom;
          animation: mascotCuteWalk 0.46s infinite ease-in-out;
        }

        /* Dragging Air Flail */
        @keyframes mascotAirFlail {
          0%, 100% { transform: rotate(-5deg) scale(1.08); }
          50% { transform: rotate(5deg) scale(1.12); }
        }

        .mascot-anim-dragging {
          animation: mascotAirFlail 0.25s infinite ease-in-out;
        }

        @keyframes mascotLegFlailL { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-25deg) translate(-3px, 4px); } }
        @keyframes mascotLegFlailR { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(25deg) translate(3px, 4px); } }
        .mascot-leg-flail-l { animation: mascotLegFlailL 0.2s infinite ease-in-out; transform-origin: 46px 108px; }
        .mascot-leg-flail-r { animation: mascotLegFlailR 0.2s infinite ease-in-out; transform-origin: 74px 108px; }

        /* Parachute Gliding Descent */
        @keyframes mascotParachuteSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
        .mascot-anim-parachute { transform-origin: center top; animation: mascotParachuteSway 1.2s infinite ease-in-out; }

        /* Squish Touchdown Bounce */
        @keyframes mascotSquishLanding {
          0% { transform: scale(1.25, 0.75) translateY(6px); }
          50% { transform: scale(0.9, 1.15) translateY(-8px); }
          80% { transform: scale(1.05, 0.95) translateY(2px); }
          100% { transform: scale(1, 1) translateY(0); }
        }

        .mascot-anim-squish {
          transform-origin: center bottom;
          animation: mascotSquishLanding 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Tickle Squiggle */
        @keyframes mascotTickleSquiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-14deg) scale(1.08, 0.95); }
          75% { transform: rotate(14deg) scale(0.95, 1.08); }
        }

        .mascot-anim-tickle {
          animation: mascotTickleSquiggle 0.18s infinite ease-in-out;
        }

        /* Clumsy Trip & Faceplant */
        @keyframes mascotTripFall {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-15deg); }
          50% { transform: translateY(18px) rotate(85deg); }
          80% { transform: translateY(18px) rotate(90deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .mascot-anim-trip {
          transform-origin: center bottom;
          animation: mascotTripFall 2.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @keyframes mascotHatFly {
          0% { transform: translate(60px, 26px) rotate(-8deg) translate(-60px, -26px); }
          30% { transform: translate(110px, -20px) rotate(140deg); }
          60% { transform: translate(130px, 60px) rotate(220deg); }
          90% { transform: translate(60px, 26px) rotate(-8deg) translate(-60px, -26px); }
        }

        .mascot-hat-flying {
          animation: mascotHatFly 2.6s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Peek-a-Boo Duck & Pop */
        @keyframes mascotPeekDuck {
          0% { transform: translateY(0); }
          20%, 75% { transform: translateY(82px); }
          85% { transform: translateY(-24px) scale(1.15); }
          100% { transform: translateY(0) scale(1); }
        }

        .mascot-anim-peek {
          animation: mascotPeekDuck 3.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Espresso Buzz */
        @keyframes mascotEspressoBuzz {
          0%, 100% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(-3px, 2px) scale(1.05); }
          40% { transform: translate(3px, -2px) scale(0.98); }
          60% { transform: translate(-2px, -3px) scale(1.04); }
          80% { transform: translate(2px, 3px) scale(0.97); }
        }

        .mascot-anim-espresso {
          animation: mascotEspressoBuzz 0.08s infinite linear;
        }

        /* Drama Queen Faint */
        @keyframes mascotDramaFaint {
          0% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-8px) rotate(-15deg); }
          60%, 85% { transform: translateY(22px) rotate(-85deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .mascot-anim-faint {
          transform-origin: center bottom;
          animation: mascotDramaFaint 3.0s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Strict Ruler Tap */
        @keyframes mascotRulerTap {
          0%, 100% { transform: rotate(0deg); }
          30%, 70% { transform: rotate(-35deg); }
          50% { transform: rotate(15deg); }
        }

        .mascot-anim-ruler {
          transform-origin: 24px 80px;
          animation: mascotRulerTap 0.6s 3 ease-in-out;
        }

        /* DJ Beat Head Nod */
        @keyframes mascotDjBeat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(8px) rotate(-6deg); } }
        .mascot-anim-dj { transform-origin: center bottom; animation: mascotDjBeat 0.42s infinite ease-in-out; }

        /* Wing Flapping */
        @keyframes mascotWingLeftFlap { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-50deg) scaleY(1.2); } }
        @keyframes mascotWingRightFlap { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(50deg) scaleY(1.2); } }
        .mascot-wing-flap-l { transform-origin: 24px 64px; animation: mascotWingLeftFlap 0.24s 4 ease-in-out; }
        .mascot-wing-flap-r { transform-origin: 96px 64px; animation: mascotWingRightFlap 0.24s 4 ease-in-out; }

        @keyframes mascotWingPanicL { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(-70deg); } }
        @keyframes mascotWingPanicR { 0%, 100% { transform: rotate(10deg); } 50% { transform: rotate(70deg); } }
        .mascot-wing-panic-l { transform-origin: 24px 64px; animation: mascotWingPanicL 0.12s infinite ease-in-out; }
        .mascot-wing-panic-r { transform-origin: 96px 64px; animation: mascotWingPanicR 0.12s infinite ease-in-out; }

        /* Diamond Gulp */
        @keyframes gemFallingAnim {
          0% { transform: translateY(-80px) scale(0.6) rotate(0deg); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(12px) scale(1.1) rotate(180deg); opacity: 1; }
        }
        .mascot-gem-drop { animation: gemFallingAnim 0.75s cubic-bezier(0.35, 0, 0.25, 1) forwards; }

        @keyframes bellyGlowAnim { 0%, 100% { fill: url(#mOwlBellyGrad); } 50% { fill: #FDE047; filter: drop-shadow(0 0 10px #F59E0B); } }
        .mascot-belly-glowing { animation: bellyGlowAnim 1.2s ease-out; }

        /* Global Floating Companion Dock for other screens */
        #global-mascot-dock {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          pointer-events: auto;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        #global-mascot-dock.dock-hidden {
          transform: translateY(120px) scale(0.8);
          opacity: 0;
          pointer-events: none;
        }

        /* Floating Bubble above Dock */
        .dock-speech-bubble {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226, 232, 240, 0.85);
          box-shadow: 0 12px 30px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04);
          border-radius: 18px;
          padding: 10px 14px;
          max-width: 260px;
          font-size: 11.5px;
          font-weight: 700;
          color: #1E293B;
          line-height: 1.45;
          margin-bottom: 8px;
          position: relative;
          animation: fadeIn 0.3s ease-out;
        }

        .dock-speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 28px;
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.94);
          border-right: 1px solid rgba(226, 232, 240, 0.85);
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
          transform: rotate(45deg);
        }

        /* Floating Owl Mini Stage */
        .dock-owl-avatar {
          width: 72px;
          height: 72px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(14px);
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 10px 25px -3px rgba(99, 102, 241, 0.28), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .dock-owl-avatar:hover {
          transform: scale(1.08) translateY(-3px);
        }

        .dock-owl-avatar:active {
          transform: scale(0.95);
        }

        /* Compact Micro Control Toolbar */
        .mascot-micro-toolbar {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }

        .mascot-micro-btn {
          height: 26px;
          padding: 0 9px;
          border-radius: 13px;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(226, 232, 240, 0.9);
          color: #475569;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
          cursor: pointer;
          user-select: none;
        }

        .mascot-micro-btn:hover {
          background: #FFFFFF;
          color: #4F46E5;
          border-color: #C7D2FE;
          transform: translateY(-1px);
        }

        .mascot-micro-btn:active {
          transform: scale(0.95);
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * Dựng cấu trúc DOM của Mascot trong Hero card
     */
    buildDOM() {
      let stageContainer = document.getElementById('mascot-wrapper');
      if (!stageContainer) {
        stageContainer = document.createElement('div');
        stageContainer.id = 'mascot-wrapper';
        stageContainer.className = 'flex flex-col items-center justify-center flex-shrink-0';
        if (this.container) this.container.appendChild(stageContainer);
      }

      stageContainer.innerHTML = `
        <div id="vocab-mascot-root">
          <!-- SVG Rigged Owl Mascot Stage -->
          <div id="mascot-owl-stage" class="mascot-anim-float" title="Kéo thả Cú, chạm, cù lét bụng hoặc cho Cú ăn Kim Cương!">
            
            <!-- Prop 1: Mini Parachute -->
            <svg id="mascot-parachute" viewBox="0 0 120 70" class="absolute -top-14 left-0 w-full h-16 pointer-events-none hidden">
              <path d="M12 42 Q60 -12 108 42 Z" fill="#EF4444" stroke="#DC2626" stroke-width="1.5" />
              <path d="M36 38 Q60 -12 84 38 Z" fill="#FBBF24" />
              <path d="M50 36 Q60 -12 70 36 Z" fill="#3B82F6" />
              <line x1="12" y1="42" x2="60" y2="68" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 1" />
              <line x1="40" y1="40" x2="60" y2="68" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 1" />
              <line x1="80" y1="40" x2="60" y2="68" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 1" />
              <line x1="108" y1="42" x2="60" y2="68" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 1" />
            </svg>

            <!-- Prop 2: Falling Diamond for Feeding -->
            <div id="mascot-falling-gem" class="absolute -top-12 left-1/2 -translate-x-1/2 text-2xl pointer-events-none hidden">
              💎
            </div>

            <!-- Main Mascot SVG -->
            <svg id="mascot-svg" viewBox="0 0 120 120" class="w-full h-full select-none">
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
                <linearGradient id="mCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FDE047" />
                  <stop offset="100%" stop-color="#D97706" />
                </linearGradient>
                <linearGradient id="mNeonHeadphones" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#06B6D4" />
                  <stop offset="100%" stop-color="#D946EF" />
                </linearGradient>
                <filter id="mOwlShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#4338CA" flood-opacity="0.26" />
                </filter>
              </defs>

              <!-- Saiyan Flaming Aura Layer -->
              <g id="mascot-saiyan-aura" class="hidden">
                <path d="M16 28 Q60 -8 104 28 Q118 70 100 112 Q60 126 20 112 Q2 70 16 28 Z" fill="#F59E0B" opacity="0.45" filter="blur(6px)" />
                <path d="M22 34 Q60 0 98 34 Q110 70 94 106 Q60 118 26 106 Q10 70 22 34 Z" fill="#FBBF24" opacity="0.65" filter="blur(3px)" />
              </g>

              <!-- Feet / Paws -->
              <g id="mascot-feet">
                <ellipse id="mascot-foot-left" cx="46" cy="108" rx="8.5" ry="4.5" fill="#F59E0B" />
                <ellipse id="mascot-foot-right" cx="74" cy="108" rx="8.5" ry="4.5" fill="#F59E0B" />
              </g>

              <!-- Tail Feathers -->
              <g id="mascot-tail">
                <path id="mascot-tail-path" d="M52 102 Q60 115 68 102 Z" fill="#3730A3" opacity="0.95" />
              </g>

              <!-- Main Body -->
              <g id="mascot-body">
                <rect x="22" y="32" width="76" height="76" rx="38" fill="url(#mOwlBodyGrad)" filter="url(#mOwlShadow)" />
              </g>

              <!-- Left & Right Wings -->
              <g id="mascot-wings">
                <path id="mascot-wing-left" d="M22 62 Q10 75 24 88 Q28 75 28 64 Z" fill="#3730A3" opacity="0.95" />
                <path id="mascot-wing-right" d="M98 62 Q110 75 96 88 Q92 75 92 64 Z" fill="#3730A3" opacity="0.95" />
              </g>

              <!-- White Belly Bib (Interactive for Tickling) -->
              <g id="mascot-belly" class="cursor-pointer" title="Cù lét vào bụng Cú nè!">
                <path id="mascot-belly-path" d="M38 64 Q60 52 82 64 Q86 96 60 98 Q34 96 38 64 Z" fill="url(#mOwlBellyGrad)" />
                <path d="M52 74 Q60 78 68 74" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" fill="none" />
                <path d="M48 82 Q60 86 72 82" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" fill="none" />
              </g>

              <!-- Rosy Cheeks -->
              <ellipse id="mascot-cheek-l" cx="36" cy="62" rx="5.5" ry="4" fill="#FDA4AF" opacity="0.85" />
              <ellipse id="mascot-cheek-r" cx="84" cy="62" rx="5.5" ry="4" fill="#FDA4AF" opacity="0.85" />

              <!-- Head & Facial Expression Groups -->
              <g id="mascot-head-group">
                <!-- 1. Normal Open Eyes with Tracking Pupils -->
                <g id="mascot-eyes-normal">
                  <g id="mascot-eye-l" class="mascot-eye-blink">
                    <circle cx="44" cy="50" r="14" fill="#FFFFFF" />
                    <circle id="mascot-pupil-l" cx="44" cy="50" r="9" fill="#1E1B4B" />
                    <circle id="mascot-iris-l" cx="44" cy="50" r="5.5" fill="#3B82F6" opacity="0.85" />
                    <circle id="mascot-sparkle-l1" cx="41.5" cy="47.5" r="3.2" fill="#FFFFFF" />
                    <circle id="mascot-sparkle-l2" cx="46" cy="52" r="1.5" fill="#FFFFFF" />
                  </g>
                  <g id="mascot-eye-r" class="mascot-eye-blink">
                    <circle cx="76" cy="50" r="14" fill="#FFFFFF" />
                    <circle id="mascot-pupil-r" cx="76" cy="50" r="9" fill="#1E1B4B" />
                    <circle id="mascot-iris-r" cx="76" cy="50" r="5.5" fill="#3B82F6" opacity="0.85" />
                    <circle id="mascot-sparkle-r1" cx="73.5" cy="47.5" r="3.2" fill="#FFFFFF" />
                    <circle id="mascot-sparkle-r2" cx="78" cy="52" r="1.5" fill="#FFFFFF" />
                  </g>
                </g>

                <!-- Strict Tutor Eyebrows -->
                <g id="mascot-eyebrows-strict" class="${this.persona === 'strict' ? '' : 'hidden'}">
                  <line x1="32" y1="36" x2="52" y2="41" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round" />
                  <line x1="88" y1="36" x2="68" y2="41" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round" />
                </g>

                <!-- 2. Happy Crescent Eyes (^_^) -->
                <g id="mascot-eyes-happy" class="hidden">
                  <path d="M34 53 Q44 43 54 53" stroke="#1E1B4B" stroke-width="3.2" stroke-linecap="round" fill="none" />
                  <path d="M66 53 Q76 43 86 53" stroke="#1E1B4B" stroke-width="3.2" stroke-linecap="round" fill="none" />
                </g>

                <!-- 3. Sleepy Eyes (⌒ ⌒) -->
                <g id="mascot-eyes-sleepy" class="hidden">
                  <path d="M34 51 Q44 59 54 51" stroke="#1E1B4B" stroke-width="2.8" stroke-linecap="round" fill="none" />
                  <path d="M66 51 Q76 59 86 51" stroke="#1E1B4B" stroke-width="2.8" stroke-linecap="round" fill="none" />
                </g>

                <!-- 4. Playful Winking Eyes (>_o) -->
                <g id="mascot-eyes-wink" class="hidden">
                  <path d="M34 52 L54 52" stroke="#1E1B4B" stroke-width="3.5" stroke-linecap="round" />
                  <circle cx="76" cy="50" r="14" fill="#FFFFFF" />
                  <circle cx="76" cy="50" r="9" fill="#1E1B4B" />
                  <circle cx="73.5" cy="47.5" r="3.2" fill="#FFFFFF" />
                </g>

                <!-- 5. Shocked Eyes (O_O) -->
                <g id="mascot-eyes-shocked" class="hidden">
                  <circle cx="44" cy="50" r="15" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
                  <circle cx="44" cy="50" r="5" fill="#1E1B4B" />
                  <circle cx="76" cy="50" r="15" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="2" />
                  <circle cx="76" cy="50" r="5" fill="#1E1B4B" />
                </g>

                <!-- 6. Dizzy Spiral Eyes (@_@) -->
                <g id="mascot-eyes-dizzy" class="hidden">
                  <circle cx="44" cy="50" r="14" fill="#FFFFFF" />
                  <path d="M40 50 A 4 4 0 0 1 48 50 A 8 8 0 0 1 36 50 A 12 12 0 0 1 52 50" stroke="#1E1B4B" stroke-width="2" fill="none" stroke-linecap="round" />
                  <circle cx="76" cy="50" r="14" fill="#FFFFFF" />
                  <path d="M72 50 A 4 4 0 0 1 80 50 A 8 8 0 0 1 68 50 A 12 12 0 0 1 84 50" stroke="#1E1B4B" stroke-width="2" fill="none" stroke-linecap="round" />
                </g>

                <!-- 7. Laser Eyes -->
                <g id="mascot-eyes-laser" class="hidden">
                  <circle cx="44" cy="50" r="15" fill="#FDE047" filter="drop-shadow(0 0 8px #F59E0B)" />
                  <circle cx="76" cy="50" r="15" fill="#FDE047" filter="drop-shadow(0 0 8px #F59E0B)" />
                  <circle cx="44" cy="50" r="6" fill="#FFFFFF" />
                  <circle cx="76" cy="50" r="6" fill="#FFFFFF" />
                </g>

                <!-- Amber Beak -->
                <polygon id="mascot-beak" points="60,53 52,65 68,65" fill="url(#mBeakGrad)" rx="2" />

                <!-- Open Beak -->
                <g id="mascot-beak-open" class="hidden">
                  <polygon points="60,51 50,67 70,67" fill="#B45309" />
                  <polygon points="60,54 53,65 67,65" fill="#F43F5E" />
                  <polygon points="60,67 52,74 68,74" fill="url(#mBeakGrad)" />
                </g>

                <!-- Mortarboard Hat -->
                <g id="mascot-hat-group" transform="translate(60, 26) rotate(-8) translate(-60, -26)">
                  <path d="M42 26 Q60 18 78 26 L74 33 Q60 28 46 33 Z" fill="#0F172A" />
                  <polygon points="60,10 92,23 60,34 28,23" fill="url(#mCapGrad)" />
                  <circle cx="60" cy="22" r="2.5" fill="#FBBF24" />
                  <g class="mascot-tassel-anim">
                    <path d="M60 22 Q72 26 78 36" stroke="#FBBF24" stroke-width="1.8" fill="none" stroke-linecap="round" />
                    <circle cx="78" cy="37" r="2.2" fill="#F59E0B" />
                  </g>
                </g>

                <!-- Props: Crown, DJ Headphones, Detective Cap, Nerd Glasses, Gym Headband, Ruler -->
                <g id="mascot-crown" class="hidden">
                  <path d="M44 20 L50 6 L60 16 L70 6 L76 20 Z" fill="url(#mCrownGrad)" stroke="#B45309" stroke-width="1" />
                  <circle cx="50" cy="6" r="1.8" fill="#FFFFFF" />
                  <circle cx="60" cy="16" r="1.8" fill="#FDE047" />
                  <circle cx="70" cy="6" r="1.8" fill="#FFFFFF" />
                </g>

                <g id="mascot-dj-headphones" class="hidden">
                  <path d="M22 48 Q60 10 98 48" stroke="url(#mNeonHeadphones)" stroke-width="5" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 4px #06B6D4)" />
                  <rect x="18" y="44" width="10" height="20" rx="5" fill="#06B6D4" filter="drop-shadow(0 0 5px #06B6D4)" />
                  <rect x="92" y="44" width="10" height="20" rx="5" fill="#D946EF" filter="drop-shadow(0 0 5px #D946EF)" />
                </g>

                <g id="mascot-detective-cap" class="hidden">
                  <path d="M30 28 Q60 10 90 28 L96 32 Q60 22 24 32 Z" fill="#78350F" />
                  <path d="M36 28 Q60 14 84 28" stroke="#D97706" stroke-width="2" fill="none" stroke-dasharray="3 2" />
                </g>

                <g id="mascot-nerd-glasses" class="hidden">
                  <circle cx="44" cy="50" r="15" fill="none" stroke="#1E293B" stroke-width="2.5" />
                  <circle cx="76" cy="50" r="15" fill="none" stroke="#1E293B" stroke-width="2.5" />
                  <line x1="59" y1="50" x2="61" y2="50" stroke="#1E293B" stroke-width="3" />
                </g>

                <g id="mascot-gym-headband" class="hidden">
                  <rect x="24" y="30" width="72" height="8" rx="4" fill="#EF4444" />
                  <circle cx="60" cy="34" r="3" fill="#FFFFFF" />
                </g>
              </g>

              <!-- Held Tools / Props in Wings -->
              <g id="mascot-ruler" class="${this.persona === 'strict' ? '' : 'hidden'}">
                <rect x="14" y="58" width="6" height="36" rx="2" fill="#D97706" stroke="#92400E" stroke-width="1" transform="rotate(-15 14 58)" />
                <line x1="16" y1="64" x2="19" y2="64" stroke="#78350F" stroke-width="1" />
                <line x1="16" y1="70" x2="19" y2="70" stroke="#78350F" stroke-width="1" />
                <line x1="16" y1="76" x2="19" y2="76" stroke="#78350F" stroke-width="1" />
              </g>

              <g id="mascot-magnifying-glass" class="hidden">
                <circle cx="20" cy="74" r="12" fill="#E0F2FE" opacity="0.8" stroke="#0284C7" stroke-width="2.5" />
                <line x1="28" y1="82" x2="38" y2="92" stroke="#475569" stroke-width="4" stroke-linecap="round" />
              </g>

              <g id="mascot-mini-book" class="hidden">
                <rect x="10" y="68" width="22" height="28" rx="2" fill="#B45309" />
                <rect x="13" y="70" width="17" height="24" rx="1" fill="#FEF3C7" />
              </g>

              <g id="mascot-coffee-cup" class="hidden">
                <rect x="12" y="74" width="16" height="20" rx="3" fill="#FFFFFF" stroke="#047857" stroke-width="1.5" />
                <line x1="16" y1="74" x2="10" y2="60" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" />
              </g>

              <g id="mascot-dumbbell" class="hidden">
                <rect x="6" y="78" width="24" height="4" fill="#475569" rx="2" />
                <rect x="4" y="72" width="5" height="16" fill="#EF4444" rx="2" />
                <rect x="27" y="72" width="5" height="16" fill="#EF4444" rx="2" />
              </g>

              <g id="mascot-magic-wand" class="hidden">
                <line x1="28" y1="86" x2="12" y2="58" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" />
                <polygon points="12,52 14,57 19,57 15,60 17,65 12,62 7,65 9,60 5,57 10,57" fill="#FDE047" stroke="#D97706" stroke-width="1" />
              </g>

              <g id="mascot-pompoms" class="hidden">
                <circle cx="16" cy="74" r="10" fill="#EC4899" opacity="0.9" />
                <circle cx="104" cy="74" r="10" fill="#3B82F6" opacity="0.9" />
              </g>
            </svg>

            <!-- Floating Zzz Ascending Bubble -->
            <div id="mascot-zzz-box" class="hidden">
              <span class="mascot-zzz-particle" style="animation-delay: 0s;">Z</span>
              <span class="mascot-zzz-particle" style="animation-delay: 0.8s; font-size: 19px; right: 6px; top: -8px;">z</span>
            </div>
          </div>

          <!-- Micro Controls Row on Mascot -->
          <div class="mascot-micro-toolbar">
            <button type="button" class="mascot-micro-btn" onclick="window.VocabMascot.togglePersona()" title="Đổi tính cách Cú">
              <span id="mascot-persona-icon">${this.getPersonaIcon()}</span>
              <span id="mascot-persona-label">${this.getPersonaLabel()}</span>
            </button>
            <button type="button" class="mascot-micro-btn px-2" onclick="window.VocabMascot.toggleMute()" title="Bật/Tắt âm thanh Cú">
              <span id="mascot-sound-icon">${this.isMuted ? '🔇' : '🔊'}</span>
            </button>
          </div>
        </div>
      `;

      this.rootElement = document.getElementById('vocab-mascot-root');
      this.stageElement = document.getElementById('mascot-owl-stage');
      this.svgElement = document.getElementById('mascot-svg');
      this.speechText = document.getElementById('mascot-speech-text');
    }

    /**
     * DỰNG DOCK ĐỒNG HÀNH TOÀN CỤC (GLOBAL FLOATING MASCOT DOCK XUẤT HIỆN Ở TẤT CẢ MÀN HÌNH)
     */
    buildGlobalFloatingDock() {
      let dock = document.getElementById('global-mascot-dock');
      if (!dock) {
        dock = document.createElement('div');
        dock.id = 'global-mascot-dock';
        dock.className = 'dock-hidden';
        document.body.appendChild(dock);
      }

      dock.innerHTML = `
        <div id="dock-speech-bubble" class="dock-speech-bubble">
          <span id="dock-speech-text">Gia sư Cú đang theo dõi bạn... 🧐</span>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Mini Mascot Avatar -->
          <div class="dock-owl-avatar" onclick="window.VocabMascot.poke()" title="Chạm vào Gia sư Cú">
            <svg viewBox="0 0 120 120" class="w-14 h-14 select-none">
              <use href="#mascot-svg"></use>
            </svg>
            <span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <!-- Quick Dock Controls -->
          <div class="flex flex-col space-y-1">
            <button type="button" class="w-7 h-7 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-xs hover:bg-slate-50 active:scale-95 transition-all" onclick="window.VocabMascot.feedGem()" title="Thưởng Kim Cương 💎">
              💎
            </button>
            <button type="button" class="w-7 h-7 rounded-full bg-white/90 shadow-md border border-slate-200 flex items-center justify-center text-xs hover:bg-slate-50 active:scale-95 transition-all" onclick="window.VocabMascot.toggleMute()" title="Bật/Tắt âm thanh">
              <span class="dock-sound-icon">${this.isMuted ? '🔇' : '🔊'}</span>
            </button>
          </div>
        </div>
      `;
    }

    /**
     * Gắn sự kiện tương tác chuột, kéo thả vật lý, cù lét bụng
     */
    bindEvents() {
      if (!this.stageElement) return;

      if (this.stageElement.addEventListener) {
        this.stageElement.addEventListener('pointerdown', this.handlePointerDown);
      }

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('pointermove', this.handlePointerMove);
        window.addEventListener('pointerup', this.handlePointerUp);
        window.addEventListener('pointercancel', this.handlePointerUp);
        window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
        window.addEventListener('keydown', this.handleUserActivity, { passive: true });
        window.addEventListener('touchstart', this.handleUserActivity, { passive: true });
        window.addEventListener('scroll', this.handleUserActivity, { passive: true });
      }

      const bellyEl = document.getElementById('mascot-belly');
      if (bellyEl && bellyEl.addEventListener) {
        bellyEl.addEventListener('pointermove', (e) => {
          e.stopPropagation();
          const now = Date.now();
          if (now - this.lastTickleTime < 350) {
            this.tickleCount++;
            if (this.tickleCount >= 3) {
              this.performTickleGiggle();
              this.tickleCount = 0;
            }
          } else {
            this.tickleCount = 1;
          }
          this.lastTickleTime = now;
        });
      }

      if (typeof requestAnimationFrame === 'function') {
        const updatePupils = () => {
          if (this.state !== 'sleepy' && this.currentExpression === 'normal' && !this.isDragging) {
            this.currentLook.x += (this.mouseTarget.x - this.currentLook.x) * 0.14;
            this.currentLook.y += (this.mouseTarget.y - this.currentLook.y) * 0.14;

            const pupilL = document.getElementById('mascot-pupil-l');
            const irisL = document.getElementById('mascot-iris-l');
            const pupilR = document.getElementById('mascot-pupil-r');
            const irisR = document.getElementById('mascot-iris-r');

            const dx = this.currentLook.x * 4.2;
            const dy = this.currentLook.y * 3.6;

            if (pupilL && irisL) {
              pupilL.setAttribute('cx', 44 + dx);
              pupilL.setAttribute('cy', 50 + dy);
              irisL.setAttribute('cx', 44 + dx);
              irisL.setAttribute('cy', 50 + dy);
            }

            if (pupilR && irisR) {
              pupilR.setAttribute('cx', 76 + dx);
              pupilR.setAttribute('cy', 50 + dy);
              irisR.setAttribute('cx', 76 + dx);
              irisR.setAttribute('cy', 50 + dy);
            }
          }
          requestAnimationFrame(updatePupils);
        };
        requestAnimationFrame(updatePupils);
      }
    }

    /**
     * BẬT/TẮT ÂM THANH HIỆU ỨNG (MUTE TOGGLE)
     */
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('vocab_mascot_muted', this.isMuted ? 'true' : 'false');
      this.updateSoundIconUI();
      if (typeof window.showToast === 'function') {
        window.showToast(this.isMuted ? '🔇 Đã tắt âm thanh hiệu ứng của Cú' : '🔊 Đã bật âm thanh hiệu ứng của Cú', 'info');
      }
    }

    updateSoundIconUI() {
      const soundIcon = document.getElementById('mascot-sound-icon');
      if (soundIcon) soundIcon.textContent = this.isMuted ? '🔇' : '🔊';
      document.querySelectorAll('.dock-sound-icon').forEach(el => {
        el.textContent = this.isMuted ? '🔇' : '🔊';
      });
    }

    /**
     * ĐỔI TÍNH CÁCH CÚ: GIA SƯ KHÓ TÍNH <-> BẠN HỌC <-> HỌC GIẢ
     */
    togglePersona() {
      const personas = ['strict', 'cute', 'scholar'];
      const nextIdx = (personas.indexOf(this.persona) + 1) % personas.length;
      this.persona = personas[nextIdx];
      localStorage.setItem('vocab_mascot_persona', this.persona);

      this.updatePersonaBadgeUI();
      this.applyPersonaProps();

      if (this.persona === 'strict') {
        this.speak("Chuyển sang chế độ Gia sư Khó tính! Tập trung 100% tinh lực nào! 🧐📏", 4500);
      } else if (this.persona === 'cute') {
        this.speak("Chuyển sang chế độ Bạn học Dễ thương! Cùng nhau cố gắng nhé! 🥰✨", 4000);
      } else {
        this.speak("Chuyển sang chế độ Giáo sư Uyên bác! Khám phá bí mật ngôn ngữ! 📖💡", 4000);
      }
    }

    getPersonaIcon() {
      if (this.persona === 'strict') return '🧐';
      if (this.persona === 'scholar') return '📖';
      return '🥰';
    }

    getPersonaLabel() {
      if (this.persona === 'strict') return 'Gia sư khó tính';
      if (this.persona === 'scholar') return 'Giáo sư uyên bác';
      return 'Bạn học cute';
    }

    updatePersonaBadgeUI() {
      const iconEl = document.getElementById('mascot-persona-icon');
      const labelEl = document.getElementById('mascot-persona-label');
      if (iconEl) iconEl.textContent = this.getPersonaIcon();
      if (labelEl) labelEl.textContent = this.getPersonaLabel();
    }

    applyPersonaProps() {
      const eyebrows = document.getElementById('mascot-eyebrows-strict');
      const ruler = document.getElementById('mascot-ruler');
      const book = document.getElementById('mascot-mini-book');
      const glasses = document.getElementById('mascot-nerd-glasses');

      if (eyebrows) eyebrows.classList.toggle('hidden', this.persona !== 'strict');
      if (ruler) ruler.classList.toggle('hidden', this.persona !== 'strict');
      if (book) book.classList.toggle('hidden', this.persona !== 'scholar');
      if (glasses) glasses.classList.toggle('hidden', this.persona !== 'scholar');
    }

    /**
     * THEO DÕI & ĐIỀU PHỐI MASCOT XUẤT HIỆN Ở TẤT CẢ MÀN HÌNH
     */
    onScreenChange(screenId) {
      this.currentScreen = screenId;
      const dock = document.getElementById('global-mascot-dock');

      if (screenId === 'screen-dashboard') {
        // Ở Dashboard: Ẩn dock nổi, hiện ở Hero card
        if (dock) dock.classList.add('dock-hidden');
        this.speak(this.getRandomQuote(), 5000);
      } else {
        // Ở các màn hình khác: Hiện dock nổi đồng hành giám sát
        if (dock) dock.classList.remove('dock-hidden');

        if (screenId === 'screen-flashcard') {
          this.speak("Đang ở Flashcard: Nhìn kỹ phiên âm IPA trước khi lật thẻ! Đọc to rõ ràng! 🧐", 5000);
          this.applyPersonaProps();
        } else if (screenId === 'screen-shadowing') {
          this.transformToDJ(false);
          this.speak("Đang ở Shadowing: Lắng nghe kỹ nhịp thở và ngữ điệu luyến âm của câu mẫu! 🎧", 5000);
        } else if (screenId === 'screen-dictation') {
          this.speak("Đang ở Dictation: Nghe thật kỹ từng âm vị, cấm đoán mò từ vựng! ✍️", 5000);
        } else if (screenId === 'screen-words') {
          this.speak("Kho từ vựng của bạn đây: Từ nào ở Hộp 1 thì dọn sạch ngay nhé! 🗂️", 5000);
        }
      }
    }

    detectCurrentScreen() {
      const activeScreen = document.querySelector('section[id^="screen-"]:not(.hidden)');
      if (activeScreen) {
        this.onScreenChange(activeScreen.id);
      }
    }

    getRandomQuote() {
      let pool = STRICT_TUTOR_QUOTES;
      if (this.persona === 'cute') pool = CUTE_BUDDY_QUOTES;
      else if (this.persona === 'scholar') pool = SCHOLAR_QUOTES;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    /**
     * KÉO THẢ VẬT LÝ (DRAG PHYSICS)
     */
    handlePointerDown(e) {
      if (e.target.closest('#mascot-belly') || e.target.closest('.mascot-micro-toolbar')) return;
      this.handleUserActivity();

      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.lastDragTime = Date.now();

      this.state = 'dragging';
      this.setExpression('shocked');
      this.hideAllProps();

      this.stageElement.classList.remove('mascot-anim-float', 'mascot-anim-walk');
      this.stageElement.classList.add('mascot-anim-dragging');

      const leftWing = document.getElementById('mascot-wing-left');
      const rightWing = document.getElementById('mascot-wing-right');
      const leftFoot = document.getElementById('mascot-foot-left');
      const rightFoot = document.getElementById('mascot-foot-right');

      if (leftWing) leftWing.classList.add('mascot-wing-panic-l');
      if (rightWing) rightWing.classList.add('mascot-wing-panic-r');
      if (leftFoot) leftFoot.classList.add('mascot-leg-flail-l');
      if (rightFoot) rightFoot.classList.add('mascot-leg-flail-r');

      this.speak("Á á á! Đang bay trên không trung kìa! Đừng thả Cú rơi tự do nhé! 😱", 0);
    }

    handlePointerMove(e) {
      if (!this.isDragging || !this.rootElement) return;

      const deltaX = e.clientX - this.dragStart.x;
      const deltaY = e.clientY - this.dragStart.y;

      this.rootElement.style.transition = 'none';
      this.rootElement.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;

      this.dragVelocity.x = deltaX;
      this.dragVelocity.y = deltaY;
    }

    handlePointerUp() {
      if (!this.isDragging || !this.rootElement) return;
      this.isDragging = false;
      this.state = 'falling';

      const parachute = document.getElementById('mascot-parachute');
      if (parachute) parachute.classList.remove('hidden');

      this.stageElement.classList.remove('mascot-anim-dragging');
      this.stageElement.classList.add('mascot-anim-parachute');

      const leftWing = document.getElementById('mascot-wing-left');
      const rightWing = document.getElementById('mascot-wing-right');
      const leftFoot = document.getElementById('mascot-foot-left');
      const rightFoot = document.getElementById('mascot-foot-right');

      if (leftWing) leftWing.classList.remove('mascot-wing-panic-l');
      if (rightWing) rightWing.classList.remove('mascot-wing-panic-r');
      if (leftFoot) leftFoot.classList.remove('mascot-leg-flail-l');
      if (rightFoot) rightFoot.classList.remove('mascot-leg-flail-r');

      this.setExpression('wink');
      this.speak("Phùuu... Chiếc dù phi hành đã bung! Đang hạ cánh an toàn! 🪂", 2500);

      this.rootElement.style.transition = 'transform 1.3s cubic-bezier(0.25, 1, 0.5, 1)';
      this.rootElement.style.transform = 'translate3d(0, 0, 0)';

      setTimeout(() => {
        if (parachute) parachute.classList.add('hidden');
        this.stageElement.classList.remove('mascot-anim-parachute');
        this.stageElement.classList.add('mascot-anim-squish');

        this.setExpression('happy');
        this.flapWings();
        this.wobbleHat();
        this.playJoyfulChimeHarmony();

        setTimeout(() => {
          this.stageElement.classList.remove('mascot-anim-squish');
          this.stageElement.classList.add('mascot-anim-float');
          this.setExpression('normal');
          this.applyPersonaProps();
          this.state = 'idle';
          this.speak("Đã tiếp đất an toàn! Phủi bụi tiếp tục học thôi nào! ✨", 4000);
        }, 700);
      }, 1300);
    }

    handleMouseMove(e) {
      this.handleUserActivity();
      if (!this.stageElement) return;
      const rect = this.stageElement.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - mascotCenterX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - mascotCenterY) / (window.innerHeight / 2);

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
     * CÙ LÉT VÀO BỤNG (TICKLE GIGGLE)
     */
    performTickleGiggle() {
      if (this.state === 'dragging' || this.state === 'acting') return;
      this.state = 'acting';

      this.stageElement.classList.remove('mascot-anim-float');
      this.stageElement.classList.add('mascot-anim-tickle');
      this.setExpression('happy');

      const cheekL = document.getElementById('mascot-cheek-l');
      const cheekR = document.getElementById('mascot-cheek-r');
      if (cheekL) cheekL.setAttribute('fill', '#F43F5E');
      if (cheekR) cheekR.setAttribute('fill', '#F43F5E');

      this.playTickleGiggleSound();
      this.speak("Hihi nhột quá! Cú cười đau cả bụng rồi, tha cho Cú đi mà! 🤣🎉", 3000);

      setTimeout(() => {
        if (this.stageElement) {
          this.stageElement.classList.remove('mascot-anim-tickle');
          this.stageElement.classList.add('mascot-anim-float');
        }
        if (cheekL) cheekL.setAttribute('fill', '#FDA4AF');
        if (cheekR) cheekR.setAttribute('fill', '#FDA4AF');
        this.setExpression('wink');
        setTimeout(() => {
          this.setExpression('normal');
          this.applyPersonaProps();
        }, 1000);
        this.state = 'idle';
      }, 1500);
    }

    /**
     * NÉM KIM CƯƠNG 💎 CHO CÚ ĂN (FEED GEM)
     */
    feedGem() {
      if (this.isDragging || this.state === 'acting') return;
      this.state = 'acting';

      const gemEl = document.getElementById('mascot-falling-gem');
      const beakNormal = document.getElementById('mascot-beak');
      const beakOpen = document.getElementById('mascot-beak-open');
      const belly = document.getElementById('mascot-belly-path');

      if (beakNormal) beakNormal.classList.add('hidden');
      if (beakOpen) beakOpen.classList.remove('hidden');
      this.setExpression('shocked');

      if (gemEl) {
        gemEl.classList.remove('hidden');
        gemEl.classList.add('mascot-gem-drop');
      }

      setTimeout(() => {
        if (gemEl) {
          gemEl.classList.add('hidden');
          gemEl.classList.remove('mascot-gem-drop');
        }
        if (beakNormal) beakNormal.classList.remove('hidden');
        if (beakOpen) beakOpen.classList.add('hidden');

        if (belly) belly.classList.add('mascot-belly-glowing');
        this.setExpression('happy');
        this.flapWings();
        this.playJoyfulChimeHarmony();
        this.triggerConfetti(30);

        this.speak("Ngon tuyệt cú mèo! Đã nạp 100% tinh lực từ vựng! Cảm ơn bạn! 💎😋", 4500);

        setTimeout(() => {
          if (belly) belly.classList.remove('mascot-belly-glowing');
          this.setExpression('normal');
          this.applyPersonaProps();
          this.state = 'idle';
        }, 1500);
      }, 750);
    }

    /**
     * VẤP NGÃ & NHẶT MŨ (THE CLUMSY TRIP)
     */
    performClumsyTrip() {
      if (this.state !== 'idle' || !this.stageElement) return;
      this.state = 'acting';

      this.stageElement.classList.remove('mascot-anim-float');
      this.stageElement.classList.add('mascot-anim-trip');

      const hat = document.getElementById('mascot-hat-group');
      if (hat) hat.classList.add('mascot-hat-flying');

      this.setExpression('shocked');
      this.speak("Ối chao! Ai để dấu phẩy ở đây làm Cú vấp ngã rồi! 😵", 2800);

      setTimeout(() => {
        this.setExpression('dizzy');
        this.playSoftBoing();

        setTimeout(() => {
          if (this.stageElement) {
            this.stageElement.classList.remove('mascot-anim-trip');
            this.stageElement.classList.add('mascot-anim-float');
          }
          if (hat) hat.classList.remove('mascot-hat-flying');
          this.setExpression('wink');
          this.wobbleHat();
          this.speak("May quá không ai thấy... Đội lại mũ cử nhân ngay ngắn nào! 🎩✨", 3500);

          setTimeout(() => {
            this.setExpression('normal');
            this.applyPersonaProps();
            this.state = 'idle';
          }, 1200);
        }, 1400);
      }, 1200);
    }

    /**
     * TRỐN TÌM (PEEK-A-BOO)
     */
    performPeekABoo() {
      if (this.state !== 'idle' || !this.stageElement) return;
      this.state = 'acting';

      this.stageElement.classList.remove('mascot-anim-float');
      this.stageElement.classList.add('mascot-anim-peek');

      this.speak("Đố bạn biết Cú đang trốn ở đâu nè...? 🙈", 2000);

      setTimeout(() => {
        this.setExpression('happy');
        this.flapWings();
        this.triggerConfetti(25);
        this.playJoyfulChimeHarmony();
        this.speak("BÙMMMM! Òa! Cú đây nè! Bất ngờ chưa nào! 👻🎉", 3500);

        setTimeout(() => {
          if (this.stageElement) {
            this.stageElement.classList.remove('mascot-anim-peek');
            this.stageElement.classList.add('mascot-anim-float');
          }
          this.setExpression('normal');
          this.applyPersonaProps();
          this.state = 'idle';
        }, 1000);
      }, 2400);
    }

    /**
     * NẠP CÀ PHÊ (ESPRESSO BOOST)
     */
    performEspressoBoost() {
      if (this.state !== 'idle' || !this.stageElement) return;
      this.state = 'acting';

      const cup = document.getElementById('mascot-coffee-cup');
      if (cup) cup.classList.remove('hidden');

      this.speak("*Rộttt rộttt*... Nhấp một ngụm Cà phê Đậm đặc nạp năng lượng! ☕⚡", 2000);

      setTimeout(() => {
        if (cup) cup.classList.add('hidden');
        this.setExpression('laser');
        this.stageElement.classList.remove('mascot-anim-float');
        this.stageElement.classList.add('mascot-anim-espresso');
        this.playLaserSpeedSound();

        this.speak("NĂNG LƯỢNG SIÊU NHIỆT BÙNG NỔ! CÙNG HỌC 100 TỪ MỚI NÀO! 🚀⚡🔥", 3500);

        setTimeout(() => {
          if (this.stageElement) {
            this.stageElement.classList.remove('mascot-anim-espresso');
            this.stageElement.classList.add('mascot-anim-float');
          }
          this.setExpression('normal');
          this.applyPersonaProps();
          this.state = 'idle';
        }, 3500);
      }, 2000);
    }

    /**
     * THÁM TỬ ÂM VỊ (PHONEME DETECTIVE)
     */
    transformToDetective(targetWord = '') {
      this.hideAllProps();
      const cap = document.getElementById('mascot-detective-cap');
      const glass = document.getElementById('mascot-magnifying-glass');
      const hatNormal = document.getElementById('mascot-hat-group');

      if (hatNormal) hatNormal.classList.add('hidden');
      if (cap) cap.classList.remove('hidden');
      if (glass) glass.classList.remove('hidden');

      this.setExpression('wink');
      this.speak(`Thám tử Cú phát hiện âm vị từ "${targetWord}" cần chỉnh lại khẩu hình môi và bật hơi dứt khoát hơn nhé! 🔍🕵️`, 5500);

      setTimeout(() => {
        if (cap) cap.classList.add('hidden');
        if (glass) glass.classList.add('hidden');
        if (hatNormal) hatNormal.classList.remove('hidden');
        this.setExpression('normal');
        this.applyPersonaProps();
      }, 5500);
    }

    /**
     * DJ QUẨY NHẠC SHADOWING
     */
    transformToDJ(isPlaying) {
      const headphones = document.getElementById('mascot-dj-headphones');
      if (isPlaying) {
        if (headphones) headphones.classList.remove('hidden');
        this.stageElement.classList.remove('mascot-anim-float');
        this.stageElement.classList.add('mascot-anim-dj');
        this.setExpression('happy');
        this.speak("Phiêu theo nhịp điệu và ngữ điệu câu nào! Ngắt nghỉ cực chuẩn! 🎧🎶", 4000);
      } else {
        if (headphones) headphones.classList.add('hidden');
        if (this.stageElement) {
          this.stageElement.classList.remove('mascot-anim-dj');
          this.stageElement.classList.add('mascot-anim-float');
        }
        this.setExpression('normal');
        this.applyPersonaProps();
      }
    }

    /**
     * HOẠT NÁO VIÊN POM-POM 100%
     */
    transformToCheerleader() {
      this.hideAllProps();
      const pompoms = document.getElementById('mascot-pompoms');
      if (pompoms) pompoms.classList.remove('hidden');

      this.stageElement.classList.remove('mascot-anim-float');
      this.stageElement.classList.add('mascot-anim-cheer');
      this.setExpression('happy');
      this.triggerConfetti(60);
      this.playJoyfulChimeHarmony();

      this.speak("100 Điểm Tuyệt Đối! Bạn chính là nhà vô địch phát âm hôm nay! 📣💖🏆", 5500);

      setTimeout(() => {
        if (pompoms) pompoms.classList.add('hidden');
        if (this.stageElement) {
          this.stageElement.classList.remove('mascot-anim-cheer');
          this.stageElement.classList.add('mascot-anim-float');
        }
        this.setExpression('normal');
        this.applyPersonaProps();
      }, 5500);
    }

    /**
     * KỊCH SĨ NGẤT XỈU (DRAMA QUEEN FAINT)
     */
    performDramaFaint() {
      if (this.state !== 'idle' || !this.stageElement) return;
      this.state = 'acting';

      this.stageElement.classList.remove('mascot-anim-float');
      this.stageElement.classList.add('mascot-anim-faint');
      this.setExpression('dizzy');

      this.speak("Úi chao tim Gia sư rụng rời... Đọc lại ngay cho tôi, không được bỏ cuộc! 🎭💔", 3500);

      setTimeout(() => {
        this.setExpression('wink');
        setTimeout(() => {
          if (this.stageElement) {
            this.stageElement.classList.remove('mascot-anim-faint');
            this.stageElement.classList.add('mascot-anim-float');
          }
          this.setExpression('normal');
          this.applyPersonaProps();
          this.state = 'idle';
        }, 1200);
      }, 2500);
    }

    /**
     * HÀO QUANG SUPER SAIYAN
     */
    activateSuperSaiyanAura(enable = true) {
      const aura = document.getElementById('mascot-saiyan-aura');
      if (enable) {
        if (aura) aura.classList.remove('hidden');
        this.stageElement.classList.add('mascot-saiyan-active');
        this.speak("Sức mạnh Chuỗi ngày rực cháy! Năng lượng Super Saiyan đang tuôn trào! 🔥⚡", 5000);
      } else {
        if (aura) aura.classList.add('hidden');
        this.stageElement.classList.remove('mascot-saiyan-active');
      }
    }

    hideAllProps() {
      const props = [
        'mascot-parachute', 'mascot-falling-gem', 'mascot-crown', 'mascot-dj-headphones',
        'mascot-detective-cap', 'mascot-nerd-glasses', 'mascot-gym-headband',
        'mascot-magnifying-glass', 'mascot-mini-book', 'mascot-coffee-cup',
        'mascot-dumbbell', 'mascot-magic-wand', 'mascot-pompoms'
      ];
      props.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      const hatNormal = document.getElementById('mascot-hat-group');
      if (hatNormal) hatNormal.classList.remove('hidden');
    }

    startNaturalBlinking() {
      if (this.blinkTimer) clearInterval(this.blinkTimer);
      this.blinkTimer = setInterval(() => {
        if (this.state === 'idle' && this.currentExpression === 'normal') {
          const eyeL = document.getElementById('mascot-eye-l');
          const eyeR = document.getElementById('mascot-eye-r');
          if (eyeL && eyeR) {
            eyeL.style.transform = 'scaleY(0.08)';
            eyeR.style.transform = 'scaleY(0.08)';
            setTimeout(() => {
              eyeL.style.transform = 'scaleY(1)';
              eyeR.style.transform = 'scaleY(1)';
            }, 120);
          }
        }
      }, 4200);
    }

    setExpression(expr = 'normal') {
      this.currentExpression = expr;
      const eyeGroups = [
        'mascot-eyes-normal', 'mascot-eyes-happy', 'mascot-eyes-sleepy',
        'mascot-eyes-wink', 'mascot-eyes-shocked', 'mascot-eyes-dizzy', 'mascot-eyes-laser'
      ];
      eyeGroups.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });

      const activeMap = {
        normal: 'mascot-eyes-normal',
        happy: 'mascot-eyes-happy',
        sleepy: 'mascot-eyes-sleepy',
        wink: 'mascot-eyes-wink',
        shocked: 'mascot-eyes-shocked',
        dizzy: 'mascot-eyes-dizzy',
        laser: 'mascot-eyes-laser'
      };

      const targetId = activeMap[expr] || 'mascot-eyes-normal';
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.remove('hidden');
    }

    startAutonomousLoop() {
      if (this.idleTimer) clearInterval(this.idleTimer);

      this.idleTimer = setInterval(() => {
        if (Date.now() - this.lastInteractionTime > 120000 && this.state !== 'sleepy') {
          this.setState('sleepy');
          return;
        }

        if (this.state === 'sleepy' || this.state === 'patrol' || this.state === 'listening' || this.state === 'dragging' || this.state === 'acting') return;

        const actions = ['patrol', 'clumsy_trip', 'peek_a_boo', 'espresso_boost', 'speech', 'flap'];
        const chosen = actions[Math.floor(Math.random() * actions.length)];

        switch (chosen) {
          case 'patrol':
            this.startPatrolSequence();
            break;
          case 'clumsy_trip':
            this.performClumsyTrip();
            break;
          case 'peek_a_boo':
            this.performPeekABoo();
            break;
          case 'espresso_boost':
            this.performEspressoBoost();
            break;
          case 'flap':
            this.flapWings();
            break;
          case 'speech':
          default:
            this.speak(this.getRandomQuote(), 5000);
            break;
        }
      }, 7500);
    }

    startPatrolSequence() {
      if (this.state === 'patrol' || this.state === 'acting' || !this.rootElement || !this.stageElement) return;
      if (this.currentScreen !== 'screen-dashboard') return;
      this.state = 'patrol';

      const heroCard = document.getElementById('hero-mascot-container');
      const isMobile = window.innerWidth < 768;
      const travelDistance = isMobile
        ? Math.min(100, Math.max(50, (heroCard ? heroCard.offsetWidth * 0.3 : 80)))
        : Math.min(260, Math.max(140, (heroCard ? heroCard.offsetWidth * 0.45 : 220)));

      this.stageElement.classList.remove('mascot-anim-float');
      this.stageElement.classList.add('mascot-anim-walk');
      this.setExpression('normal');
      this.stageElement.style.transform = 'scaleX(1)';

      this.rootElement.style.transition = 'transform 2.4s cubic-bezier(0.35, 0, 0.25, 1)';
      this.rootElement.style.transform = `translateX(-${travelDistance}px)`;

      setTimeout(() => {
        if (this.state !== 'patrol') return;
        this.stageElement.classList.remove('mascot-anim-walk');
        this.wobbleHat();

        setTimeout(() => {
          if (this.state !== 'patrol') return;
          this.stageElement.classList.add('mascot-anim-walk');
          this.stageElement.style.transform = 'scaleX(-1)';

          this.rootElement.style.transition = 'transform 2.4s cubic-bezier(0.35, 0, 0.25, 1)';
          this.rootElement.style.transform = 'translateX(0px)';

          setTimeout(() => {
            if (this.state !== 'patrol') return;
            this.stageElement.style.transform = 'scaleX(1)';
            this.stageElement.classList.remove('mascot-anim-walk');
            this.stageElement.classList.add('mascot-anim-float');
            this.state = 'idle';
            this.setExpression('wink');
            setTimeout(() => {
              this.setExpression('normal');
              this.applyPersonaProps();
            }, 1200);
          }, 2400);
        }, 1000);
      }, 2400);
    }

    enterSleepyState() {
      this.state = 'sleepy';
      this.setExpression('sleepy');
      const zzzBox = document.getElementById('mascot-zzz-box');
      if (zzzBox) zzzBox.classList.remove('hidden');

      if (this.stageElement) {
        this.stageElement.classList.remove('mascot-anim-float', 'mascot-anim-walk');
        this.stageElement.style.transform = 'translateY(8px) scale(0.96)';
      }

      this.speak("Zzz... Cú chợp mắt một lát nhé... Chạm để đánh thức! 🌙", 8000);
    }

    wakeUp() {
      this.state = 'idle';
      this.setExpression('normal');
      this.applyPersonaProps();
      const zzzBox = document.getElementById('mascot-zzz-box');
      if (zzzBox) zzzBox.classList.add('hidden');

      if (this.stageElement) {
        this.stageElement.style.transform = 'translateY(0) scale(1)';
        this.stageElement.classList.add('mascot-anim-float');
      }

      this.flapWings();
      this.wobbleHat();
      this.speak("Gia sư đã thức dậy rồi! Cùng tiếp tục rèn luyện nào! ☀️", 3500);
    }

    setState(newState) {
      if (newState === 'sleepy') this.enterSleepyState();
      else if (newState === 'patrol') this.startPatrolSequence();
      else if (newState === 'celebrate') this.triggerCelebration();
      else if (newState === 'idle') {
        this.state = 'idle';
        this.setExpression('normal');
        this.applyPersonaProps();
      }
    }

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

    wobbleHat() {
      const hat = document.getElementById('mascot-hat-group');
      if (hat) {
        hat.classList.add('mascot-hat-wobble');
        setTimeout(() => hat.classList.remove('mascot-hat-wobble'), 750);
      }
    }

    speak(message, duration = 4000) {
      if (!message) return;
      const speechEl = document.getElementById('mascot-speech-text');
      const dockSpeechEl = document.getElementById('dock-speech-text');

      if (speechEl) {
        speechEl.style.opacity = '0';
        setTimeout(() => {
          speechEl.textContent = '"' + message + '"';
          speechEl.style.opacity = '1';
        }, 160);
      }

      if (dockSpeechEl) {
        dockSpeechEl.textContent = message;
      }

      if (this.speechTimer) clearTimeout(this.speechTimer);
      if (duration > 0) {
        this.speechTimer = setTimeout(() => { }, duration);
      }
    }

    poke() {
      this.handleUserActivity();
      if (this.stageElement) {
        this.stageElement.classList.remove('mascot-anim-somersault', 'mascot-anim-float');
        void this.stageElement.offsetWidth;
        this.stageElement.classList.add('mascot-anim-somersault');
        setTimeout(() => {
          if (this.stageElement) {
            this.stageElement.classList.remove('mascot-anim-somersault');
            this.stageElement.classList.add('mascot-anim-float');
          }
        }, 900);
      }

      this.setExpression('happy');
      this.flapWings();
      this.wobbleHat();
      this.triggerConfetti(35);
      this.playJoyfulChimeHarmony();

      setTimeout(() => {
        this.setExpression('normal');
        this.applyPersonaProps();
      }, 1800);

      const quote = this.getRandomQuote();
      this.speak(quote, 5000);

      if (typeof window.showToast === 'function') {
        window.showToast('🦉 Gia sư Cú: ' + quote, 'info');
      }
    }

    reactToRecording(isRecording) {
      if (isRecording) {
        this.state = 'listening';
        this.setExpression('normal');
        this.speak("Gia sư đang lắng nghe từng âm vị của bạn... Đọc to lên! 🎙️", 0);
      } else {
        this.state = 'idle';
      }
    }

    reactToScore(score, word = '') {
      if (score === 100) {
        this.transformToCheerleader();
      } else if (score >= 80) {
        this.triggerCelebration();
        this.speak(`Tuyệt vời! Bạn phát âm từ "${word}" đạt ${score}% cực chuẩn! 🌟`, 5000);
      } else if (score > 0 && score < 60) {
        this.transformToDetective(word);
      }
    }

    reactToLevelUp(tierName) {
      this.hideAllProps();
      const crown = document.getElementById('mascot-crown');
      const wand = document.getElementById('mascot-magic-wand');
      if (crown) crown.classList.remove('hidden');
      if (wand) wand.classList.remove('hidden');

      this.triggerCelebration();
      this.speak(`🎉 Úm ba la! Chúc mừng bạn đã thăng hạng lên ${tierName}! 👑🪄✨`, 6000);

      setTimeout(() => {
        if (crown) crown.classList.add('hidden');
        if (wand) wand.classList.add('hidden');
        this.applyPersonaProps();
      }, 8000);
    }

    triggerCelebration() {
      this.handleUserActivity();
      if (this.stageElement) {
        this.stageElement.classList.remove('mascot-anim-somersault', 'mascot-anim-float');
        void this.stageElement.offsetWidth;
        this.stageElement.classList.add('mascot-anim-somersault');
        setTimeout(() => {
          if (this.stageElement) {
            this.stageElement.classList.remove('mascot-anim-somersault');
            this.stageElement.classList.add('mascot-anim-float');
          }
        }, 900);
      }

      this.setExpression('happy');
      this.flapWings();
      this.wobbleHat();
      this.triggerConfetti(60);
      this.playJoyfulChimeHarmony();

      setTimeout(() => {
        this.setExpression('normal');
        this.applyPersonaProps();
      }, 2500);
    }

    triggerConfetti(count = 45) {
      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: count,
          spread: 80,
          origin: { y: 0.7 },
          colors: ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899']
        });
      }
    }

    /**
     * ÂM THANH WEB AUDIO (CÓ CHECK MUTE)
     */
    playJoyfulChimeHarmony() {
      if (this.isMuted) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const chordNotes = [523.25, 659.25, 783.99, 1046.50];
        chordNotes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.55);
        });
      } catch (e) { }
    }

    playTickleGiggleSound() {
      if (this.isMuted) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const freqs = [659.25, 880.00, 1174.66, 1318.51];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.18, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.25);
        });
      } catch (e) { }
    }

    playSoftBoing() {
      if (this.isMuted) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) { }
    }

    playLaserSpeedSound() {
      if (this.isMuted) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) { }
    }
  }

  const mascotInstance = new VocabMascotEngine();

  window.VocabMascot = {
    init: (selector) => mascotInstance.init(selector),
    setState: (stateName) => mascotInstance.setState(stateName),
    setExpression: (expr) => mascotInstance.setExpression(expr),
    speak: (msg, dur) => mascotInstance.speak(msg, dur),
    triggerCelebration: () => mascotInstance.triggerCelebration(),
    poke: () => mascotInstance.poke(),
    feedGem: () => mascotInstance.feedGem(),
    toggleMute: () => mascotInstance.toggleMute(),
    togglePersona: () => mascotInstance.togglePersona(),
    onScreenChange: (screenId) => mascotInstance.onScreenChange(screenId),
    reactToRecording: (isRec) => mascotInstance.reactToRecording(isRec),
    reactToScore: (score, word) => mascotInstance.reactToScore(score, word),
    reactToLevelUp: (tierName) => mascotInstance.reactToLevelUp(tierName),
    transformToDJ: (isPlaying) => mascotInstance.transformToDJ(isPlaying),
    transformToDetective: (word) => mascotInstance.transformToDetective(word),
    transformToCheerleader: () => mascotInstance.transformToCheerleader(),
    performClumsyTrip: () => mascotInstance.performClumsyTrip(),
    performPeekABoo: () => mascotInstance.performPeekABoo(),
    performEspressoBoost: () => mascotInstance.performEspressoBoost(),
    performDramaFaint: () => mascotInstance.performDramaFaint(),
    activateSuperSaiyanAura: (enable) => mascotInstance.activateSuperSaiyanAura(enable),
    wakeUp: () => mascotInstance.wakeUp()
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.VocabMascot.init());
  } else {
    window.VocabMascot.init();
  }
})();
