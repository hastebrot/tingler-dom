var renderMarkdownText = function(sourceText, targetElement) {
  var $target = $(targetElement);
  $target.html(marked(sourceText, {sanitize: false}));
};

var renderLatexFormula = function(sourceText, targetElement) {
  katex.render(sourceText, targetElement);
};

var renderSourceCode = function(sourceText, targetElement) {
  var $target = $(targetElement);
  $target.text(sourceText);
  hljs.highlightBlock(targetElement);
  instructSourceCodeLines(targetElement);
};

var instructSourceCodeLines = function(targetElement) {
  var $target = $(targetElement);
  var lines = $target.html().split(/\n/);
  $target.empty();
  _(lines).each(function(line, index) {
    var lineNumber = index + 1;
    var $line = $("<div>").attr("id", "line-" + lineNumber).html(line);
    $target.append($line);
  });
};

var renderGraphvizGraph = function(sourceText, targetElement) {
  var graphlibGraph = graphlibDot.read(sourceText);
  var dagreGraph = new dagreD3.Digraph();
  _(graphlibGraph.nodes()).each(function(node) {
    dagreGraph.addNode(node, graphlibGraph.node(node));
  });
  _(graphlibGraph.edges()).each(function(edge) {
    dagreGraph.addEdge(null, edge.v, edge.w, graphlibGraph.edge(edge));
  });

  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout().nodeSep(20).rankDir("LR");
  renderer.layout(layout).run(dagreGraph, d3.select(targetElement));
};

var renderGeojsonMap = function(sourceText, targetElement) {
  var leafletMap = L.map(targetElement, {attributionControl: false});
  leafletMap.setView([49, 12], 4);

  $.getJSON(sourceText, function(data) {
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
