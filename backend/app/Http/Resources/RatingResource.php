<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RatingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'review_date' => $this->review_date?->toDateString(),
            'rating' => $this->rating,
            'review_text' => $this->review_text,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}
