const TAB_STRING = '#';

$(document).ready(function() {
    $('textarea').focus();

    $(document).delegate('textarea','keydown', function(e) {
        if (e.which == 9) { // tab
            handleIndent(e, this);
        } else if (e.which == 13) { // return
            handleReturn(e, this);
        }
    });

    $(document).on('keyup', 'textarea', function() {
        $.post('/parse', $('form').serialize(), function(data) {
            notes = JSON.parse(data);
            var notesContainer = $('#preview');
            var string = buildNotes(notes, 1);
            notesContainer.html(string);
        });
    });
});

function buildNotes(notes, level) {
    var string = '<ul class="notes note-level-'+level+'">';

    notes.forEach(function(note) {
        string = string + buildNote(note);
        if (note.hasChildren) {
            string = string + buildNotes(note.children, note.level + 1)
        }
    });

    string = string + '</ul>';
    return string;
}

function buildNote(note) {
    return '<li>'+note.text+'</li>';
}

function handleIndent(e, self) {
    if (e.ctrlKey) // ignore when changing browser tabs
        return;

    e.preventDefault();

    var textarea = $(self);
    var text = textarea.val();
    var lines = text.split(/\n/g);

    var start = self.selectionStart;
    var end = self.selectionEnd;

    //  get line number of cursor
    var i = text.substr(0, start)
        .split(/\n/g).length - 1;

    //  get line number of selection end, if applicable
    var range = (text.substr(0, end)
        .split(/\n/g).length) - i;

    var diff = 0;
    for (var j = 0; j < range; j++) {
        var line = lines[i + j];

        if (e.shiftKey) {   //  unindent if shift is pressed
            if (line[0] == TAB_STRING) {
                diff = -1;
                lines[i + j] = line.substring(1);
            }
        } else {    //  otherwise indent
            diff = 1
            lines[i + j] = TAB_STRING + line;
        }
    }

    textarea.val(lines.join("\n"));

    if (range > 1) start = end;
    self.setSelectionRange(start + diff * range, end + diff * range);
}

function handleReturn(e, self) {

    var textarea = $(self);
    var text = textarea.val();
    var lines = text.split(/\n/g);

    var start = self.selectionStart;
    var end = self.selectionEnd;

    //  get line number of cursor
    var i = text.substr(0, start)
        .split(/\n/g).length - 1;

    //  get line number of selection end, if applicable
    var range = (text.substr(0, end)
        .split(/\n/g).length) - i;

    if (start == end) { //  no selection
        var line = lines[i];
        if (line.startsWith(TAB_STRING)) {
            e.preventDefault();
            if (text.length >= start || text[start + 1] == "\n") {
                var hashes = line.substr(0, line.lastIndexOf(TAB_STRING) + 1);

                if (hashes.length > 0 && line.length == hashes.length) {
                    lines[i] = hashes.substr(0, hashes.length - 1);
                } else {
                    lines.splice(i + 1, 0, hashes);
                }
            }
        }
    } else {    //  multi-char selection (maybe multiline!)
        //  TODO
    }

    textarea.val(lines.join("\n"));
}
