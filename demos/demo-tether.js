// BUG: false positions when #red element before #gray.
// BUG: TypeError: Argument 1 of Window.getComputedStyle does not implement interface Element.

var simpleDemos = function() {
  // attachment: "vertical-pos horizontal-pos"
  // vertical-pos: ["top", "middle", "bottom"]
  // horizontal-pos: ["left", "center", "right"]

  var $demoAttachment = $("#demo-attachment");
  $demoAttachment.find(".orange").addClass("left");
  new Tether({
    element: $demoAttachment.find(".orange"),
    attachment: "bottom left",

    target: $demoAttachment.find(".elem").get(0),
    targetAttachment: "bottom right"
  });

  var $demoOffset = $("#demo-offset");
  $demoOffset.find(".orange").addClass("left");
  new Tether({
    element: $demoOffset.find(".orange"),
    attachment: "bottom left",

    target: $demoOffset.find(".elem").get(0),
    targetAttachment: "bottom right",

    offset: "0 -8px"
  });

  var $demoConstraint = $("#demo-constraint");
  $demoConstraint.find(".orange:nth(0)").addClass("left");
  //$demoConstraint.find(".orange:nth(1)").addClass("right");
  new Tether({
    element: $demoConstraint.find(".orange"),
    attachment: "bottom left",

    target: $demoConstraint.find(".elem").get(0),
    targetAttachment: "bottom right",

    constraints: [{
      to: $demoConstraint.find(".control").get(1),
      pin: ["left", "bottom"]
    }]
  });
  //new Tether({
  //  element: $demoConstraint.find(".orange"),
  //  attachment: "top right",
  //
  //  target: $demoConstraint.find(".elem").get(0),
  //  targetAttachment: "top left",
  //
  //  constraints: [{
  //    to: $demoConstraint.find(".control").get(0),
  //    pin: ["right", "top"]
  //  }]
  //});

};

var advancedDemos = function() {
  var $demoTooltip = $("#demo-tooltip");
  $demoTooltip.find(".orange").addClass("bottom");
  new Tether({
    element: $demoTooltip.find(".orange"),
    attachment: "bottom center",

    target: $demoTooltip.find(".elem").get(1),
    targetAttachment: "top center",

    offset: "8px 0"
  });

  var $demoNote = $("#demo-note");
  $demoNote.find(".orange").addClass("left");
  new Tether({
    element: $demoNote.find(".orange"),
    attachment: "top left",

    target: $demoNote.find(".elem").get(1),
    targetAttachment: "top right",

    constraints: [{
      to: $demoNote.find(".control").get(1),
      pin: ["left", "top"]
    }]
  });

};

$(function() {
  simpleDemos();
  advancedDemos();
  setTimeout(function() {
    window.scrollBy(1, 1);
  }, 10);

});
