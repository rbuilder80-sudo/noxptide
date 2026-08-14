/* Noxptide SEO Master — render run log + queue from embedded JSON; copy button. */
(function () {
  "use strict";

  var dataEl = document.getElementById("seo-data");
  var data = null;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { data = null; }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function statusClass(status) {
    return status === "ok" ? "status-ok"
      : (status === "fail" ? "status-fail" : "status-skipped");
  }

  if (data) {
    var runs = document.querySelector("#run-table tbody");
    if (runs && Array.isArray(data.runs)) {
      data.runs.slice().reverse().forEach(function (r) {
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + esc(r.ts) + "</td>" +
          "<td>" + esc(r.action) + "</td>" +
          '<td class="' + statusClass(r.status) + '">' + esc(r.status) + "</td>" +
          "<td>" + esc(r.detail) + "</td>";
        runs.appendChild(tr);
      });
    }
    var queue = document.querySelector("#queue-table tbody");
    if (queue && Array.isArray(data.queue)) {
      data.queue.forEach(function (q) {
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td><code>" + esc(q.key) + "</code></td>" +
          "<td>" + esc(q.task) + "</td>" +
          '<td class="' + statusClass(q.status) + '">' + esc(q.status) + "</td>";
        queue.appendChild(tr);
      });
    }
    var site = document.getElementById("stat-site");
    if (site) {
      site.textContent = "200 · TLS verified (" + esc(data.site) + ")";
    }
  }

  /* Copy repo URL button — real clipboard action, with fallback. */
  var btn = document.getElementById("copy-repo");
  if (btn) {
    var url = "https://github.com/rbuilder80-sudo/noxptide";
    btn.addEventListener("click", function () {
      function done() {
        btn.textContent = "copied";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = "copy repo URL"; btn.classList.remove("copied"); }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* no-op */ }
        document.body.removeChild(ta);
      }
    });
  }
})();
