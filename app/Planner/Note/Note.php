<?php namespace Planner\Note;

use Illuminate\Support\Contracts\ArrayableInterface;

class Note implements ArrayableInterface
{
    public $text;
    public $hash;
    public $level;
    public $children;
    public $projectID;

    public function __construct($text, $hash, $projectID)
    {
        $this->text = trim($text);
        $this->hash = $hash;
        $this->projectID = $projectID;
        $this->level = strlen($hash);
        $this->children = new CollatedNoteCollection;
    }

    /**
     * Adds a note to the collection of children
     *
     * @param Note $note
     * @access public
     * @return void
    */

    public function addChild(Note $note)
    {
        $this->children->push($note);
    }

    /**
     * Determines if the note is a root level note, based on how many hashes it has
     *
     * @access public
     * @return bool
    */

    public function isRoot()
    {
        return ($this->level === 1);
    }

    /**
     * Creates a more useful array of information about the note when json encoded
     *
     * @access public
     * @return array
    */

    public function toMappedArray($fields = null)
    {
        // Could just cast $this to (array), but then the order of elements looks sloppy in json dumps
        // We roll that anal-y 'round here
        $full = [
            'text'          => $this->text,
            'hash'          => $this->hash,
            'level'         => $this->level,
            'isRoot'        => $this->isRoot(),
            'project_id'    => $this->projectID,
            'hasChildren'   => !$this->children->isEmpty(),
            'children'      => $this->children->toMappedArray($fields)
        ];

        return $fields ? array_intersect_key($full, array_flip($fields)) : $full;
    }

    public function toArray()
    {
        $this->toMappedArray();
    }
}