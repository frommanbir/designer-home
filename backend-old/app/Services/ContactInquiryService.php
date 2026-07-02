<?php

namespace App\Services;

use App\Models\ContactInquiry;
use Illuminate\Database\Eloquent\Collection;

class ContactInquiryService
{
    public function createInquiry(array $validated): ContactInquiry
    {
        $validated['status'] = 'new';

        return ContactInquiry::query()->create($validated);
    }

    public function listInquiries(): Collection
    {
        return ContactInquiry::query()
            ->latest()
            ->get();
    }

    public function showInquiry(ContactInquiry $contactInquiry): ContactInquiry
    {
        return $contactInquiry;
    }

    public function updateStatus(ContactInquiry $contactInquiry, string $status): ContactInquiry
    {
        $contactInquiry->update([
            'status' => $status,
        ]);
        $contactInquiry->refresh();

        return $contactInquiry;
    }

    public function deleteInquiry(ContactInquiry $contactInquiry): void
    {
        $contactInquiry->delete();
    }
}
