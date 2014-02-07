/**
 *
 * rataeditor: redAlumnos TextArea WYSIWYG Editor v0.9
 *
 */

// i18n support from previous loaded file
if (typeof rataeditor_i18n == 'undefined')
{
    var rataeditor_i18n = {
        sample      : 'texto de ejemplo',
        bold        : 'Negrita',
        italic      : 'Itálica',
        paragraph   : 'Párrafo',
        HTML        : 'HTML',
        link        : 'Enlace',
        image       : 'Imagen',
        url         : 'Dirección URL',
        imageurl    : 'Dirección de la imagen'
    };
}

var rataeditor = (function($){
    'use strict';

	$.fn.rataeditor = function(options) {
        'use strict';

        // Merge external options with default ones
		var config = $.extend(true, {
            width           : '100%',
            height          : '25em',
            iframestyle           : 'body {width:100%;margin: 1em 0;'+
                'padding: 0;font-family: Verdana, sans-serif;'+
                'background-color: #fff; overflow-x: hidden}'+
                'a{}'+
                'ul{display: inline-table;margin: auto;}'
                +'img {max-width:75%}',
            keyup           : null,
            // List of default functions
            // id, name, css icon, style, unused, unused, unused, unused, function
            functions       : {
                b : ['b',rataeditor_i18n.bold,'ricn-b','','','','','',function($rata){insertHTMLTag($rata, '<strong>', '</strong>');}],
                i : ['i',rataeditor_i18n.italic,'ricn-i','','','','','',function($rata){insertHTMLTag($rata, '<i>', '</i>');}],
                p : ['p',rataeditor_i18n.paragraph,'ricn-p','','','','','',function($rata){insertHTMLTag($rata, '<p>', '</p>');}],
                img : ['img',rataeditor_i18n.image,'ricn-img','float:right','','','','',function($rata){var url = prompt(rataeditor_i18n.imageurl, '');if (url) insertHTMLTag($rata, '<img src="'+url+'" />', '');}],
                a : ['a',rataeditor_i18n.link,'ricn-a','','','','','',function($rata){var url = prompt(rataeditor_i18n.imageurl, '');if (url) insertHTMLTag($rata, '<a href="'+url+'">', '</a>');}],
                source : ['source',rataeditor_i18n.html,'ricn-source','float:right','','','','',function($rata, $textarea){$rata.slideToggle(); $textarea.slideToggle();}]
            }
        }, options);

        // INTERNAL FUNCTIONS

        function insertHTMLTag($element, startTag, endTag)
        {
            var iframe = $element.get(0);
            var win = iframe.contentWindow;
            var doc = iframe.contentDocument || win.document;
            var range, replacementText, replacedText;

            if (win.getSelection) {
                var sel = win.getSelection();
                replacedText = win.getSelection().toString();
                // If replaced text is empty, we get a sample text
                if (replacedText == '') replacedText = rataeditor_i18n.sample;
                // Delimited with tags
                replacementText = startTag+replacedText+endTag;
                if (sel.rangeCount) {
                    // Range.createContextualFragment() would be useful here but was until recently non-standard and not supported in all browsers (IE9, for one)
                    var el = document.createElement('div'), frag = document.createDocumentFragment(), node, lastNode;
                    el.innerHTML = replacementText;

                    range = sel.getRangeAt(0);
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    range.deleteContents();
                    range.insertNode(frag);
                }
            } else if (doc.selection && doc.selection.createRange) {
                // <IE9
                range = doc.selection.createRange();
                replacedText = range.text;
                // If replaced text is empty, we get a sample text
                if (replacedText == '') replacedText = rataeditor_i18n.sample;
                range.pasteHTML(startTag+replacedText+endTag);
            }

            return true;
        }

        // Create editors for every TEXTAREA
		var rtrn = this.each(function(){
            var $t = $(this);
            var id = $t.attr('id');

            // Insert IFRAME .we prefer IFRAME (vs DIV) because the CSS is non dependant from the main document.
            $t.before('<div class="rataed" data-target="#'+id+'"><div class="rataed-menu"></div></div>');
            // Get main rata
            var $main = $t.prev();
            // Create IFRAME and obtained as jQuery object
            $main.append('<iframe class="rataed-editor"></iframe>');
            var $rata = $main.find('.rataed-editor');

            // Load document for IFRAME
            // 1. Insert style in IFRAME's HEAD
            // 2. Set IFRAME's BODY attributes and set data-target
            // 3. Copy TEXTAREA HTML to IFRAME's BODY HTML
            var doc = $rata[0].contentWindow.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><head><style>'+config.iframestyle+'</style></head><body contenteditable="true" data-target="#'+id+'" style="' + config.bodystyle + '">'+$t.val()+'</body></html>');
            doc.close();

            // Put buttons in menu
            var $menu = $t.prev().find('.rataed-menu');
            $.each(config.functions, function(index, value){
//                $menu.append('<abbr title="'+value[1]+'" class="'+value[2]+'" style="'+value[3]+'" data-function="'+value[0]+'"></abbr>');
                $menu.append('<abbr title="'+value[1]+'" class="'+value[2]+'" style="'+value[3]+'" data-function="'+index+'"></abbr>');
            });
            // Set width and heigth
            $rata.width(config.width).height(config.height);

            // Look for BODY in IFRAME
            var $body = $rata.contents().find('body');

            // Capture keyup and changes in TEXTAREA
            $t.keyup(function(event){
                rataeditor.updateEditor('#'+$(this).attr('id'));
            }).change(function(event){
                rataeditor.updateEditor('#'+$(this).attr('id'));
            });

            // Capture keyup and changes in IFRAME's BODY (rataed-editor)
            $body.keyup(function(event){
                rataeditor.updateTextarea($(this).data('target'));
                if (config.keyup) config.keyup();
            }).change(function(event){
                rataeditor.updateTextarea($(this).data('target'));
            });

            // Ocultamos TEXTAREA
            $t.hide();
		});

        // Click event for every menu created in every editor
        $('.rataed-menu').on('click', 'abbr', function(event){
            var $t = $(this);

            var functionname = $t.data('function'),                         // Get the function name
                target = $t.closest('.rataed').data('target'),              // Get target TEXTAREA as DOM element
                $target = $(target),                                        // Get target TEXTAREA as jQuery object
                $rata = $t.closest('.rataed').find('.rataed-editor');       // Get IFRAME editor

            // Select function to execute
            $.each(config.functions, function(index, value){
                // If found, is executed.
                if (value[0] == functionname) {
                    value[8]($rata, $target);
                }
            });

            // Update TEXTAREA
            rataeditor.updateTextarea(target);
        });

        // Every menu is returned
        return rtrn;
	};

    // API

    return {
        // Update rataeditor for specific TEXTAREA
        updateEditor: function(id) {
            // Copy TEXTAREA's HTML to IFRAME's BODY (.rataed-editor)
            $(".rataed[data-target='"+id+"']").find('.rataed-editor').contents().find('body').html($(id).val());
        },

        // Update specific TEXTAREA from its rataeditor
        updateTextarea: function(id) {
            // Copy IFRAME's BODY (.rataed-editor) to TEXTAREA's HTML
            $(id).val($(".rataed[data-target='"+id+"']").find('.rataed-editor').contents().find('body').html());
        }
    };
})(jQuery);