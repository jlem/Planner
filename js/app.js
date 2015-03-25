const TAB_CHAR = ' ';

$(function() {
    $('textarea').focus();

    $(document).delegate('textarea','keydown', function(e) {
        var textarea = $(this);
        var text = textarea.val();
        var lines = text.split(/\n/g);

        var selection = null;
        if (e.which == 9) { // tab
            selection = handleIndent(e, this, lines);
        } else if (e.which == 13) { // return
            selection = handleReturn(e, this, lines);
        }

        textarea.val(lines.join("\n"));
        if (selection)
            this.setSelectionRange(selection.start, selection.end);
    });

    $(document).on('keyup', 'textarea', function() {
        $.post('index.php/parse', 'notes=' + encodeURIComponent(getEditorData("#")), function(data) {
            notes = JSON.parse(data);
            var notesContainer = $('#preview');
            var string = buildNotes(notes, 1);
            notesContainer.html(string);
        });
    });
});

function buildNotes(notes, level, builder) {
    builder = builder || [];
    builder.push('<ul class="notes note-level-', level, '">');

    notes.forEach(function(note) {
        builder.push(buildNote(note));
        if (note.hasChildren) {
            buildNotes(note.children, note.level + 1, builder)
        }
    });

    builder.push('</ul>');
    if (level == 1)
        return builder.join("");
}

function buildNote(note) {
    return '<li>'+note.text+'</li>';
}

function handleIndent(e, self, lines) {
    if (e.ctrlKey) // ignore when changing browser tabs
        return;

    e.preventDefault();
    var c = getCursorInfo(self);
    var start = c.start;
    var end = c.end;
    var i = c.startLine;
    var range = c.lineRange;

    var indent = 0, failed = 0;
    for (var j = 0; j < range; j++) {
        var lineAt = i + j;
        var line = lines[lineAt];

        if (e.shiftKey) {   //  unindent if shift is pressed
            if (line[0] == TAB_CHAR) {
                lines[i + j] = line.substring(1);
                indent--;
            } else {
                failed++;
            }
        } else {    //  otherwise indent
            indent++;
            lines[i + j] = TAB_CHAR + line;
        }
    }

    if (range > 0 && failed == range) return null;

    if (c.startLineIndex == 0) {
        start++;
        end++;
    }

    if (start != end) indent = Math.sign(indent);
    return { start : start + Math.sign(indent), end : end + indent * range + failed};
}

function handleReturn(e, self, lines) {
    var textarea = $(self);
    var text = textarea.val();

    var c = getCursorInfo(self);
    var start = c.start;
    var end = c.end;
    var i = c.startLine;
    var range = c.lineRange;

    var diff = 0;
    if (start == end) { //  no selection
        var line = lines[i];
        if (line.startsWith(TAB_CHAR)) {
            e.preventDefault();
            if (text.length >= start || text[start + 1] == "\n") {
                var hashes = line.substr(0, getIndentCount(line));

                if (hashes.length > 0 && line.length == hashes.length) {
                    lines[i] = hashes.substr(0, hashes.length - 1);
                } else {
                    lines.splice(i + 1, 0, hashes);
                }

                diff = hashes.length + 1;
            }
        }
    }
    if (range > 1) start = end;
    return { start : start + diff, end : end + diff };
}

function getEditorData(indentChar) {
    var lines = $("textarea")
        .val()
        .split(/\n/g);

    editorData.length = 0;

    for (var i = 0; i < lines.length; i++) {
        var index = getIndentCount(lines[i]);
        var line = lines[i].substring(index);

        editorData[i] = {
            data : line,
            indent : index
        };
    }

    var join = [];
    for (var i = 0; i < editorData.length; i++) {
        var data = editorData[i];
        if (data.data == null || data.data.length == 0)
            continue;

        for (var r = 0; r < data.indent + 1; r++)
            join.push(indentChar);

        join.push(data.data);
        if (i < editorData.length - 1)
            join.push("\n");
    }

    return join.join("");
}

function getCursorInfo(textarea) {
    var r = {
        start : textarea.selectionStart,
        end : textarea.selectionEnd,
        startLine : null,
        endLine : null,
        startLineIndex : null,
        endLineIndex : null
    }

    var text = $(textarea).val();
    var startSub = text.substr(0, r.start);
    var endSub = text.substr(0, r.end);
    var startSplit = startSub.split(/\n/g);
    var endSplit = endSub.split(/\n/g);

    r.startLine = startSplit.length - 1;
    r.lineRange = endSplit.length - r.startLine;

    r.startLineIndex = r.start;
    r.endLineIndex = r.end;

    for (var i = 0; i < r.startLine; i++) {
        r.startLineIndex -= startSplit[i].length + 1;
    }

    for (var j = 0; j < r.endLine; j++) {
        r.endLineIndex -= endSplit[j].length + 1;
    }

    return r;
}

function getIndentCount(line) {
    var i = 0;
    for (i = 0; i < line.length; i++) {
        if (line[i] != TAB_CHAR) return i;
    }

    return i;
}

var editorData = [];
