<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileRequest;
use App\Http\Resources\ProfileResourse;
use App\Http\Traits\ApiResponse;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    use ApiResponse;
    public function show()
    {
        return ProfileResourse::make(auth()->user()->profile);
    }

    public function update(ProfileRequest $profileRequest)
    {
        $validatedData = $profileRequest->validated();

        if ($profileRequest->hasFile('avatar')) {
            $avatarFileName = $profileRequest->file('avatar')->getClientOriginalName();
            Storage::disk('public')->put('avatars/' . $avatarFileName, file_get_contents($profileRequest->file('avatar')));

            try {
                auth()->user()->profile->avatar &&
                unlink(public_path('storage/avatars/' . auth()->user()->profile->avatar));
            } catch (\Throwable $th) {
                Log::error($th->getMessage());
            }

            $validatedData['avatar'] = $avatarFileName;
        }

        auth()->user()->profile()->updateOrCreate(
            ['user_id' => auth()->user()->id],
            array_filter($validatedData)
        );

        return ProfileResourse::make(Profile::where('user_id',auth()->id())->first())->additional([
            'message' => 'Profile updated successfully'
        ]);
    }
}
