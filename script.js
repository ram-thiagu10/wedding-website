/* ── STARS ── */
(function(){
  const c = document.getElementById('env-stars');
  for(let i=0;i<90;i++){
    const s = document.createElement('div');
    s.className = 'env-star';
    const sz = Math.random()*2+0.5;
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*3+1.5).toFixed(1)}s;--delay:-${(Math.random()*4).toFixed(1)}s;`;
    c.appendChild(s);
  }
})();

/* ── SEAL CLICK → open flap → auto-reveal website ── */
let sealClicked = false;

function onSealClick(e) {
  e.stopPropagation();
  if (sealClicked) return;
  sealClicked = true;

  // Hide prompt
  document.getElementById('env-prompt').classList.add('hidden');

  // Open the envelope flap
  document.getElementById('env-wrap').classList.add('opened');

  // After flap animation + card reveal, fade out overlay and start music
  setTimeout(() => {
    const overlay = document.getElementById('envelope-overlay');
    overlay.classList.add('hidden');

    // Show music toggle button
    document.getElementById('music-toggle').classList.add('visible');

    // Start music
    const audio = document.getElementById('bg-music');
    audio.volume = 0.22;
    audio.play().catch(()=>{});

    // Start the golden sparkle shower
    if (window.startSparkleShower) window.startSparkleShower();
  }, 1000); // reduced to 0.9s for faster reveal
}

document.getElementById('env-seal').addEventListener('click', onSealClick);
// Also allow tapping anywhere on envelope as fallback
document.getElementById('env-wrap').addEventListener('click', onSealClick);

/* ── MUSIC TOGGLE ── */
let musicPlaying = true;
function toggleMusic(){
  const audio = document.getElementById('bg-music');
  const on  = document.getElementById('music-icon-on');
  const off = document.getElementById('music-icon-off');
  if(musicPlaying){ audio.pause(); on.style.display='none'; off.style.display='block'; }
  else { audio.play().catch(()=>{}); on.style.display='block'; off.style.display='none'; }
  musicPlaying = !musicPlaying;
}



(function(){
  const canvas = document.getElementById('sparkle-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  let running = false;
  let rafId = null;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Gold/cream sparkle palette to match the royal theme
  const colors = ['#f4d989', '#e8c468', '#fff3d6', '#d4af37', '#ffe8a3'];

  function makeParticle(spawnAtTop){
    const size = Math.random() * 2.6 + 1;
    return {
      x: Math.random() * w,
      y: spawnAtTop ? -10 - Math.random() * h : Math.random() * h,
      size: size,
      baseSize: size,
      speedY: Math.random() * 0.5 + 0.25,
      drift: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinkleSpeed: Math.random() * 0.03 + 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.4
    };
  }

  // Density scales gently with screen size, capped for performance
  function targetCount(){
    return Math.min(70, Math.floor((w * h) / 18000));
  }

  function initParticles(){
    particles = [];
    const count = targetCount();
    for (let i = 0; i < count; i++){
      particles.push(makeParticle(false));
    }
  }

  function drawStar(p, twinkle){
    ctx.save();
    ctx.globalAlpha = p.opacity * twinkle;
    ctx.translate(p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.size * 2.5;
    const r = p.size;
    ctx.beginPath();
    for (let i = 0; i < 4; i++){
      ctx.rotate(Math.PI / 2);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, r);
    }
    ctx.lineWidth = r * 0.5;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate(){
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    for (let p of particles){
      p.y += p.speedY;
      p.x += p.drift;
      p.twinklePhase += p.twinkleSpeed;

      if (p.y > h + 10){
        Object.assign(p, makeParticle(true), { y: -10 });
      }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase);
      drawStar(p, twinkle);
    }

    rafId = requestAnimationFrame(animate);
  }

  function startSparkles(){
    if (running) return;
    running = true;
    initParticles();
    animate();
  }

  function stopSparkles(){
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, w, h);
  }

  // Respect users who prefer reduced motion
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Expose globally so the envelope-open handler can trigger it
  window.startSparkleShower = function(){
    if (!prefersReducedMotion) startSparkles();
  };
  window.stopSparkleShower = stopSparkles;
})();



  function toggleTranslateMenu() {
    document.getElementById('translate-menu').classList.toggle('open');
  }
  // Close the menu after a language is chosen
  document.addEventListener('click', function(e) {
    const wrap = document.getElementById('translate-wrap');
    const menu = document.getElementById('translate-menu');
    if (e.target.closest('.lang-btn')) {
      menu.classList.remove('open');
    } else if (!wrap.contains(e.target)) {
      menu.classList.remove('open');
    }
  });



  function toggleMap(id) {
    const el = document.getElementById(id);
    if (el.classList.contains('visible')) {
      el.classList.remove('visible');
    } else {
      el.classList.add('visible');
    }
  }

  const weddingDate = new Date('2026-09-13T07:00:00+05:30');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      const grid = document.querySelector('.countdown-grid');
      if (grid) grid.style.display = 'none';
      document.getElementById('cd-done').style.display = 'block';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent    = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
  }

  let selectedFilesArray = [];

  function triggerPhotoPicker(mode) {
    const cameraInput = document.getElementById("camera-file-input");
    const galleryInput = document.getElementById("gallery-file-input");
    if (mode === "camera") {
      cameraInput.click();
    } else {
      galleryInput.click();
    }
  }

  function showUploadProgress(total) {
    const overlay = document.getElementById("upload-progress-overlay");
    const fill = document.getElementById("upload-progress-fill");
    const text = document.getElementById("upload-progress-text");
    const meta = document.getElementById("upload-progress-meta");
    fill.style.width = "0%";
    text.textContent = `Uploading ${total} photo${total > 1 ? "s" : ""}...`;
    meta.textContent = "Please keep this page open while we save your memories.";
    overlay.classList.add("visible");
  }

  function updateUploadProgress(step, total, label) {
    const fill = document.getElementById("upload-progress-fill");
    const meta = document.getElementById("upload-progress-meta");
    const percent = Math.min(100, Math.round((step / total) * 100));
    fill.style.width = `${percent}%`;
    meta.textContent = label || `Uploading ${step} of ${total}`;
  }

  function hideUploadProgress() {
    document.getElementById("upload-progress-overlay").classList.remove("visible");
  }

  function persistMyMemory(memory) {
    try {
      const memories = JSON.parse(localStorage.getItem("my_uploaded_memories") || "[]");
      const nextMemories = [memory, ...memories.filter(item => item.url !== memory.url)].slice(0, MAX_PHOTOS_ALLOWED);
      localStorage.setItem("my_uploaded_memories", JSON.stringify(nextMemories));
    } catch (err) {
      console.error("Could not save memory locally", err);
    }
  }

  // How many more photos this guest is still allowed to upload right now
  function getRemainingSlots() {
    const currentUploads = parseInt(localStorage.getItem("user_upload_count") || "0", 10);
    return Math.max(0, MAX_PHOTOS_ALLOWED - currentUploads);
  }

  function previewCapturedImages(input) {
    const previewGrid = document.getElementById("preview-thumbnails-grid");
    previewGrid.innerHTML = ""; // Clear old previews
    selectedFilesArray = Array.from(input.files);

    const remainingSlots = getRemainingSlots();

    // Guests can upload 1, 2, or 3 photos total, in any combination of batches —
    // what matters is never exceeding whatever is left of their personal quota.
    if (selectedFilesArray.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"}. Please select ${remainingSlots} or fewer.`);
      input.value = "";
      selectedFilesArray = [];
      document.getElementById("camera-preview-container").style.display = "none";
      document.getElementById("submit-photo-btn").setAttribute("disabled", "true");
      return;
    }

    if (selectedFilesArray.length > 0) {
      document.getElementById("camera-preview-container").style.display = "block";
      document.getElementById("submit-photo-btn").removeAttribute("disabled");

      selectedFilesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.cssText = "width: 80px; height: 80px; object-fit: cover; border-radius: 6px; border: 1px solid var(--gold);";
          previewGrid.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Uploads one file straight to Cloudinary and returns its permanent CDN URL
  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);

    const response = await fetch(CLOUDINARY_UPLOAD_URL, { method: "POST", body: formData });
    if (!response.ok) throw new Error("Cloudinary upload failed");
    const data = await response.json();
    return data.secure_url;
  }

  // Records the Cloudinary URL + caption via Apps Script, which appends it as a
  // row in a Google Sheet — a lightweight list the gallery reads back from.
  async function saveGalleryRecord(url, message) {
    await fetch(APP_SCRIPT_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify({ url, message })
    });
  }

  async function handlePhotoUpload(event) {
    event.preventDefault();

    if (selectedFilesArray.length === 0) return;

    const remainingSlots = getRemainingSlots();
    if (selectedFilesArray.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"}.`);
      return;
    }

    const messageInput = document.getElementById("photo-message");
    const submitBtn = document.getElementById("submit-photo-btn");
    const totalToUpload = selectedFilesArray.length;

    showUploadProgress(totalToUpload);
    submitBtn.innerText = `Uploading ${totalToUpload} Photo(s)...`;
    submitBtn.setAttribute("disabled", "true");

    let currentUploads = parseInt(localStorage.getItem("user_upload_count") || "0", 10);
    let uploadedCount = 0;

    // Upload sequentially so the running count/localStorage stays accurate
    for (const [index, file] of selectedFilesArray.entries()) {
      try {
        updateUploadProgress(index + 1, totalToUpload, `Uploading ${index + 1} of ${totalToUpload}...`);
        const secureUrl = await uploadToCloudinary(file);
        const messageValue = messageInput.value.trim();
        await saveGalleryRecord(secureUrl, messageValue);
        persistMyMemory({ url: secureUrl, message: messageValue, timestamp: new Date().toISOString() });
        currentUploads++;
        uploadedCount++;
        localStorage.setItem("user_upload_count", currentUploads);
      } catch (err) {
        console.error("Failed uploading a file", err);
      }
    }

    hideUploadProgress();

    if (uploadedCount === 0) {
      alert("Sorry, the upload failed. Please check your connection and try again.");
    } else if (currentUploads >= MAX_PHOTOS_ALLOWED) {
      alert("\u2728 All 3 photos uploaded \u2014 thank you for sharing your memories!");
    } else {
      alert(`${uploadedCount} photo${uploadedCount === 1 ? "" : "s"} uploaded! You can upload ${MAX_PHOTOS_ALLOWED - currentUploads} more whenever you'd like.`);
    }

    selectedFilesArray = [];
    document.getElementById("event-capture-form").reset();
    document.getElementById("camera-preview-container").style.display = "none";
    document.getElementById("preview-thumbnails-grid").innerHTML = "";
    submitBtn.innerText = "Upload Photo to Gallery";
    updateUploadCounterDisplay();
    loadGlobalGallery(); // Refresh view
  }

  async function loadGlobalGallery() {
    const grid = document.getElementById("live-gallery-grid");
    try {
      const memories = JSON.parse(localStorage.getItem("my_uploaded_memories") || "[]");
      grid.innerHTML = "";

      if (memories.length > 0) {
        memories.forEach(memory => {
          const photoHtml = `
            <div class="person-card">
              <div style="position:relative; width:100%; padding-top:75%; overflow:hidden; background: rgba(0,0,0,0.1);">
                <img src="${memory.url}" loading="lazy" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;" onerror="this.src='https://placehold.co/400x300?text=Image+Unavailable'"/>
              </div>
              <div class="person-card-inner" style="padding: 16px;">
                <p class="person-desc" style="font-style: italic;">"${escapeHtml(memory.message || 'Best Wishes!')}"</p>
              </div>
            </div>`;
          grid.insertAdjacentHTML("beforeend", photoHtml);
        });
      } else {
        grid.insertAdjacentHTML("beforeend", `
          <div class="person-card" style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
            <p style="color: var(--text-on-dark-muted); font-style: italic;" data-i18n="galleryEmptyState">No memories saved on this device yet. Be the first to share a moment!</p>
          </div>`);
      }
    } catch (err) {
      console.error("Could not load gallery images:", err);
    }
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoo2_KLeDevK54-qVhzj8iDgxyyYSQ7HjJqeipqjmncxCk44SS9Np3I6_3X416sux7tg/exec';

  async function submitWish() {
    const name    = document.getElementById('wish-name').value.trim();
    const relation= document.getElementById('wish-relation').value.trim();
    const message = document.getElementById('wish-message').value.trim();
    const status  = document.getElementById('wish-status');
    const btn     = document.getElementById('wish-submit');

    if (!name) { status.textContent = '⚠️ Please enter your name.'; return; }
    if (!message) { status.textContent = '⚠️ Please write a wish.'; return; }

    btn.disabled = true;
    btn.style.opacity = '0.6';
    status.textContent = 'Sending…';

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, relation, message, timestamp: new Date().toLocaleString('en-IN') })
      });

      addWishCard({ name, relation, message, timestamp: new Date().toLocaleString('en-IN') }, true);

      document.getElementById('wish-name').value = '';
      document.getElementById('wish-relation').value = '';
      document.getElementById('wish-message').value = '';
      status.textContent = '💜 Your wish was sent! Thank you.';
      status.style.color = 'var(--gold-light)';
    } catch (e) {
      status.textContent = '❌ Something went wrong. Please try again.';
    } finally {
      btn.disabled = false;
      btn.style.opacity = '1';
      setTimeout(() => { status.textContent = ''; status.style.color = 'var(--text-on-dark-muted)'; }, 5000);
    }
  }

  function addWishCard(wish, prepend = false) {
    const wall = document.getElementById('wishes-wall');
    const placeholder = wall.querySelector('div[style*="grid-column"]');
    if (placeholder) placeholder.remove();

    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-card-name">${escapeHtml(wish.name)}</div>
      <div class="wish-card-relation">${wish.relation ? escapeHtml(wish.relation) : 'Guest'}</div>
      <div class="wish-card-message">${escapeHtml(wish.message)}</div>
      <div class="wish-card-time">${wish.timestamp || ''}</div>
    `;
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    if (prepend) wall.prepend(card);
    else wall.appendChild(card);

    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function loadWishes() {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_APPS')) return;
    try {
      const res = await fetch(APPS_SCRIPT_URL + '?action=get');
      const data = await res.json();
      if (data && data.wishes && data.wishes.length > 0) {
        data.wishes.reverse().forEach(w => addWishCard(w));
      }
    } catch(e) {
      // Silently fail
    }
  }

  loadWishes();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ═══════════════════════════════════════════════
     TRANSLATION ENGINE
  ═══════════════════════════════════════════════ */
  const translations = {

    en: {
      navCelebrations: "Celebrations",
      navVenues: "Venues",
      navGallery: "Gallery",
      navContact: "Contact",
      navWishes: "Wishes",
      heroEyebrow: "✨ &nbsp; Together with our families, we warmly invite you to celebrate the beginning of our journey together &nbsp; ✨",
      heroWeds: "weds",
      heroDate: "September 2026 &nbsp;·&nbsp; Kerala & Tamil Nadu",
      envTitleTop: "✨ &nbsp; A Wedding Invitation &nbsp; ✨",
      envBlessings: "🪔 &nbsp; With our families' blessings &nbsp; 🪔",
      envTapPrompt: "Tap the seal to open your invitation",
      countdownLabel: "Counting down to the moment",
      countdownSubtitle: "🌸 Thirumanam · 13 September 2026 · 7:00 AM",
      cdDays: "Days", cdHours: "Hours", cdMin: "Min", cdSec: "Sec",
      cdDone: "🎉 They are married! Congratulations!",
      celebrationsEyebrow: "Three Days of Celebration",
      sectionCelebrations: "Our <em>Celebrations</em>",
      monthSep: "September",
      dateSat: "Saturday · 2026",
      dateSun: "Sunday · 2026",
      dateTue: "Tuesday · 2026",
      event1Name: "💍 Nichayathartham - Engagement",
      event1Time: "6:30 PM - 9:00 PM",
      event2Name: "🌸 Thirumanam - Wedding",
      event2Time: "7:00 AM - 10:00 AM",
      event3Name: "🎊 Varaverpu - Reception",
      event3Time: "12:30 PM - 2:30 PM",
      venue1Name: "Mangalya Auditorium",
      venue1Address: "Chottanikkara Vandippetta Rd, Chottanikkara, Thrippunithura, Ernakulam, Kerala 682312",
      venue2Name: "Ramyas Hotel",
      venue2Address: "13-D/2, Williams Rd, Cantonment, Tiruchirappalli, Tamil Nadu 620001",
      openMaps: "Open in Google Maps",
      venuesEyebrow: "Getting There",
      venuesTitle: "<em>Venues</em> at a Glance",
      venue1Tag: "ENGAGEMENT &amp; WEDDING",
      venue1City: "Chottanikara, Ernakulam, Kerala",
      venue2Tag: "RECEPTION",
      venue2City: "Trichy (Tiruchirappalli), Tamil Nadu",
      howToReach: "HOW TO REACH THE VENUE",
      fromAirportLabel: "✈️ From Airport:",
      fromBusLabel: "🚌 From Bus Stands:",
      byRoadLabel: "🚗 By Road:",
      venue1TrainLabel: "🚂 From Ernakulam Junction (South):",
      venue1Airport: "~38 km away via Seaport-Airport Road (1 hr 15 mins). Alternatively, take a feeder bus to Aluva Metro, ride to Tripunithura Station, then take a 15-minute auto.",
      venue1Train: "~18 km away. Take a direct taxi/auto via Vyttila (40 mins), or take the Kochi Metro directly to Tripunithura Station followed by a short auto ride.",
      venue1Bus: "Direct local and KSRTC buses run frequently to Chottanikkara from Vyttila Mobility Hub and Kaloor Private Bus Stand.",
      venue1Road: "From North, use Seaport-Airport Road via Thiruvankulam. From South, exit Kochi Bypass at Kundannoor Junction and proceed through Tripunithura.",
      venue2TrainLabel: "🚂 From Trichy Railway Junction:",
      venue2Airport: "~5.5 km from Tiruchirappalli International Airport (TRZ). A direct taxi or auto via the Airport Road takes roughly 15 to 20 minutes.",
      venue2Train: "~1 km away. Located just a 5-minute drive or walk down Williams Road. Readily accessible by auto-rickshaws stationed outside the terminal.",
      venue2Bus: "Diagonally opposite the Trichy Central Bus Stand (less than a 3-minute walk). Highly convenient for guests arriving via long-distance government or private buses.",
      venue2Road: "Centrally positioned in Cantonment. Easily accessed via the Chennai-Trichy Highway (NH 45). Direct entry via Williams Road with dedicated guest parking spaces on-site.",
      contactEyebrow: "Reach Out",
      contactTitle: "Family <em>Contacts</em>",
      groomFamilyLabel: "Groom's Family",
      groomFamilyName: "Er N. Thiagu Family",
      brideFamilyLabel: "Bride's Family",
      brideFamilyName: "Pradeepkumar Family",
      fatherOfGroom: "Father of the Groom",
      motherOfGroom: "Mother of the Groom",
      theGroom: "The Groom",
      brotherOfGroom: "Brother of the Groom",
      fatherOfBride: "Father of the Bride",
      brotherOfBride: "Brother of the Bride",
      motherOfBride: "Mother of the Bride",
      theBride: "The Bride",
      wishesEyebrow: "From the Heart",
      wishesTitle: "Send Your <em>Wishes</em>",
      yourName: "Your Name *",
      relationLabel: "Relation to Couple",
      yourWish: "Your Wish *",
      sendWishes: "Send Wishes",
      wishesPlaceholderText: "💜 Wishes from loved ones will appear here…",
      footerTagline: "September 2026 · Chottanikara, Kerala & Trichy, Tamil Nadu",
      footerNote: "Made with love · Two families, one beautiful beginning",
      namePlaceholder: "e.g. Suresh Kumar",
      relationPlaceholder: "e.g. College friend of Groom",
      wishPlaceholder: "Write your heartfelt wishes for Ramakrishnan & Pradeetha…",
      galleryEyebrow: "Shared Memories",
      galleryTitle: "Event <em>Gallery</em>",
      galleryLabel: "Capture the Moments",
      gallerySubLabel: "Click & Upload",
      galleryHelpText: "Help us save our memories! You can capture and upload up to <strong style=\"color:var(--gold-light)\">3 photos</strong> directly from your camera during the event days (Sept 12, 13, & 15).",
      photosUploadedLabel: "Photos Uploaded:",
      memoriesBannerTitle: "Your Uploaded Memories",
      memoriesBannerSubtitle: "Thank you for sharing these precious moments with us.",
      galleryButton: "📷 Take Photo",
      gallerySelectButton: "🖼️ Select From Gallery",
      galleryMessagePlaceholder: "Write a brief message with this photo... (Optional)",
      galleryUploadButton: "Upload Photo to Gallery",
      galleryUploadLockTitle: "Camera Uploads Open Only on Event Days",
      galleryUploadLockSubtitle: "Join us on September 12th, 13th, and 15th, 2026 to upload your photos!",
      galleryEmptyState: "No memories saved on this device yet. Be the first to share a moment!"
    },

    ta: {
      navCelebrations: "விழாக்கள்",
      navVenues: "இடங்கள்",
      navGallery: "கேலரி",
      navContact: "தொடர்பு",
      navWishes: "வாழ்த்துகள்",
      heroEyebrow: "✨ &nbsp; எங்கள் குடும்பங்களுடன் இணைந்து, எங்கள் பயணத்தின் தொடக்கத்தைக் கொண்டாட உங்களை அன்புடன் அழைக்கிறோம் &nbsp; ✨",
      heroWeds: "திருமணம்",
      heroDate: "செப்டம்பர் 2026 &nbsp;·&nbsp; கேரளா & தமிழ்நாடு",
      envTitleTop: "✨ &nbsp; ஒரு திருமண அழைப்பிதழ் &nbsp; ✨",
      envBlessings: "🪔 &nbsp; எங்கள் குடும்பங்களின் ஆசியுடன் &nbsp; 🪔",
      envTapPrompt: "உங்கள் அழைப்பிதழைத் திறக்க முத்திரையைத் தொடவும்",
      countdownLabel: "தருணத்திற்கான எண்ணிக்கை",
      countdownSubtitle: "🌸 திருமணம் · 13 செப்டம்பர் 2026 · காலை 7:00",
      cdDays: "நாட்கள்", cdHours: "மணி", cdMin: "நிமிடம்", cdSec: "வினாடி",
      cdDone: "🎉 அவர்கள் திருமணமானார்கள்! வாழ்த்துக்கள்!",
      celebrationsEyebrow: "மூன்று நாட்கள் கொண்டாட்டம்",
      sectionCelebrations: "எங்கள் <em>விழாக்கள்</em>",
      monthSep: "செப்டம்பர்",
      dateSat: "சனிக்கிழமை · 2026",
      dateSun: "ஞாயிற்றுக்கிழமை · 2026",
      dateTue: "செவ்வாய்க்கிழமை · 2026",
      event1Name: "💍 நிச்சயதார்த்தம்",
      event1Time: "மாலை 6:30 - 9:00",
      event2Name: "🌸 திருமணம்",
      event2Time: "காலை 7:00 - 10:00",
      event3Name: "🎊 வரவேற்பு",
      event3Time: "மதியம் 12:30 - 2:30",
      venue1Name: "மங்கள்யா ஆடிட்டோரியம்",
      venue1Address: "சோட்டானிக்கரா வண்டிப்பேட்டை சாலை, சோட்டானிக்கரா, திருப்புனித்துறை, எர்ணாகுளம், கேரளா 682312",
      venue2Name: "ராம்யாஸ் ஹோட்டல்",
      venue2Address: "13-D/2, வில்லியம்ஸ் சாலை, கன்டோன்மென்ட், திருச்சிராப்பள்ளி, தமிழ்நாடு 620001",
      openMaps: "கூகுள் மேப்ஸில் திற",
      venuesEyebrow: "வழித்தடம்",
      venuesTitle: "<em>இடங்கள்</em> ஒரு பார்வையில்",
      venue1Tag: "நிச்சயதார்த்தம் & திருமணம்",
      venue1City: "சோட்டானிக்கரா, எர்ணாகுளம், கேரளா",
      venue2Tag: "வரவேற்பு",
      venue2City: "திருச்சி (திருச்சிராப்பள்ளி), தமிழ்நாடு",
      howToReach: "இடத்தை அடைவது எப்படி",
      fromAirportLabel: "✈️ விமான நிலையத்திலிருந்து:",
      fromBusLabel: "🚌 பேருந்து நிலையங்களிலிருந்து:",
      byRoadLabel: "🚗 சாலை வழியாக:",
      venue1TrainLabel: "🚂 எர்ணாகுளம் ஜங்ஷன் (தெற்கு) இலிருந்து:",
      venue1Airport: "சீபோர்ட்-ஏர்போர்ட் சாலை வழியாக சுமார் 38 கி.மீ தொலைவில் (1 மணி 15 நிமிடம்). மாற்றாக, ஆலுவா மெட்ரோவிற்கு ஃபீடர் பேருந்து எடுத்து, திருப்புனித்துறை நிலையத்திற்குச் சென்று, பின் 15 நிமிட ஆட்டோ பயணம் செய்யலாம்.",
      venue1Train: "சுமார் 18 கி.மீ தொலைவில். வைட்டிலா வழியாக நேரடி டாக்ஸி/ஆட்டோவில் (40 நிமிடம்) செல்லலாம், அல்லது கொச்சி மெட்ரோவில் நேரடியாக திருப்புனித்துறை நிலையம் சென்று குறுகிய ஆட்டோ பயணம் செய்யலாம்.",
      venue1Bus: "வைட்டிலா மொபிலிட்டி ஹப் மற்றும் காலூர் தனியார் பேருந்து நிலையத்திலிருந்து சோட்டானிக்கராவிற்கு நேரடி உள்ளூர் மற்றும் KSRTC பேருந்துகள் அடிக்கடி இயங்குகின்றன.",
      venue1Road: "வடக்கிலிருந்து, திருவன்குளம் வழியாக சீபோர்ட்-ஏர்போர்ட் சாலையைப் பயன்படுத்தவும். தெற்கிலிருந்து, குந்தன்னூர் சந்திப்பில் கொச்சி பைபாஸிலிருந்து வெளியேறி திருப்புனித்துறை வழியாக செல்லவும்.",
      venue2TrainLabel: "🚂 திருச்சி ரயில்வே ஜங்ஷனிலிருந்து:",
      venue2Airport: "திருச்சிராப்பள்ளி சர்வதேச விமான நிலையத்திலிருந்து (TRZ) சுமார் 5.5 கி.மீ. ஏர்போர்ட் சாலை வழியாக நேரடி டாக்ஸி அல்லது ஆட்டோவில் சுமார் 15 முதல் 20 நிமிடங்கள் ஆகும்.",
      venue2Train: "சுமார் 1 கி.மீ தொலைவில். வில்லியம்ஸ் சாலையில் 5 நிமிட பயணம் அல்லது நடைபயணத் தொலைவில் அமைந்துள்ளது. முனையத்திற்கு வெளியே நிறுத்தப்பட்டுள்ள ஆட்டோ-ரிக்ஷாக்கள் மூலம் எளிதில் அடையலாம்.",
      venue2Bus: "திருச்சி மத்திய பேருந்து நிலையத்திற்கு குறுக்கே (3 நிமிட நடைபயணத்திற்கும் குறைவாக). தொலைதூர அரசு அல்லது தனியார் பேருந்துகள் மூலம் வரும் விருந்தினர்களுக்கு மிகவும் வசதியானது.",
      venue2Road: "கன்டோன்மென்டில் மையமாக அமைந்துள்ளது. சென்னை-திருச்சி நெடுஞ்சாலை (NH 45) வழியாக எளிதில் அடையலாம். விருந்தினர் பார்க்கிங் வசதியுடன் வில்லியம்ஸ் சாலை வழியாக நேரடி நுழைவு.",
      contactEyebrow: "தொடர்பு கொள்ள",
      contactTitle: "குடும்ப <em>தொடர்புகள்</em>",
      groomFamilyLabel: "மாப்பிள்ளை குடும்பம்",
      groomFamilyName: "எர். என். தியாகு குடும்பம்",
      brideFamilyLabel: "மணமகள் குடும்பம்",
      brideFamilyName: "பிரதீப்குமார் குடும்பம்",
      fatherOfGroom: "மாப்பிள்ளையின் தந்தை",
      motherOfGroom: "மாப்பிள்ளையின் தாய்",
      theGroom: "மாப்பிள்ளை",
      brotherOfGroom: "மாப்பிள்ளையின் சகோதரர்",
      fatherOfBride: "மணமகளின் தந்தை",
      brotherOfBride: "மணமகளின் சகோதரர்",
      motherOfBride: "மணமகளின் தாய்",
      theBride: "மணமகள்",
      wishesEyebrow: "இதயத்திலிருந்து",
      wishesTitle: "உங்கள் <em>வாழ்த்துகளை</em> அனுப்புங்கள்",
      yourName: "உங்கள் பெயர் *",
      relationLabel: "தம்பதியருடனான உறவு",
      yourWish: "உங்கள் வாழ்த்து *",
      sendWishes: "வாழ்த்துகளை அனுப்பு",
      wishesPlaceholderText: "💜 அன்புக்குரியவர்களின் வாழ்த்துகள் இங்கே தோன்றும்…",
      footerTagline: "செப்டம்பர் 2026 · சோட்டானிக்கரா, கேரளா & திருச்சி, தமிழ்நாடு",
      footerNote: "அன்புடன் உருவாக்கப்பட்டது · இரு குடும்பங்கள், ஒரு அழகான தொடக்கம்",
      namePlaceholder: "எ.கா. சுரேஷ் குமார்",
      relationPlaceholder: "எ.கா. மாப்பிள்ளையின் கல்லூரி நண்பர்",
      wishPlaceholder: "ராமகிருஷ்ணன் & பிரதீதாவிற்கு உங்கள் இதயப்பூர்வமான வாழ்த்துகளை எழுதுங்கள்…",
      galleryEyebrow: "பகிர்ந்த நினைவுகள்",
      galleryTitle: "நிகழ்ச்சி <em>கேலரி</em>",
      galleryLabel: "நினைவுகளை பிடிக்கவும்",
      gallerySubLabel: "க்ளிக் செய்து பதிவேற்று",
      galleryHelpText: "எமது நினைவுகளை சேமிக்க உதவுங்கள்! நிகழ்ச்சி நாட்களில் (செப் 12, 13, மற்றும் 15) உங்கள் கேமராவில் இருந்து நேரடியாக <strong style=\"color:var(--gold-light)\">3 படங்களை</strong> பிடித்து பதிவேற்றலாம்.",
      photosUploadedLabel: "படங்கள் பதிவேற்றப்பட்டவை:",
      memoriesBannerTitle: "உங்கள் பதிவேற்றிய நினைவுகள்",
      memoriesBannerSubtitle: "இந்த விலைமதிப்பற்ற தருணங்களைப் பகிர்ந்ததற்கு நன்றி.",
      galleryButton: "📷 புகைப்படம் எடு",
      gallerySelectButton: "🖼️ கேலரியிலிருந்து தேர்ந்தெடு",
      galleryMessagePlaceholder: "இந்த படத்துடன் சிறிய செய்தியை எழுதவும்... (விரும்பினால்)",
      galleryUploadButton: "படத்தை கேலரிக்கு பதிவேற்று",
      galleryUploadLockTitle: "நிகழ்ச்சி நாட்களில் மட்டுமே கேமரா பதிவேடுகள் திறக்கப்படும்",
      galleryUploadLockSubtitle: "செப்டம்பர் 12, 13 மற்றும் 15, 2026 அன்று உங்கள் படங்களை பதிவேற்றுங்கள்!",
      galleryEmptyState: "இந்தச் சாதனத்தில் இன்னும் நினைவுகள் எதுவும் சேமிக்கப்படவில்லை. ஒரு தருணத்தை முதலில் பகிர்ந்துகொள்பவராக நீங்களிருங்கள்!"
    },

    ml: {
      navCelebrations: "ആഘോഷങ്ങൾ",
      navVenues: "സ്ഥലങ്ങൾ",
      navGallery: "ഗ്യാലറി",
      navContact: "ബന്ധപ്പെടുക",
      navWishes: "ആശംസകൾ",
      heroEyebrow: "✨ &nbsp; ഞങ്ങളുടെ കുടുംബങ്ങളോടൊപ്പം, ഞങ്ങളുടെ യാത്രയുടെ ആരംഭം ആഘോഷിക്കാൻ നിങ്ങളെ സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു &nbsp; ✨",
      heroWeds: "വിവാഹം",
      heroDate: "സെപ്റ്റംബർ 2026 &nbsp;·&nbsp; കേരളം & തമിഴ്നാട്",
      envTitleTop: "✨ &nbsp; ഒരു വിവാഹ ക്ഷണക്കത്ത് &nbsp; ✨",
      envBlessings: "🪔 &nbsp; ഞങ്ങളുടെ കുടുംബങ്ങളുടെ അനുഗ്രഹത്തോടെ &nbsp; 🪔",
      envTapPrompt: "നിങ്ങളുടെ ക്ഷണക്കത്ത് തുറക്കാൻ മുദ്ര സ്പർശിക്കുക",
      countdownLabel: "ആ നിമിഷത്തിലേക്കുള്ള കൗണ്ട്ഡൗൺ",
      countdownSubtitle: "🌸 തിരുമണം · 13 സെപ്റ്റംബർ 2026 · രാവിലെ 7:00",
      cdDays: "ദിവസം", cdHours: "മണിക്കൂർ", cdMin: "മിനിറ്റ്", cdSec: "സെക്കൻഡ്",
      cdDone: "🎉 അവർ വിവാഹിതരായി! അഭിനന്ദനങ്ങൾ!",
      celebrationsEyebrow: "മൂന്ന് ദിവസത്തെ ആഘോഷം",
      sectionCelebrations: "ഞങ്ങളുടെ <em>ആഘോഷങ്ങൾ</em>",
      monthSep: "സെപ്റ്റംബർ",
      dateSat: "ശനിയാഴ്ച · 2026",
      dateSun: "ഞായറാഴ്ച · 2026",
      dateTue: "ചൊവ്വാഴ്ച · 2026",
      event1Name: "💍 നിശ്ചയം",
      event1Time: "വൈകുന്നേരം 6:30 - രാത്രി 9:00",
      event2Name: "🌸 തിരുമണം",
      event2Time: "രാവിലെ 7:00 - 10:00",
      event3Name: "🎊 വരവേൽപ്പ്",
      event3Time: "ഉച്ചയ്ക്ക് 12:30 - 2:30",
      venue1Name: "മംഗല്യ ഓഡിറ്റോറിയം",
      venue1Address: "ചോറ്റാനിക്കര വണ്ടിപ്പേട്ട റോഡ്, ചോറ്റാനിക്കര, തൃപ്പൂണിത്തുറ, എറണാകുളം, കേരളം 682312",
      venue2Name: "രാംയാസ് ഹോട്ടൽ",
      venue2Address: "13-D/2, വില്യംസ് റോഡ്, കന്റോൺമെന്റ്, തിരുച്ചിറപ്പള്ളി, തമിഴ്നാട് 620001",
      openMaps: "ഗൂഗിൾ മാപ്സിൽ തുറക്കുക",
      venuesEyebrow: "എങ്ങനെ എത്താം",
      venuesTitle: "<em>സ്ഥലങ്ങൾ</em> ഒറ്റനോട്ടത്തിൽ",
      venue1Tag: "നിശ്ചയവും വിവാഹവും",
      venue1City: "ചോറ്റാനിക്കര, എറണാകുളം, കേരളം",
      venue2Tag: "വരവേൽപ്പ്",
      venue2City: "തിരുച്ചി (തിരുച്ചിറപ്പള്ളി), തമിഴ്നാട്",
      howToReach: "സ്ഥലത്ത് എത്തിച്ചേരേണ്ട വിധം",
      fromAirportLabel: "✈️ വിമാനത്താവളത്തിൽ നിന്ന്:",
      fromBusLabel: "🚌 ബസ് സ്റ്റാൻഡുകളിൽ നിന്ന്:",
      byRoadLabel: "🚗 റോഡ് മാർഗം:",
      venue1TrainLabel: "🚂 എറണാകുളം ജംഗ്ഷനിൽ (സൗത്ത്) നിന്ന്:",
      venue1Airport: "സീപോർട്ട്-എയർപോർട്ട് റോഡ് വഴി ഏകദേശം 38 കി.മീ (1 മണിക്കൂർ 15 മിനിറ്റ്). പകരം, ആലുവ മെട്രോയിലേക്ക് ഫീഡർ ബസ് എടുത്ത്, തൃപ്പൂണിത്തുറ സ്റ്റേഷനിലേക്ക് പോയി, പിന്നെ 15 മിനിറ്റ് ഓട്ടോ യാത്ര ചെയ്യാം.",
      venue1Train: "ഏകദേശം 18 കി.മീ അകലെ. വൈറ്റില വഴി നേരിട്ട് ടാക്സി/ഓട്ടോയിൽ (40 മിനിറ്റ്) പോകാം, അല്ലെങ്കിൽ കൊച്ചി മെട്രോയിൽ നേരിട്ട് തൃപ്പൂണിത്തുറ സ്റ്റേഷനിലേക്ക് പോയി ചെറിയ ഓട്ടോ യാത്ര ചെയ്യാം.",
      venue1Bus: "വൈറ്റില മൊബിലിറ്റി ഹബിൽ നിന്നും കലൂർ പ്രൈവറ്റ് ബസ് സ്റ്റാൻഡിൽ നിന്നും ചോറ്റാനിക്കരയിലേക്ക് നേരിട്ടുള്ള ലോക്കൽ, KSRTC ബസുകൾ ഇടയ്ക്കിടെ ഓടുന്നു.",
      venue1Road: "വടക്ക് നിന്ന്, തിരുവൻകുളം വഴി സീപോർട്ട്-എയർപോർട്ട് റോഡ് ഉപയോഗിക്കുക. തെക്ക് നിന്ന്, കുന്നംനൂർ ജംഗ്ഷനിൽ കൊച്ചി ബൈപാസിൽ നിന്ന് ഇറങ്ങി തൃപ്പൂണിത്തുറ വഴി പോകുക.",
      venue2TrainLabel: "🚂 തിരുച്ചി റെയിൽവേ ജംഗ്ഷനിൽ നിന്ന്:",
      venue2Airport: "തിരുച്ചിറപ്പള്ളി അന്താരാഷ്ട്ര വിമാനത്താവളത്തിൽ (TRZ) നിന്ന് ഏകദേശം 5.5 കി.മീ. എയർപോർട്ട് റോഡ് വഴി നേരിട്ട് ടാക്സിയിലോ ഓട്ടോയിലോ ഏകദേശം 15 മുതൽ 20 മിനിറ്റ് വരെ എടുക്കും.",
      venue2Train: "ഏകദേശം 1 കി.മീ അകലെ. വില്യംസ് റോഡിൽ 5 മിനിറ്റ് ഡ്രൈവ് അല്ലെങ്കിൽ നടത്തദൂരത്തിലാണ്. ടെർമിനലിന് പുറത്ത് നിർത്തിയിട്ടിരിക്കുന്ന ഓട്ടോ-റിക്ഷകൾ വഴി എളുപ്പത്തിൽ എത്തിച്ചേരാം.",
      venue2Bus: "തിരുച്ചി സെൻട്രൽ ബസ് സ്റ്റാൻഡിന് എതിർവശത്ത് (3 മിനിറ്റിൽ താഴെ നടത്തദൂരം). ദീർഘദൂര സർക്കാർ അല്ലെങ്കിൽ സ്വകാര്യ ബസുകളിൽ എത്തുന്ന അതിഥികൾക്ക് വളരെ സൗകര്യപ്രദമാണ്.",
      venue2Road: "കന്റോൺമെന്റിൽ മധ്യഭാഗത്തായി സ്ഥിതി ചെയ്യുന്നു. ചെന്നൈ-തിരുച്ചി ഹൈവേ (NH 45) വഴി എളുപ്പത്തിൽ എത്തിച്ചേരാം. അതിഥികൾക്കുള്ള പാർക്കിംഗ് സൗകര്യത്തോടെ വില്യംസ് റോഡ് വഴി നേരിട്ടുള്ള പ്രവേശനം.",
      contactEyebrow: "ബന്ധപ്പെടുക",
      contactTitle: "കുടുംബ <em>ബന്ധപ്പെടാനുള്ളവ</em>",
      groomFamilyLabel: "വരന്റെ കുടുംബം",
      groomFamilyName: "ഏർ. എൻ. തിയാഗു കുടുംബം",
      brideFamilyLabel: "വധുവിന്റെ കുടുംബം",
      brideFamilyName: "പ്രദീപ്കുമാർ കുടുംബം",
      fatherOfGroom: "വരന്റെ പിതാവ്",
      motherOfGroom: "വരന്റെ മാതാവ്",
      theGroom: "വരൻ",
      brotherOfGroom: "വരന്റെ സഹോദരൻ",
      fatherOfBride: "വധുവിന്റെ പിതാവ്",
      brotherOfBride: "വധുവിന്റെ സഹോദരൻ",
      motherOfBride: "വധുവിന്റെ മാതാവ്",
      theBride: "വധു",
      wishesEyebrow: "ഹൃദയത്തിൽ നിന്ന്",
      wishesTitle: "നിങ്ങളുടെ <em>ആശംസകൾ</em> അയക്കുക",
      yourName: "നിങ്ങളുടെ പേര് *",
      relationLabel: "ദമ്പതികളുമായുള്ള ബന്ധം",
      yourWish: "നിങ്ങളുടെ ആശംസ *",
      sendWishes: "ആശംസകൾ അയക്കുക",
      wishesPlaceholderText: "💜 പ്രിയപ്പെട്ടവരുടെ ആശംസകൾ ഇവിടെ ദൃശ്യമാകും…",
      footerTagline: "സെപ്റ്റംബർ 2026 · ചോറ്റാനിക്കര, കേരളം & തിരുച്ചി, തമിഴ്നാട്",
      footerNote: "സ്നേഹത്തോടെ നിർമ്മിച്ചത് · രണ്ട് കുടുംബങ്ങൾ, ഒരു മനോഹരമായ തുടക്കം",
      namePlaceholder: "ഉദാ. സുരേഷ് കുമാർ",
      relationPlaceholder: "ഉദാ. വരന്റെ കോളേജ് സുഹൃത്ത്",
      wishPlaceholder: "രാമകൃഷ്ണനും പ്രദീതയ്ക്കും നിങ്ങളുടെ ഹൃദയംഗമമായ ആശംസകൾ എഴുതുക…",
      galleryEyebrow: "പങ്കുവെച്ച ഓർമകൾ",
      galleryTitle: "ഇവന്റ് <em>ഗ്യാലറി</em>",
      galleryLabel: "ക്ഷണങ്ങളെ പിടിക്കുക",
      gallerySubLabel: "ക്ലിക്ക് ചെയ്ത് അപ്‌ലോഡ് ചെയ്യുക",
      galleryHelpText: "ഞങ്ങളുടെ ഓർമകൾ സംരക്ഷിക്കാൻ സഹായിക്കൂ! ഇവന്റ് ദിവസങ്ങളിൽ (സെപ്റ്റംബർ 12, 13, & 15) നിങ്ങളുടെ క్యാമറയിൽ നിന്ന് നേരിട്ട് <strong style=\"color:var(--gold-light)\">3 ഫോട്ടോകൾ</strong> പകർത്തി അപ്‌ലോഡ് ചെയ്യാം.",
      photosUploadedLabel: "അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോകൾ:",
      galleryButton: "📷 ഫോട്ടോ എടുക്കൂ",
      gallerySelectButton: "🖼️ ഗാലറിയിൽ നിന്ന് തിരഞ്ഞെടുക്കൂ",
      galleryMessagePlaceholder: "ഈ ഫോട്ടോയ്‌ക്കൊപ്പം ചെറിയ സന്ദേശം എഴുതൂ... (ഐച്ഛികം)",
      galleryUploadButton: "ഫോട്ടോ ഗ്യാലറിയിലേക്ക് അപ്‌ലോഡ് ചെയ്യൂ",
      galleryUploadLockTitle: "ഇവന്റ് ദിവസങ്ങളിൽ മാത്രമേ ക്യാമറ അപ്‌ലോഡുകൾ തുറക്കൂ",
      galleryUploadLockSubtitle: "സെപ്റ്റംബർ 12, 13, 15, 2026-ന് നിങ്ങളുടെ ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യൂ!",
      galleryEmptyState: "ഈ ഉപകരണത്തിൽ ഇതുവരെ ഓർമ്മകളൊന്നും സംരക്ഷിക്കപ്പെട്ടിട്ടില്ല. ആദ്യമായി ഒരു നിമിഷം പങ്കുവെക്കുന്നയാൾ നിങ്ങളാകൂ!"
    }
  };

  let currentLang = 'en';

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    const dict = translations[lang];

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Translate all tagged text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Persist choice for this session
    try { sessionStorage.setItem('weddingLang', lang); } catch(e) {}

    // Update html lang attribute for accessibility
    document.documentElement.setAttribute('lang', lang);
  }

  // Restore previously chosen language (if any) on load
  (function initLanguage() {
    let saved = 'en';
    try { saved = sessionStorage.getItem('weddingLang') || 'en'; } catch(e) {}
    if (saved !== 'en') setLanguage(saved);
  })();

  // --- PHOTO CAPTURE & EVENT RESTRICTION CONFIGURATION ---
const APP_SCRIPT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzKarcZW2n3eCEr8jKNzojPRJEGlibCx67_nrpuIHquBSe1zd0XqnSoqmfFtqbUcruQ/exec";
const EVENT_DAYS = ["2026-09-12", "2026-09-13", "2026-09-15"]; // Target Event Dates
const MAX_PHOTOS_ALLOWED = 3;

// --- CLOUDINARY CONFIGURATION ---
// Replace with your own Cloudinary cloud name + unsigned upload preset
// (Dashboard > Settings > Upload > Upload presets > Add upload preset > Signing mode: Unsigned)
const CLOUDINARY_CLOUD_NAME = "jjvj8sd2";
const CLOUDINARY_UPLOAD_PRESET = "wedding_gallery";
const CLOUDINARY_FOLDER = "wedding-gallery";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Initialize counts, restrictions, and the live gallery on page load
document.addEventListener("DOMContentLoaded", () => {
  checkEventDayRestriction();
  updateUploadCounterDisplay();
  loadGlobalGallery();
});

function checkEventDayRestriction() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${year}-${month}-${day}`;

  const isEventDay = EVENT_DAYS.includes(formattedToday);
  
  // Toggle UI visibility based on the exact date matches
  if (!isEventDay) {
    document.getElementById("upload-interface").style.display = "none";
    document.getElementById("upload-lock-interface").style.display = "block";
  }
}

function updateUploadCounterDisplay() {
  const currentUploads = parseInt(localStorage.getItem("user_upload_count") || "0", 10);
  const counter = document.getElementById("photo-count-tracker");
  const limitNote = document.getElementById("upload-limit-note");
  const actionButtons = document.querySelectorAll(".gallery-action-btn");
  const submitBtn = document.getElementById("submit-photo-btn");
  const cameraInput = document.getElementById("camera-file-input");
  const galleryInput = document.getElementById("gallery-file-input");

  if (counter) counter.innerText = currentUploads;

  if (limitNote) {
    limitNote.style.display = currentUploads >= MAX_PHOTOS_ALLOWED ? "block" : "none";
  }

  actionButtons.forEach(btn => {
    if (currentUploads >= MAX_PHOTOS_ALLOWED) {
      btn.setAttribute("disabled", "true");
    } else {
      btn.removeAttribute("disabled");
    }
  });

  if (cameraInput) {
    if (currentUploads >= MAX_PHOTOS_ALLOWED) {
      cameraInput.setAttribute("disabled", "true");
    } else {
      cameraInput.removeAttribute("disabled");
    }
  }

  if (galleryInput) {
    if (currentUploads >= MAX_PHOTOS_ALLOWED) {
      galleryInput.setAttribute("disabled", "true");
    } else {
      galleryInput.removeAttribute("disabled");
    }
  }

  if (submitBtn) {
    if (currentUploads >= MAX_PHOTOS_ALLOWED) {
      submitBtn.setAttribute("disabled", "true");
    } else {
      submitBtn.removeAttribute("disabled");
    }
  }
}
