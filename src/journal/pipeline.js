var renderMarkdownText = function($source, $target) {
  $source.text(sanitizeText($source.html()));
  $target.html(marked($source.text(), {sanitize: false}));
};

var renderLatexFormula = function($source, $target) {
  $source.text(sanitizeText($source.text()));
  katex.render($source.text(), $target.get(0));
};

var renderSourceCode = function($source, $target) {
  $source.text(sanitizeText($source.text()));
  $target.text($source.text());

  hljs.highlightBlock($target.get(0));
  var lines = $target.html().split(/\n/);
  $target.empty();
  _(lines).each(function(line, index) {
    var lineNumber = index + 1;
    var $line = $("<div>").attr("id", "line-" + lineNumber).html(line);
    $target.append($line);
  });
};

var renderGraphvizGraph = function($source, $target) {
  $source.text(sanitizeText($source.text()));

  var graphlibGraph = graphlibDot.read($source.text());
  var dagreGraph = new dagreD3.Digraph();
  _(graphlibGraph.nodes()).each(function(node) {
    dagreGraph.addNode(node, graphlibGraph.node(node));
  });
  _(graphlibGraph.edges()).each(function(edge) {
    dagreGraph.addEdge(null, edge.v, edge.w, graphlibGraph.edge(edge));
  });

  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout().nodeSep(20).rankDir("LR");
  renderer.layout(layout).run(dagreGraph, d3.select($target.get(0)));
};

var renderGeojsonMap = function($source, $target) {
  $source.text(sanitizeText($source.text()));

  var leafletMap = L.map($target.get(0), {attributionControl: false});
  leafletMap.setView([49, 12], 4);

  $.getJSON($source.text(), function(data) {
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
