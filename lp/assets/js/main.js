/* フクマナ LP：LINEボタンの設定と計測（必要最小限） */
(function () {
  "use strict";
  var cfg = window.FUKUMANA_LP || {};
  var urls = cfg.LINE_URLS || {};

  // 広告URLの ?utm_content=a などに応じて、LINE の流入経路URLを切り替える
  var key = "default";
  try {
    var p = new URLSearchParams(location.search).get("utm_content");
    if (p && urls[p.toLowerCase()]) { key = p.toLowerCase(); }
  } catch (e) { /* 古いブラウザでは default のまま */ }
  var lineUrl = urls[key] || urls["default"];

  var buttons = document.querySelectorAll(".js-line");
  for (var i = 0; i < buttons.length; i++) {
    if (lineUrl) { buttons[i].setAttribute("href", lineUrl); }

    // ▼▼▼ 差し替え箇所②：LINEボタンをクリックしたときの「Lead」イベント ▼▼▼
    buttons[i].addEventListener("click", function () {
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", {
          content_name: "line_friend_add",
          content_category: this.getAttribute("data-pos") || "", // どの位置のボタンか
          creative: key                                           // どの広告（a/b/c）から来たか
        });
      }
    });
    // ▲▲▲ 差し替え箇所② ここまで ▲▲▲
  }

  // 画面下の固定ボタン：FV のボタンが画面から消えたら表示する
  var sticky = document.getElementById("sticky");
  var fvBtn = document.querySelector('.fv .js-line');
  if (sticky && fvBtn && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle("is-show", !entries[0].isIntersecting);
    }).observe(fvBtn);
  } else if (sticky) {
    sticky.classList.add("is-show");
  }
})();
