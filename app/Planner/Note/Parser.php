<?php namespace Planner\Note;

class Parser
{
    public $notes;
    protected $regex = '/(#+) ?([^#]+)/';

    /**
     * Takes an input string and converts it to a CollatedNotesCollection
     *
     * @param string $notes
     * @access public
     * @return CollatedNotesCollection
    */

    public function takeNotes($notes, $projectID)
    {
        $matches = $this->parseNotes($notes);
        $notes = $this->collectNotes($matches, $projectID);
        return $this->notes = $notes->collate();
    }

    /**
     * Parses out the notes string via the defined regex into an array of capture groups
     *
     * @param string $notes
     * @access protected
     * @return array
    */

    protected function parseNotes($notes)
    {
        if (!preg_match_all($this->regex, $notes, $matches)) {
            return;
        }

        return $matches;
    }

    /**
     * Iterates over the regex matches and converts each item into a note, adding it to a collection
     *
     * @param array $matches
     * @access protected
     * @return NoteCollection
    */

    protected function collectNotes($matches, $projectID)
    {
        $notes = array_map(function($text, $hash) use ($projectID) {
            return new Note($text, $hash, $projectID);
        }, $matches[2], $matches[1]);

        return new NoteCollection($notes);
    }
}
