var renderMarkdownText = function(sourceText, $target) {
  $target.html(marked(sourceText, {sanitize: false}));
};

var renderLatexFormula = function(sourceText, $target) {
  katex.render(sourceText, $target.get(0));
};

var renderSourceCode = function(sourceText, $target) {
  $target.text(sourceText);
  hljs.highlightBlock($target.get(0));
  instructSourceCodeLines($target);
};

var instructSourceCodeLines = function($target) {
  var lines = $target.html().split(/\n/);
  $target.empty();
  _(lines).each(function(line, index) {
    var lineNumber = index + 1;
    var $line = $("<div>").attr("id", "line-" + lineNumber).html(line);
    $target.append($line);
  });
};

var renderGraphvizGraph = function(sourceText, $target) {
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
  renderer.layout(layout).run(dagreGraph, d3.select($target.get(0)));
};

var renderGeojsonMap = function(sourceText, $target) {
  var leafletMap = L.map($target.get(0), {attributionControl: false});
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
