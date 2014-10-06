
// only visible elements
// only top elements
// issues with <a> in map (zero dimensions)
// issues with "a" in formula (includes margins)
// isuues with wrapped <u> in text (different to firefox inspector)
// paths in map are difficult to pick
// issues with <tspan> in formula when zoomed (wrong dimensions)

var initTingler = function() {
  var $tingleEditButton = $(".edit.button");
  $tingleEditButton.on("click", function() {
    var $button = $(this);
    var isActive = $button.hasClass("active");
    var $editorElement = $button.closest(".tingler").find(".tingler-editor");

    $button.removeClass("active");
    if (!isActive) {
      $button.addClass("active");
      $editorElement.removeClass("hidden");
    }
    else {
      $editorElement.addClass("hidden");
    }
  });

  var $tingleRefsButton = $(".refs.button");
  $tingleRefsButton.on("click", function() {
    var $button = $(this);
    var isActive = $button.hasClass("active");
    var $refsElement = $button.closest(".tingler").find(".tingler-refs");

    $button.removeClass("active");
    if (!isActive) {
      $button.addClass("active");
      $refsElement.removeClass("hidden");
    }
    else {
      $refsElement.addClass("hidden");
    }
  });

  var $tingleAddRefButton = $(".ref.button");
  $tingleAddRefButton.on("click", function() {
    var $button = $(this);
    var isActive = $button.hasClass("active");
    var $targetParent = $button.closest(".tingler").find(".tingler-target");
    var $refsElement = $button.closest(".tingler").find(".tingler-refs .refs");

    $button.removeClass("active");
    if (!isActive) {
      $button.addClass("active");
      activateTingler($targetParent, $refsElement);
    }
    else {
      deactivateTingler($targetParent);
    }
  });
};

var activateTingler = function($targetParent, $refsElement) {
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
    var $refElement = $("<div>").addClass("ref").text(tagName);
    $refsElement.append($refElement);
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
  initTingler();
});
