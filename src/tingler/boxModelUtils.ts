
class BoxModelUtils {

  //-----------------------------------------------------------------------------------------------
  // STATIC METHODS.
  //-----------------------------------------------------------------------------------------------

  // BOXES.

  static elementBox($element) {
    if (this._elementRect($element)) { return this._elementRect($element); }
    if (this._elementBBox($element)) { return this._elementBBox($element); }
    return {
      width: $element.width(),
      height: $element.height()
    };
  }

  static paddingBox($element) {
    return {
      width: $element.innerWidth(),
      height: $element.innerHeight()
    };
  }

  static borderBox($element) {
    return {
      width: $element.outerWidth(),
      height: $element.outerHeight()
    };
  }

  static marginBox($element) {
    return {
      width: $element.outerWidth(true),
      height: $element.outerHeight(true)
    };
  }

  // DIMENSIONS.

  static elementDimension($element) {
    return this.elementBox($element);
  }

  static paddingDimension($element) {
    var paddingBox = this.paddingBox($element);
    var elementBox = this.elementBox($element);
    return {
      width: paddingBox.width - elementBox.width,
      height: paddingBox.height - elementBox.height
    };
  }

  static borderDimension($element) {
    var borderBox = this.borderBox($element);
    var paddingBox = this.paddingBox($element);
    return {
      width: borderBox.width - paddingBox.width,
      height: borderBox.height - paddingBox.height
    };
  }

  static marginDimension($element) {
    var marginBox = this.marginBox($element);
    var borderBox = this.borderBox($element);
    return {
      width: marginBox.width - borderBox.width,
      height: marginBox.height - borderBox.height
    };
  }

  // OFFSETS.

  static paddingOffsets($element) {
    return {
      "left": this._parseValue($element.css("padding-left")),
      "right": this._parseValue($element.css("padding-right")),
      "top": this._parseValue($element.css("padding-top")),
      "bottom": this._parseValue($element.css("padding-bottom"))
    };
  }

  static borderOffsets($element) {
    return {
      "left": this._parseValue($element.css("border-left-width")),
      "right": this._parseValue($element.css("border-right-width")),
      "top": this._parseValue($element.css("border-top-width")),
      "bottom": this._parseValue($element.css("border-bottom-width"))
    };
  }

  static marginOffsets($element) {
    return {
      "left": this._parseValue($element.css("margin-left")),
      "right": this._parseValue($element.css("margin-right")),
      "top": this._parseValue($element.css("margin-top")),
      "bottom": this._parseValue($element.css("margin-bottom"))
    };
  }

  //-----------------------------------------------------------------------------------------------
  // PRIVATE STATIC METHODS.
  //-----------------------------------------------------------------------------------------------

  private static _parseValue(value) {
    return parseInt(value, 10) || 0;
  }

  private static _elementRect($element) {
    if ($element[0].getBoundingClientRect) {
      var rect = $element[0].getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height
      };
    }
    return null;
  }

  private static _elementBBox($element) {
    if ($element[0].getBBox) {
      var box = $element[0].getBBox();
      return {
        width: box.width,
        height: box.height
      };
    }
    return null;
  }

}
