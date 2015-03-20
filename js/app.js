$(document).ready(function() {
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
    var string = '<ol class="notes note-level-'+level+'">';

    notes.forEach(function(note) {
        string = string + buildNote(note);
        if (note.hasChildren) {
            string = string + buildNotes(note.children, note.level + 1)
        }
    });

    string = string + '</ol>'; 
    return string;
}

function buildNote(note) {
    return '<li>'+note.text+'</li>'; 
}
