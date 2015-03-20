<?php namespace Planner\Note;

use Illuminate\Support\Collection;

class CollatedNoteCollection extends Collection
{
	public function toJSON($fields = null) 
	{
		return json_encode($this->toMappedArray($fields));
	}

	public function toMappedArray($fields = null)
	{
		return array_map(function($value) use ($fields) {
			return $value->toMappedArray($fields);
		}, $this->items);
	}
}
