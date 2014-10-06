var initSections = function() {
  // MARKDOWN TEXT.

  var $markdownText = $("#markdown-text");
  var $markdownTextSource = $markdownText.find(".tingler-editor pre code");
  var $markdownTextTarget = $markdownText.find(".tingler-target .markdown");

  renderMarkdownText($markdownTextSource, $markdownTextTarget);

  // LATEX FORMULA.

  var $latexFormula = $("#latex-formula");
  var $latexFormulaSource = $latexFormula.find(".tingler-editor pre code");
  var $latexFormulaTarget = $latexFormula.find(".tingler-target .formula");

  renderLatexFormula($latexFormulaSource, $latexFormulaTarget);

  // SOURCE CODE.

  var $sourceCode = $("#source-code");
  var $sourceCodeSource = $sourceCode.find(".tingler-editor pre code");
  var $sourceCodeTarget = $sourceCode.find(".tingler-target pre code");

  renderSourceCode($sourceCodeSource, $sourceCodeTarget);

  // GRAPHVIZ GRAPH.

  var $graphvizGraph = $("#graphviz-graph");
  var $graphvizGraphSource = $graphvizGraph.find(".tingler-editor pre code");
  var $graphvizGraphTarget = $graphvizGraph.find(".tingler-target svg g");

  renderGraphvizGraph($graphvizGraphSource, $graphvizGraphTarget);

  // GEOJSON MAP.

  var $geojsonMap = $("#geojson-map");
  var $geojsonMapSource = $geojsonMap.find(".tingler-editor pre code");
  var $geojsonMapTarget = $geojsonMap.find(".tingler-target .map");

  renderGeojsonMap($geojsonMapSource, $geojsonMapTarget);
};

$(function() {
  initSections();
});
