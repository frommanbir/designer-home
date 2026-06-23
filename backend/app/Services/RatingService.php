<?php

namespace App\Services;

use App\Models\Rating;
use Illuminate\Database\Eloquent\Collection;

class RatingService
{
    public function listActiveRatings(): Collection
    {
        return $this->orderedQuery()
            ->active()
            ->get();
    }

    public function listRatings(): Collection
    {
        return $this->orderedQuery()->get();
    }

    public function createRating(array $validated): Rating
    {
        return Rating::query()->create($validated);
    }

    public function updateRating(Rating $rating, array $validated): Rating
    {
        $rating->update($validated);
        $rating->refresh();

        return $rating;
    }

    public function deleteRating(Rating $rating): void
    {
        $rating->delete();
    }

    private function orderedQuery()
    {
        return Rating::query()
            ->orderBy('sort_order')
            ->latest();
    }
}
