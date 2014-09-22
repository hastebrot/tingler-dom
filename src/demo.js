
var initSections = function() {
  // markdown text.
  var $markdownText = $("#text-comments pre code");
  $markdownText.text(stripIndent($markdownText.html()).trim());
  var $markdownHtml = $("#text-comments .markdown");
  $markdownHtml.html(marked($markdownText.text(), {sanitize: false}));

  // math formula.
  var $mathFormula = $("#math-formula .formula");
  katex.render($mathFormula.text(), $mathFormula[0]);

  // graph network.
  var $graphModel = $("#graph-network .model");
  var $graphView = $("#graph-network svg g");
  var model = graphlibDot.parse($graphModel.text());
  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout().nodeSep(20).rankDir("LR");
  renderer.layout(layout).run(model, d3.select($graphView.get(0)));

  // source code.
  var $sourceCode = $("#source-code pre code");
  $sourceCode.text(stripIndent($sourceCode.text()).trim());
  hljs.highlightBlock($sourceCode.get(0));
  var sourceCodeLines = $sourceCode.html().split(/\n/);
  $sourceCode.empty();
  _(sourceCodeLines).each(function(sourceCodeLine, index) {
    var lineNumber = index + 1;
    $line = $("<div>").attr("id", "line-" + lineNumber).html(sourceCodeLine);
    $sourceCode.append($line);
  });

  // geo map.
  var $mapModel = $("#world-map .model");
  var $mapView = $("#world-map .map");
  var map = L.map($mapView.get(0), {attributionControl: false});
  map.setView([49, 12], 4);
  var defaultStyle = {
    fillColor: "#fff",
    fillOpacity: 1,
    fill: true,
    stroke: true,
    color: "red",
    weight: 2
  };
  $.getJSON($mapModel.text().trim(), function(data) {
    L.geoJson(data, {
      style: defaultStyle,
      onEachFeature: function(feature, layer) {}
    }).addTo(map);
  });

  // pdf document.
  // var $pdfView = $("#pdf-document .view");
  // var $textLayer = $("#pdf-document .textLayer");
  // var url = "data/TestDocument.pdf";
  // PDFJS.getDocument(url).then(function(pdf) {
  //   pdf.getPage(1).then(function(page) {
  //     var scale = 1.5;
  //     var viewport = page.getViewport(scale);

  //     var canvas = $pdfView.get(0);
  //     var context = canvas.getContext("2d");
  //     canvas.height = viewport.height;
  //     canvas.width = viewport.width;

  //     var renderContext = {
  //       canvasContext: context,
  //       viewport: viewport
  //     };
  //     page.render(renderContext);

  //     page.getTextContent().then(function (textContent) {
  //       var textLayerBuilder = new TextLayerBuilder({
  //         textLayerDiv: $textLayer.get(0),
  //         viewport: viewport,
  //         pageIndex: 0
  //       });
  //       textLayerBuilder.setTextContent(textContent);
  //     });
  //   });
  // });

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

$(function() {
  initSections();
});
