(function ($) {
    'use strict';
    var pluginName = 'quickWizard',
        defaults = {
            prevButton: '<button type="button">Previous</button>',
            nextButton: '<button type="button">Next</button>',
            startChild: ':first',
            hideEffect: 'slide',
            showEffect: 'slide'
        };

    function Plugin(element, options) {
        options = $.extend({}, defaults, options);

        var jqueryElement = $(element),
            children,
            index,
            length,
            showHide,
            prevButton = $(options.prevButton),
            nextButton = $(options.nextButton),
            buttons = {prev : 'prev', next : 'next'},
            checkDisabled,
            enable,
            disable,
            validation = $().valid;

        children = jqueryElement.children();
        index = children.filter(options.startChild).index();
        length = children.length;
        options.hideEffect = (jQuery.effects) ? options.hideEffect : '';
        options.showEffect = (jQuery.effects) ? options.showEffect : '';

        disable = function (element) {
            if (element.is(':input')) {
                element.attr('disabled', 'disabled');
            } else {
                element.attr('aria-disabled', 'true');
            }
        };

        enable = function (element) {
            if (element.is(':input')) {
                element.removeAttr('disabled');
            } else {
                element.attr('aria-disabled', 'false');
            }
        };

        checkDisabled = function () {
            if (index === 0) {
                disable(prevButton);
            } else {
                enable(prevButton);
            }

            if (index === length - 1) {
                disable(nextButton);
            } else {
                enable(nextButton);
            }
        };

        showHide = function (button) {
            $(children[index]).hide(options.hideEffect);
            if (button === buttons.prev) {
                index -= 1;
            } else {
                index += 1;
            }
            $(children[index]).show(options.showEffect);
            jqueryElement.trigger(button);
        };

        prevButton.click(function () {
            if (!validation || $(children[index]).find(':input').valid()) {
                if (index > 0) {
                    showHide(buttons.prev);
                }
                checkDisabled();
            }
        });

        nextButton.click(function () {
            if (index < length - 1) {
                showHide(buttons.next);
            }
            checkDisabled();
        });

        $(element).children(":not(" + options.startChild + ")").hide();
        $(element).append(prevButton, nextButton);
        checkDisabled();
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

}(jQuery));