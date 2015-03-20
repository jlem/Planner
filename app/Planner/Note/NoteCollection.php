<?php namespace Planner\Note;

use Illuminate\Support\Collection;

class NoteCollection extends Collection
{
    /**
     * Takes the flat collectoin of notes, and "recursively" builds a hierarchy of CollatedNotesCollections as it iterates through the collection
     *
     * @access public
     * @return CollatedNoteCollection
    */

    public function collate()
    {
        $collatedNotes = new CollatedNoteCollection;
        foreach ($this->all() as $note) {

            // Instance of the current iteration's Note assigned as a variable 
            // which will be called on the following iteration as $$previousNoteLevel
            $nextNoteLevel = 'noteLevel'.$note->level;
            $$nextNoteLevel = $note;

            // If the current iteration's Note is a root Note (e.g. hash level 1), 
            // then add it to the array, and immediately start the next loop
            if ($note->isRoot()) {
                $collatedNotes->push($note);
                continue;
            }

            // Recurssively add the current iteration's Note 
            // as a child of the previous iteration's Note
            $previousNoteLevel = 'noteLevel'.($note->level - 1);
            $$previousNoteLevel->addChild($note);
        }

        return $collatedNotes;
    }
}