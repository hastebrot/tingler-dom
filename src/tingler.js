
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

$(function() {

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

});
