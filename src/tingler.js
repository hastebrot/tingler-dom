
// https://github.com/sindresorhus/strip-indent
var stripIndent = function(str) {
  var match = str.match(/^[ \t]*(?=\S)/gm);
  if (!match) {
    return str;
  }
  var indent = Math.min.apply(Math, match.map(function (el) {
    return el.length;
  }));
  var re = new RegExp("^[ \\t]{" + indent + "}", "gm");
  return indent > 0 ? str.replace(re, "") : str;
};

var calculateTingleBounds = function($target) {
  var position = $target.position();

  var bounds = {
    left: position.left,
    top: position.top,
    width: $target.outerWidth(),
    height: $target.outerHeight()
  };

  if ($target[0].getBBox) {
    var bbox = $target[0].getBoundingClientRect();
    //var bbox = $target[0].getBBox();
    bounds.width = bbox.width;
    bounds.height = bbox.height;
  }

  return bounds;
}

var updateTinglerHighlight = function($target, $tinglerHighlight) {
  var bounds = calculateTingleBounds($target);

  $tinglerHighlight.css("left", bounds.left);
  $tinglerHighlight.css("top", bounds.top);
  $tinglerHighlight.css("width", bounds.width);
  $tinglerHighlight.css("height", bounds.height);
}

var updateTinglerPath = function($target, $tinglerPath) {
  var tagName = $target.prop("tagName").toLowerCase();
  var parentTagNames = _($target.parents()).map(function(parent) {
    return parent.tagName.toLowerCase()
  });
  $tinglerPath.text(tagName + " < " + parentTagNames);

  var bounds = calculateTingleBounds($target);
  var position = {
    left: (bounds.left + (bounds.width / 2)) - ($tinglerPath.outerWidth() / 2),
    top: bounds.top - $tinglerPath.outerHeight() - 5
  };
  $tinglerPath.css("left", position.left).css("top", position.top);
};


var initSections = function() {
  // math formula.
  var $mathFormula = $("#math-formula .formula");
  katex.render($mathFormula.text(), $mathFormula[0]);

  // graph network.
  var graph = new dagreD3.Digraph();
  graph.addNode("kspacey",    { label: "Kevin Spacey" });
  graph.addNode("swilliams",  { label: "Saul Williams" });
  graph.addNode("bpitt",      { label: "Brad Pitt" });
  graph.addNode("hford",      { label: "Harrison Ford" });
  graph.addNode("lwilson",    { label: "Luke Wilson" });
  graph.addNode("kbacon",     { label: "Kevin Bacon" });
  graph.addEdge(null, "kspacey",   "swilliams", { label: "K-PAX" });
  graph.addEdge(null, "swilliams", "kbacon",    { label: "These Vagabond Shoes" });
  graph.addEdge(null, "bpitt",     "kbacon",    { label: "Sleepers" });
  graph.addEdge(null, "hford",     "lwilson",   { label: "Anchorman 2" });
  graph.addEdge(null, "lwilson",   "kbacon",    { label: "Telling Lies in America" });
  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout().nodeSep(20).rankDir("LR");
  renderer.layout(layout).run(graph, d3.select("svg g"));

  // source code.
  $sourceCode = $("#source-code pre code");
  $sourceCode.text(stripIndent($sourceCode.text()).trim());
  hljs.initHighlightingOnLoad();

  // geo map.
  var $map = $("#world-map .map");
  var map = L.map($map[0], {attributionControl: false});
  map.setView([49, 12], 4);
  $.getJSON("data/ne_110m_admin_0_countries.geo.json", function(data) {
    L.geoJson(data, {
      style: {
        fillColor: "#fff",
        fillOpacity: 1,
        fill: true,
        stroke: true,
        color: "red",
        weight: 2
      }
    }).addTo(map);
  });
};

var initTingler = function() {
  var $tingleButtons = $(".annotate.button");
  $tingleButtons.on("click", function() {
    var $tingleButton = $(this);
    var isActive = $tingleButton.hasClass("active");

    $tingleButtons.removeClass("active");
    if (!isActive) {
      $tingleButton.addClass("active");
    }
  });

  // only visible elements
  // only top elements
  // issues with <a> in map (zero dimensions)
  // issues with "a" in formula (includes margins)
  // isuues with wrapped <u> in text (different to firefox inspector)
  // paths in map are difficult to pick
  // issues with <tspan> in formula when zoomed (wrong dimensions)

  var currentTarget = $("section");

  var tinglerHighlight = $("<div>").addClass("tingler").addClass("highlight");
  var tinglerPath = $("<div>").addClass("tingler").addClass("path");
  $("body").append(tinglerHighlight);
  $("body").append(tinglerPath);

  // TODO: track previous $target to prevent repainting no-changes.

  currentTarget.on("mousemove", function(event) {
    var $target = $(event.target);

    updateTinglerHighlight($target, tinglerHighlight);
    updateTinglerPath($target, tinglerPath);
    //event.stopPropagation();
  });
};

$(function() {
  initSections();
  initTingler();
});
