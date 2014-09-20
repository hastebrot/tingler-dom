var BoxModelUtils = (function () {
    function BoxModelUtils() {
    }
    //-----------------------------------------------------------------------------------------------
    // STATIC METHODS.
    //-----------------------------------------------------------------------------------------------
    // BOXES.
    BoxModelUtils.elementBox = function ($element) {
        if (this._elementRect($element)) {
            return this._elementRect($element);
        }
        if (this._elementBBox($element)) {
            return this._elementBBox($element);
        }
        return {
            width: $element.width(),
            height: $element.height()
        };
    };
    BoxModelUtils.paddingBox = function ($element) {
        return {
            width: $element.innerWidth(),
            height: $element.innerHeight()
        };
    };
    BoxModelUtils.borderBox = function ($element) {
        return {
            width: $element.outerWidth(),
            height: $element.outerHeight()
        };
    };
    BoxModelUtils.marginBox = function ($element) {
        return {
            width: $element.outerWidth(true),
            height: $element.outerHeight(true)
        };
    };
    // DIMENSIONS.
    BoxModelUtils.elementDimension = function ($element) {
        return this.elementBox($element);
    };
    BoxModelUtils.paddingDimension = function ($element) {
        var paddingBox = this.paddingBox($element);
        var elementBox = this.elementBox($element);
        return {
            width: paddingBox.width - elementBox.width,
            height: paddingBox.height - elementBox.height
        };
    };
    BoxModelUtils.borderDimension = function ($element) {
        var borderBox = this.borderBox($element);
        var paddingBox = this.paddingBox($element);
        return {
            width: borderBox.width - paddingBox.width,
            height: borderBox.height - paddingBox.height
        };
    };
    BoxModelUtils.marginDimension = function ($element) {
        var marginBox = this.marginBox($element);
        var borderBox = this.borderBox($element);
        return {
            width: marginBox.width - borderBox.width,
            height: marginBox.height - borderBox.height
        };
    };
    // OFFSETS.
    BoxModelUtils.paddingOffsets = function ($element) {
        return {
            "left": this._parseValue($element.css("padding-left")),
            "right": this._parseValue($element.css("padding-right")),
            "top": this._parseValue($element.css("padding-top")),
            "bottom": this._parseValue($element.css("padding-bottom"))
        };
    };
    BoxModelUtils.borderOffsets = function ($element) {
        return {
            "left": this._parseValue($element.css("border-left-width")),
            "right": this._parseValue($element.css("border-right-width")),
            "top": this._parseValue($element.css("border-top-width")),
            "bottom": this._parseValue($element.css("border-bottom-width"))
        };
    };
    BoxModelUtils.marginOffsets = function ($element) {
        return {
            "left": this._parseValue($element.css("margin-left")),
            "right": this._parseValue($element.css("margin-right")),
            "top": this._parseValue($element.css("margin-top")),
            "bottom": this._parseValue($element.css("margin-bottom"))
        };
    };
    //-----------------------------------------------------------------------------------------------
    // PRIVATE STATIC METHODS.
    //-----------------------------------------------------------------------------------------------
    BoxModelUtils._parseValue = function (value) {
        return parseInt(value, 10) || 0;
    };
    BoxModelUtils._elementRect = function ($element) {
        if ($element[0].getBoundingClientRect) {
            var rect = $element[0].getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height
            };
        }
        return null;
    };
    BoxModelUtils._elementBBox = function ($element) {
        if ($element[0].getBBox) {
            var box = $element[0].getBBox();
            return {
                width: box.width,
                height: box.height
            };
        }
        return null;
    };
    return BoxModelUtils;
})();
//# sourceMappingURL=boxModelUtils.js.map