# rataeditor

RedAlumnos TextAreas WYSIWYG Editor

## Synopsis

**rataeditor** is a *tiny*, *expandable*, *i18n compliant*, Javascript WYSIWYG editor. It requires jQuery framework.

**Tiny**, because its size: 11Kb uncompressed.

**Expandable**, because it can be expanded with your own functions/buttons through configuration parameters.

**i18n compliant**, you can load (script tag) your own internationalization file.

The rest is easy, Javascript WYSIWYG (what you see is what you get) editor.

## Code Example

HTML:

    <textarea id="editor">Initial text, even this text can be changed from rataeditor API</textarea>

Javascript, with no configuration parameters:

    $('#editor).rataeditor();

Javascript, using configuration parameters:

    var opts = {
        width           : '100%',
        height          : '25em',
        iframestyle     : 'body {width:100%;margin: 1em 0;'+
                          'padding: 0;font-family: Verdana, sans-serif;'+
                          'background-color: color: #FFF;overflow-x: hidden}'+
                          'a{color: #B1C5BC}'+
                          'ul{display: inline-table;margin: auto;}'+
                          'img {max-width:75%}',
        keyup           : function(){alert('Key pushed');},
        functions       : {
            new : ['new',rataeditor_i18n.your_i18n_string,'ricn-icon','','','','','',function($rata){alert('New button!');}]
        }
    };

    $('#editor).rataeditor(opts);

You can pass new functions and buttons with **opts.functions**. Every element of this array means:

    key : [function id, button string, css icon, style of button, unused, unused, unused, unused, onclick function]

## Installation

Optionally include your own i18n file, include jQuery (cdn/local), jquery.rataeditor.js and jquery.rataeditor.css
    
    // Optional
    <script src="inc/jquery.rataeditor.i18n.js"></script>

    // jQuery
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="inc/vendor/jquery-2.1.0.min.js">\x3C/script>')</script>

    // rataeditor
    <script src="inc/jquery.rataeditor.js"></script>

    // rataeditor stylesheet
    <link rel="stylesheet" type="text/css" href="inc/jquery.rataeditor.css">

## Internationalization

If you want to include your own i18n file you **MUST** include it before the rataeditor includes.

    var rataeditor_i18n = {
        sample      : 'sample text',
        bold        : 'Bold',
        italic      : 'Italic',
        paragraph   : 'Paragraph',
        HTML        : 'HTML',
        link        : 'Link',
        image       : 'Image',
        url         : 'URL',
        imageurl    : 'Image URL'
    };

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## API Reference

The rataeditor class provides a JavaScript API for interacting with editors:

    // Update rataeditor from its assigned TEXTAREA
    rataeditor.updateEditor(id);
  
    // Update TEXTAREA from the linked rataeditor
    rataeditor.updateTextarea(id);
  
    // Put HTML tag into the selected textarea 'id'
    rataeditor.append(id, startTag, endTag);

## Tests

Clone repository and start index.html with your favorite Internet browser.

## History

We have implented a new area in [redAlumnos](http://www.redalumnos.com) for showing slides to students, but I needed a customizable, lightweight WYSIWYG javascript editor. It's a nice plugin because I needed to be the best for our platform.

## Credits

Javier Fuentes [@javierfuentesal](http://www.twitter.com/javierfuentesal)

## License

MIT licensed

Copyright (c) 2014 Amphora Nuevas Tecnologías S.L. (http://www.amphora.es)
