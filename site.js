document.getElementById("year").textContent = new Date().getFullYear();

var IOS_URL = "https://apps.apple.com/app/id6785015345";
var PLAY_URL = "https://play.google.com/store/apps/details?id=com.underneath.v2";

// Show people the store they can actually install from. Anything we cannot
// identify keeps both buttons, which is also the no-JS state.
var ua = navigator.userAgent || "";
var isIOS = /iPad|iPhone|iPod/.test(ua) ||
            (/Macintosh/.test(ua) && typeof document.ontouchend !== "undefined");
var isAndroid = /Android/.test(ua);

if (isIOS) document.body.classList.add("plat-ios");
else if (isAndroid) document.body.classList.add("plat-android");

// One move in the page, on the reference's easing, and only for people who
// did not ask for stillness.
var wantsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var risers = document.querySelectorAll(".rise");

if (wantsMotion && "IntersectionObserver" in window) {
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      reveal.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  risers.forEach(function (el) { reveal.observe(el); });
} else {
  risers.forEach(function (el) { el.classList.add("in"); });
}

// The floating bar only earns its space on a phone, where the header call to
// action scrolls away and there is no room for a persistent one.
var dock = document.getElementById("dock");
var dockBtn = document.getElementById("dockBtn");
var isPhone = window.matchMedia("(max-width: 699px)").matches;

if (isPhone) {
  if (isIOS) dockBtn.href = IOS_URL;
  else if (isAndroid) dockBtn.href = PLAY_URL;

  dock.style.display = "block";
  document.body.classList.add("has-dock");

  var hero = document.querySelector(".hero .store-row");
  var footerCta = document.getElementById("download");

  if (!hero && !footerCta) {
    // The inner pages carry no store buttons of their own, so there is
    // nothing for the bar to stand down for and it simply stays.
    dock.classList.add("show");
  } else {
    // Hide the bar while either real set of buttons is on screen, so we are
    // never stacking a second call to action on top of the one being read.
    var onscreen = [];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = onscreen.indexOf(e.target);
        if (e.isIntersecting && i === -1) onscreen.push(e.target);
        if (!e.isIntersecting && i !== -1) onscreen.splice(i, 1);
      });
      dock.classList.toggle("show", onscreen.length === 0);
    }, { threshold: 0.15 });

    if (hero) io.observe(hero);
    if (footerCta) io.observe(footerCta);
  }
}

// The review row loops by sliding exactly one group width and starting over,
// which only reads as continuous if a second identical group is already in
// place behind the first. The clone is made here rather than written out
// twice, so the reviews have one source. With no script there is no clone,
// nothing moves, and the row is simply a static row.
//
// The slide is driven here frame by frame rather than by a CSS animation. A
// CSS animation hands the work to the compositor, and a compositor that
// decides to stop repainting this row leaves it frozen with no way to tell
// from the page that anything is wrong. A frame loop cannot fail quietly:
// either the whole page is stopped or the row is moving.
var track = document.querySelector(".marquee-track");
if (track) {
  var group = track.querySelector(".marquee-group");
  if (group) {
    var copy = group.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);

    if (wantsMotion) {
      var PX_PER_SEC = 66;
      var offset = 0;
      var last = 0;

      var step = function (now) {
        // The first frame has nothing to measure against, and a frame after
        // the tab was hidden reports the whole gap at once. Both would jump.
        var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
        last = now;

        offset -= PX_PER_SEC * dt;
        var groupWidth = group.offsetWidth;
        if (groupWidth && offset <= -groupWidth) offset += groupWidth;

        track.style.transform = "translateX(" + offset + "px)";
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  }
}

// Footer sign-up. Posts to the same public endpoint the waitlist always
// used. The endpoint wants to know which store to send someone to, so it is
// told what the user agent already told us, defaulting to iOS when we cannot
// tell. The endpoint treats a repeat address as success, so saying it twice
// is harmless.
var news = document.getElementById("news");
var newsNote = document.getElementById("news-note");
var newsInput = document.getElementById("news-email");

if (news) {
  news.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var email = (newsInput.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newsNote.textContent = "That does not look like an email address.";
      return;
    }
    newsNote.textContent = "Signing you up...";
    fetch("https://ufqqilewsnujxroesgqa.supabase.co/functions/v1/waitlist-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        platform: isAndroid ? "android" : "ios",
        source: "site-footer"
      })
    }).then(function (r) {
      if (!r.ok) throw new Error("signup failed");
      newsNote.textContent = "You are on the list.";
      news.reset();
    }).catch(function () {
      newsNote.textContent = "That did not go through. Email tryunderneath@gmail.com and we will add you.";
    });
  });
}
