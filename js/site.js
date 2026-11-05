// Builds the contents sidebar from the page's headings (h2, and h3 as
// indented sub-items) and highlights the section currently being read.
// To add a section, just add a heading to the page: the sidebar follows.
(function () {
  var toc = document.querySelector(".toc");
  var article = document.querySelector("article");
  if (!toc || !article) return;

  var headings = Array.prototype.slice.call(article.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  var slug = function (text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };

  var links = headings.map(function (h) {
    if (!h.id) h.id = slug(h.textContent);
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    if (h.tagName === "H3") a.className = "sub";
    toc.appendChild(a);
    return a;
  });

  var ticking = false;

  function update() {
    ticking = false;
    var current = 0;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= 140) current = i;
      else break;
    }
    var atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (atBottom) current = headings.length - 1;
    links.forEach(function (a, i) {
      a.classList.toggle("active", i === current);
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
})();
