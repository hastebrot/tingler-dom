
var initSections = function() {

  // MARKDOWN TEXT.

  var $markdownText = $("#markdown-text");
  var $markdownTextSource = $markdownText.find(".tingler-editor pre code");
  var $markdownTextTarget = $markdownText.find(".tingler-target .markdown");

  $markdownTextSource.text(sanitizeText($markdownTextSource.html()));
  $markdownTextTarget.html(marked($markdownTextSource.text(), {sanitize: false}));

  // LATEX FORMULA.

  var $latexFormula = $("#latex-formula");
  var $latexFormulaSource = $latexFormula.find(".tingler-editor pre code");
  var $latexFormulaTarget = $latexFormula.find(".tingler-target .formula");

  $latexFormulaSource.text(sanitizeText($latexFormulaSource.text()));
  katex.render($latexFormulaSource.text(), $latexFormulaTarget.get(0));

  // SOURCE CODE.

  var $sourceCode = $("#source-code");
  var $sourceCodeSource = $sourceCode.find(".tingler-editor pre code");
  var $sourceCodeTarget = $sourceCode.find(".tingler-target pre code");

  $sourceCodeSource.text(sanitizeText($sourceCodeSource.text()));
  $sourceCodeTarget.text($sourceCodeSource.text());

  hljs.highlightBlock($sourceCodeTarget.get(0));
  var sourceCodeLines = $sourceCodeTarget.html().split(/\n/);
  $sourceCodeTarget.empty();
  _(sourceCodeLines).each(function(sourceCodeLine, index) {
    var lineNumber = index + 1;
    var $line = $("<div>").attr("id", "line-" + lineNumber).html(sourceCodeLine);
    $sourceCodeTarget.append($line);
  });

  // GRAPHVIZ GRAPH.

  var $graphvizGraph = $("#graphviz-graph");
  var $graphvizGraphSource = $graphvizGraph.find(".tingler-editor pre code");
  var $graphvizGraphTarget = $graphvizGraph.find(".tingler-target svg g");

  $graphvizGraphSource.text(sanitizeText($graphvizGraphSource.text()));

  var graphlibGraph = graphlibDot.read($graphvizGraphSource.text());
  var dagreGraph = new dagreD3.Digraph();
  _(graphlibGraph.nodes()).each(function(node) {
    dagreGraph.addNode(node, graphlibGraph.node(node));
  });
  _(graphlibGraph.edges()).each(function(edge) {
    dagreGraph.addEdge(null, edge.v, edge.w, graphlibGraph.edge(edge));
  });

  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout().nodeSep(20).rankDir("LR");
  renderer.layout(layout).run(dagreGraph, d3.select($graphvizGraphTarget.get(0)));

  // GEOJSON MAP.

  var $geojsonMap = $("#geojson-map");
  var $geojsonMapSource = $geojsonMap.find(".tingler-editor pre code");
  var $geojsonMapTarget = $geojsonMap.find(".tingler-target .map");

  $geojsonMapSource.text(sanitizeText($geojsonMapSource.text()));

  var leafletMap = L.map($geojsonMapTarget.get(0), {attributionControl: false});
  leafletMap.setView([49, 12], 4);

  $.getJSON($geojsonMapSource.text(), function(data) {
    var defaultStyle = {
      fillColor: "#fff",
      fillOpacity: 1,
      fill: true,
      stroke: true,
      color: "#800",
      weight: 2
    };
    L.geoJson(data, {
      style: defaultStyle,
      onEachFeature: function(feature, layer) {}
    }).addTo(leafletMap);
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

var sanitizeText = function(text) {
  return stripIndent(text).trim();
};

$(function() {
  initSections();
});
