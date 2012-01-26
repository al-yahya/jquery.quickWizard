(function ($) {
    'use strict';
    var pluginName = 'quickWizard',
        defaults = {
            prevButton: '<button type="button">Previous</button>',
            nextButton: '<button type="button">Next</button>',
            startChild: ':first',
            nextShow: null,
            nextHide: null,
            prevShow: null,
            prevHide: null,
            buttonContainer: null
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

        options.nextShow = (jQuery.effects && !options.nextShow) ? ["slide", { direction: "right"}, 500] : options.nextShow;
        options.nextHide = (jQuery.effects && !options.nextHide) ? ["slide", { direction: "left"}, 500] : options.nextHide;
        options.prevShow = (jQuery.effects && !options.prevShow) ? ["slide", { direction: "left"}, 500] : options.prevShow;
        options.prevHide = (jQuery.effects && !options.prevHide) ? ["slide", { direction: "right"}, 500] : options.prevHide;

        options.buttonContainer = options.buttonContainer || element;

        showHide = function (button, showArgs, hideArgs) {
            var childToHide,
                childToShow;

            childToHide = $(children[index]);
            index = (button === buttons.prev) ? index - 1 : index + 1;
            childToShow = $(children[index]);

            $.fn.hide.apply(childToHide, hideArgs);
            $.fn.show.apply(childToShow, showArgs);

            childToShow.promise().done(function () {
                console.log("show fired from plugin");
            });

            childToHide.promise().done(function () {
                console.log("hide fired from plugin");
            });

            jqueryElement.trigger(button);
        };

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

        prevButton.click(function () {
            if (!validation || $(children[index]).find(':input').valid()) {
                if (index > 0) {
                    showHide(buttons.prev, options.prevShow, options.prevHide);
                }
                checkDisabled();
            }
        });

        nextButton.click(function () {
            if (index < length - 1) {
                showHide(buttons.next, options.nextShow, options.nextHide);
            }
            checkDisabled();
        });

        $(element).children(":not(" + options.startChild + ")").hide();
        $(options.buttonContainer).append(prevButton, nextButton);
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