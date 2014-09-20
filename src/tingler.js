// TODO: write technical document.
// TODO: browserify components
// TODO: implement complete path algorithm.
// TODO: fix position: relative bug and margin-left for highlight.
// TODO: implement <pre> + \n to lines with <div id="line-1" class="inline">...</div>
// TODO: implement path info string: tag (magenta) #id (green) .class (blue).
// TODO: implement absolute path to element with :nth().
// TODO: implement <span> insertion algorithm that detects overlapping tags.

var initSections = function() {
  // markdown text.
  var $markdownText = $("#text-comments .markdown");
  var markdownText = stripIndent($markdownText.html()).trim();
  $markdownText.html(marked(markdownText, {sanitize: false}));

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

// only visible elements
// only top elements
// issues with <a> in map (zero dimensions)
// issues with "a" in formula (includes margins)
// isuues with wrapped <u> in text (different to firefox inspector)
// paths in map are difficult to pick
// issues with <tspan> in formula when zoomed (wrong dimensions)

var initTingler = function() {
  var $tingleButtons = $(".annotate.button");
  $tingleButtons.on("click", function() {
    var $tingleButton = $(this);
    var isActive = $tingleButton.hasClass("active");
    var $targetParent = $tingleButton.closest(".tingler.controls").siblings(".tingler.target");
    var $annotations = $tingleButton.siblings(".annotations");

    $tingleButton.removeClass("active");
    if (!isActive) {
      $tingleButton.addClass("active");
      activateTingler($targetParent, $annotations);
    }
    else {
      deactivateTingler($targetParent);
    }
  });
};

var activateTingler = function($targetParent, $annotations) {
  var $tinglerHighlight = $("<div>").addClass("tingler").addClass("highlight");
  var $tinglerPath = $("<div>").addClass("tingler").addClass("path");

  $currentTarget = null;
  $targetParent.on("mousemove", function(event) {
    var $target = $(event.target);
    if ($currentTarget === null || $target[0] !== $currentTarget[0]) {
      updateTinglerHighlight($target, $tinglerHighlight);
      updateTinglerPath($target, $tinglerPath);
    }
    if ($currentTarget === null) {
      $targetParent.append($tinglerHighlight);
      $targetParent.append($tinglerPath);
    }
    $currentTarget = $target;
    //event.stopPropagation();
  });

  $targetParent.on("click", function(event) {
    var tagName = "<" + $currentTarget.prop("tagName").toLowerCase() + ">";
    var $annotation = $("<div>").addClass("annotation").text(tagName);
    $annotations.append($annotation);
  })
};

var deactivateTingler = function($targetParent) {
  var $tinglerHighlight = $targetParent.find(".tingler.highlight");
  var $tinglerPath = $targetParent.find(".tingler.path");
  $tinglerHighlight.remove();
  $tinglerPath.remove();
  $targetParent.off("mousemove");
  $targetParent.off();
};

var calculateTingleBounds = function($target) {
  var position = $target.offset();
  var marginOffsets = BoxModelUtils.marginOffsets($target);
  var borderOffsets = BoxModelUtils.borderOffsets($target);
  var paddingOffsets = BoxModelUtils.paddingOffsets($target);
  var elementBox = BoxModelUtils.elementBox($target);

  var offsets = {
    left: marginOffsets.left + borderOffsets.left + paddingOffsets.left,
    top: marginOffsets.top + borderOffsets.top + paddingOffsets.top
  }
  var bounds = {
    left: -window.scrollX + position.left /*+ offsets.left*/,
    top: -window.scrollY + position.top /*+ offsets.top*/,
    width: elementBox.width,
    height: elementBox.height
  };

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
  var pathString = buildTinglerPathString($target);
  $tinglerPath.text(pathString);

  var bounds = calculateTingleBounds($target);
  var position = {
    left: (bounds.left + (bounds.width / 2)) - ($tinglerPath.outerWidth() / 2),
    top: bounds.top - $tinglerPath.outerHeight() - 8
  };
  $tinglerPath.css("left", position.left).css("top", position.top);
};

var buildTinglerPathString = function($target) {
  var tagName = "<" + $target.prop("tagName").toLowerCase() + ">";
  var parentTagNames = _($target.parents()).map(function(parent) {
    return parent.tagName.toLowerCase()
  });
  var pathString = tagName + " (" + parentTagNames + ")";
  return pathString;
};

$(function() {
  initSections();
  initTingler();
});
