/*!
 * jquery-pagemap v1.0
 */

(function ($) {
    "use strict";

    /**
    * Replaces accented letters by corresponding non-accented letters.
    * @param {string} string The string to process
    * @private
    * @author Pascal Lando
    */
    function remove_accents(string) {
        var i,
            noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'],
            accent = [
                /[\300-\306]/g, /[\340-\346]/g,
                /[\310-\313]/g, /[\350-\353]/g,
                /[\314-\317]/g, /[\354-\357]/g,
                /[\322-\330]/g, /[\362-\370]/g,
                /[\331-\334]/g, /[\371-\374]/g,
                /[\321]/g, /[\361]/g,
                /[\307]/g, /[\347]/g
            ];

        for (i = 0; i < accent.length; i += 1) {
            string = string.replace(accent[i], noaccent[i]);
        }

        return string;
    }

    /**
    * Generates a slug from a common string.
    * @see http://en.wikipedia.org/wiki/Slug_(web_publishing)#Slug
    * @param {string} string The string to process
    * @private
    * @author Pascal Lando
    */
    function generate_slug(string) {
        return remove_accents(string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g,'-').replace(/^-+|-+$/g,'');
    }

    /**
    * Generates a "hx, ..., hy" string beetwen 2 numbers x and y.
    * @param {number} start_depth The initial depth
    * @param {number} end_depth The destination depth
    * @private
    * @author Pascal Lando
    */
    function generate_selectors_string(start_depth, end_depth) {
        var i,
            ret = '';

        for (i = start_depth; i <= end_depth; i += 1) {
            if (i > start_depth) {
                ret += ', h' + i;
            } else {
                ret = 'h' + i;
            }
        }
        return ret;
    }

    /**
    * Generates the actual toc ul.
    * @param {jQuery} $content_container The content container to parse
    * @param {jQuery} $toc_container The toc container where to render
    * @param {number} start_depth The initial depth
    * @param {number} end_depth The destination depth
    * @private
    * @author Pascal Lando
    */
    function generate_toc($content_container, $toc_container, start_depth, end_depth) {
        var $headers = $content_container.find(generate_selectors_string(start_depth, end_depth)),
            inserted = [0],
            header_index,
            $header,
            h_text,
            h_slug,
            h_depth,
            where_to_insert,
            i;

        $toc_container.append($('<ul class="toc0">'));

        for (header_index = 0; header_index < $headers.length; header_index++) {
            $header = $($headers[header_index]);
            h_text = $header.text();
            h_slug = generate_slug(h_text);
            h_depth = parseInt($header.get(0).nodeName.substring(1, 2), 10);
            where_to_insert = 0;

            $header.prepend('<a name="' + h_slug + '"></a>');

            for (i = inserted.length; i >= 0; i -= 1) {
                if (inserted[i] < h_depth) {
                    where_to_insert = inserted[i];
                    break;
                }
            }

            $toc_container.find('.toc' + where_to_insert).last().append('<li><a href="#' + h_slug + '">' + h_text + '</a><ul class="toc' + h_depth + '"></ul></li>');
            inserted.push(h_depth);
        }

    }

    /**
    * The plugin main function.
    * @author Pascal Lando
    */
    $.fn.pagemap = function (options) {
        var language = navigator.language || navigator.userLanguage,
            btn_text_trans = {fr: 'Afficher le plan', en: 'Show TOC'},
            default_options = {
                toc_container: '#toc',
                start_depth: 2,
                end_depth: 5,
                replace_by_btn: false,
                btn_classes: "btn btn-default",
                btn_text: '<span class="glyphicon glyphicon-th-list"></span> ' + (language in btn_text_trans ? btn_text_trans[language] : btn_text_trans.en)
            },
            settings = $.extend({}, default_options, options);

        this.each(function () {
            var $content_container = $(this),
                $toc_container = $(settings.toc_container);

            generate_toc(
                $content_container,
                $toc_container,
                settings.start_depth,
                settings.end_depth
            );

            if (settings.replace_by_btn) {
                $toc_container.wrap('<div class="toc-wrapper"></div>');
                var $wrap_div = $toc_container.closest('.toc-wrapper');
                $wrap_div.append('<a data-action="show-pagemap" class="' + settings.btn_classes + '">' + settings.btn_text + '</a>');
                $toc_container.hide();
                $toc_container.addClass('toc-container');

                $wrap_div.on('click', 'a[data-action="show-pagemap"]', function () {
                    $(this).hide();
                    $(this).closest('.toc-wrapper').find('.toc-container').show();
                    return false;
                });
            }
        });

    };

}(jQuery));
