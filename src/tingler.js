
var initSections = function() {
  // markdown text.
  $markdownText = $("#text-comments pre code");
  $markdownText.text(stripIndent($markdownText.html()).trim());
  var $markdownHtml = $("#text-comments .markdown");
  $markdownHtml.html(marked($markdownText.text(), {sanitize: false}));

  // math formula.
  var $mathFormula = $("#math-formula .formula");
  katex.render($mathFormula.text(), $mathFormula[0]);

  // graph network.
  $graphModel = $("#graph-network .model");
  $graphView = $("#graph-network svg g");
  var model = graphlibDot.parse($graphModel.text());
  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout().nodeSep(20).rankDir("LR");
  renderer.layout(layout).run(model, d3.select($graphView.get(0)));

  // source code.
  $sourceCode = $("#source-code pre code");
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

// only visible elements
// only top elements
// issues with <a> in map (zero dimensions)
// issues with "a" in formula (includes margins)
// isuues with wrapped <u> in text (different to firefox inspector)
// paths in map are difficult to pick
// issues with <tspan> in formula when zoomed (wrong dimensions)

var initTingler = function() {
  var $tingleButtons = $(".ref.button");
  $tingleButtons.on("click", function() {
    var $tingleButton = $(this);
    var isActive = $tingleButton.hasClass("active");
    var $targetParent = $tingleButton.closest(".tingler").find(".tingler-target");
    var $annotations = $tingleButton.closest(".tingler").find(".tingler-refs .refs");

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
  var $tinglerOverlay = $("<div>").addClass("tingler-overlay");
  $targetParent.append($tinglerOverlay);

  var $tinglerHighlight = $("<div>").addClass("highlight");
  var $tinglerPath = $("<div>").addClass("path");

  $currentTarget = null;
  $targetParent.on("mousemove", function(event) {
    var $target = $(event.target);
    if ($currentTarget === null || $target[0] !== $currentTarget[0]) {
      updateTinglerHighlight($target, $tinglerHighlight);
      updateTinglerPath($target, $tinglerPath);
    }
    if ($currentTarget === null) {
      $tinglerOverlay.append($tinglerHighlight);
      $tinglerOverlay.append($tinglerPath);
    }
    $currentTarget = $target;
    //event.stopPropagation();
  });

  $targetParent.on("click", function(event) {
    var tagName = "<" + $currentTarget.prop("tagName").toLowerCase() + ">";
    var $annotation = $("<div>").addClass("ref").text(tagName);
    $annotations.append($annotation);
  })
};

var deactivateTingler = function($targetParent) {
  var $tinglerOverlay = $targetParent.find(".tingler-overlay");
  $tinglerOverlay.remove();
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
};

var updateTinglerPath = function($target, $tinglerPath) {
  var identifier = fetchElementIdentifier($target);

  var tagString = identifier.tag;
  var idString = identifier.id === "" ? "" :
    "#" + identifier.id;
  var classesString = identifier.classes == "" ? "" :
    "." + identifier.classes.split(/\s+/).join(".");

  var tag = $("<span>").addClass("tag").text(tagString);
  var id = $("<span>").addClass("id").text(idString);
  var classes = $("<span>").addClass("classes").text(classesString);
  var element = $("<div>").addClass("element").append(tag).append(id).append(classes);
  $tinglerPath.html(element);

  //var reversedPath = fetchReversedPath($target);
  //$tinglerPath.text(reversedPath.toString());

  var bounds = calculateTingleBounds($target);
  var position = {
    left: (bounds.left + (bounds.width / 2)) - ($tinglerPath.outerWidth() / 2),
    top: bounds.top - $tinglerPath.outerHeight() - 8
  };
  $tinglerPath.css("left", position.left).css("top", position.top);
};

var fetchElementIdentifier = function($element) {
  var identifier = {
    "tag": $element.prop("tagName").toLowerCase(),
    "id": $element.attr("id") || "",
    "classes": $element.attr("class") || ""
  }
  return identifier;
};

var fetchReversedPath = function($element) {
  var reversedElements = $.merge([$element.get(0)], $element.parents());
  var reversedPath = _(reversedElements).map(function(element) {
    return $(element).prop("tagName").toLowerCase();
  });
  return reversedPath;
}

$(function() {
  initSections();
  initTingler();
});
