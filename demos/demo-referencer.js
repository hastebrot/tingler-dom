var initSections = function() {
  // MARKDOWN TEXT.

  var $markdownText = $("#markdown-text");
  var $markdownTextSource = $markdownText.find(".tingler-editor pre code");
  var $markdownTextTarget = $markdownText.find(".tingler-target .markdown");

  sanitizeElement($markdownTextSource, $markdownTextSource.html());
  renderMarkdownText($markdownTextSource.text(), $markdownTextTarget.get(0));

  // LATEX FORMULA.

  var $latexFormula = $("#latex-formula");
  var $latexFormulaSource = $latexFormula.find(".tingler-editor pre code");
  var $latexFormulaTarget = $latexFormula.find(".tingler-target .formula");

  sanitizeElement($latexFormulaSource, $latexFormulaSource.text());
  renderLatexFormula($latexFormulaSource.text(), $latexFormulaTarget.get(0));

  // SOURCE CODE.

  var $sourceCode = $("#source-code");
  var $sourceCodeSource = $sourceCode.find(".tingler-editor pre code");
  var $sourceCodeTarget = $sourceCode.find(".tingler-target pre code");

  sanitizeElement($sourceCodeSource, $sourceCodeSource.text());
  renderSourceCode($sourceCodeSource.text(), $sourceCodeTarget.get(0));

  // GRAPHVIZ GRAPH.

  var $graphvizGraph = $("#graphviz-graph");
  var $graphvizGraphSource = $graphvizGraph.find(".tingler-editor pre code");
  var $graphvizGraphTarget = $graphvizGraph.find(".tingler-target svg g");

  sanitizeElement($graphvizGraphSource, $graphvizGraphSource.text());
  renderGraphvizGraph($graphvizGraphSource.text(), $graphvizGraphTarget.get(0));

  // GEOJSON MAP.

  var $geojsonMap = $("#geojson-map");
  var $geojsonMapSource = $geojsonMap.find(".tingler-editor pre code");
  var $geojsonMapTarget = $geojsonMap.find(".tingler-target .map");

  sanitizeElement($geojsonMapSource, $geojsonMapSource.text());
  renderGeojsonMap($geojsonMapSource.text(), $geojsonMapTarget.get(0));
};

var sanitizeElement = function($element, text) {
  $element.text(sanitizeText(text));
};

var sanitizeText = function(text) {
  return stripIndent(text).trim();
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
