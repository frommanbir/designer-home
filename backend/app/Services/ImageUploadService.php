<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use RuntimeException;
use Throwable;

class ImageUploadService
{
    private const DISK = 'public';

    private const PROFILES = [
        'hero' => ['max_width' => 1600, 'quality' => 80],
        'large' => ['max_width' => 1600, 'quality' => 80],
        'gallery' => ['max_width' => 1200, 'quality' => 80],
        'card' => ['max_width' => 1200, 'quality' => 80],
        'blog' => ['max_width' => 1200, 'quality' => 80],
        'project' => ['max_width' => 1200, 'quality' => 80],
        'portfolio' => ['max_width' => 1200, 'quality' => 80],
        'logo' => ['max_width' => 512, 'quality' => 85],
        'icon' => ['max_width' => 256, 'quality' => 80],
    ];

    private ?ImageManager $manager = null;

    public function store(UploadedFile $file, string $folder, string $profile = 'card'): string
    {
        $extension = $this->extension($file);
        $path = $this->path($folder, $extension);

        if ($this->shouldStoreOriginal($file, $extension)) {
            return $this->storeOriginal($file, $folder, basename($path));
        }

        if (! $this->isOptimizableRaster($extension)) {
            throw new RuntimeException("Unsupported image type for optimization: {$extension}.");
        }

        return $this->storeOptimizedRaster($file, $path, $extension, $profile);
    }

    /**
     * @param array<UploadedFile|null> $files
     * @return array<int, string>
     */
    public function storeMany(array $files, string $folder, string $profile = 'gallery'): array
    {
        $paths = [];

        try {
            foreach ($files as $file) {
                if ($file instanceof UploadedFile) {
                    $paths[] = $this->store($file, $folder, $profile);
                }
            }
        } catch (Throwable $exception) {
            $this->deleteMany($paths);

            throw $exception;
        }

        return $paths;
    }

    public function replace(?string $oldPath, UploadedFile $file, string $folder, string $profile = 'card'): string
    {
        $newPath = $this->store($file, $folder, $profile);
        $this->delete($oldPath);

        return $newPath;
    }

    /**
     * @param iterable<string|null> $oldPaths
     * @param array<UploadedFile|null> $files
     * @return array<int, string>
     */
    public function replaceMany(iterable $oldPaths, array $files, string $folder, string $profile = 'gallery'): array
    {
        $newPaths = $this->storeMany($files, $folder, $profile);
        $this->deleteMany($oldPaths);

        return $newPaths;
    }

    public function delete(?string $path): void
    {
        if ($path) {
            Storage::disk(self::DISK)->delete($path);
        }
    }

    /**
     * @param iterable<string|null> $paths
     */
    public function deleteMany(iterable $paths): void
    {
        foreach ($paths as $path) {
            $this->delete($path);
        }
    }

    private function storeOptimizedRaster(UploadedFile $file, string $path, string $extension, string $profile): string
    {
        $settings = $this->settings($profile);

        try {
            $image = $this->manager()
                ->read($file->getRealPath())
                ->orient()
                ->scaleDown(width: $settings['max_width']);

            $encoded = match ($extension) {
                'jpg', 'jpeg' => $image->toJpeg(
                    quality: $settings['quality'],
                    progressive: true,
                    strip: true,
                ),
                'webp' => $image->toWebp(
                    quality: $settings['quality'],
                    strip: true,
                ),
                'png' => $image->toPng(interlaced: true),
            };

            if (! Storage::disk(self::DISK)->put($path, (string) $encoded)) {
                throw new RuntimeException("Unable to write optimized image to {$path}.");
            }
        } catch (Throwable $exception) {
            throw new RuntimeException(
                "Image optimization failed for {$file->getClientOriginalName()}: {$exception->getMessage()}",
                previous: $exception,
            );
        }

        return $path;
    }

    private function storeOriginal(UploadedFile $file, string $folder, string $filename): string
    {
        $path = $file->storeAs($this->folder($folder), $filename, self::DISK);

        if (! $path) {
            throw new RuntimeException("Unable to store image {$file->getClientOriginalName()}.");
        }

        return $path;
    }

    private function manager(): ImageManager
    {
        if ($this->manager) {
            return $this->manager;
        }

        if (extension_loaded('imagick')) {
            return $this->manager = ImageManager::imagick(strip: true);
        }

        if (extension_loaded('gd')) {
            return $this->manager = ImageManager::gd(strip: true);
        }

        throw new RuntimeException(
            'Cannot optimize raster image uploads because neither the GD nor Imagick PHP extension is installed.',
        );
    }

    private function path(string $folder, string $extension): string
    {
        return $this->folder($folder) . '/' . Str::uuid() . '.' . $extension;
    }

    private function folder(string $folder): string
    {
        return trim($folder, '/');
    }

    private function extension(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: '');
        $mimeType = strtolower((string) $file->getMimeType());

        if ($mimeType === 'image/jpeg' && ! in_array($extension, ['jpg', 'jpeg'], true)) {
            return 'jpg';
        }

        if ($mimeType === 'image/png') {
            return 'png';
        }

        if ($mimeType === 'image/webp') {
            return 'webp';
        }

        if ($mimeType === 'image/svg+xml') {
            return 'svg';
        }

        if (in_array($mimeType, ['image/x-icon', 'image/vnd.microsoft.icon'], true)) {
            return 'ico';
        }

        if ($extension === '') {
            throw new RuntimeException("Unable to determine image extension for {$file->getClientOriginalName()}.");
        }

        return $extension;
    }

    private function shouldStoreOriginal(UploadedFile $file, string $extension): bool
    {
        $mimeType = strtolower((string) $file->getMimeType());

        return in_array($extension, ['svg', 'ico'], true)
            || in_array($mimeType, ['image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'], true);
    }

    private function isOptimizableRaster(string $extension): bool
    {
        return in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true);
    }

    /**
     * @return array{max_width: int, quality: int}
     */
    private function settings(string $profile): array
    {
        return self::PROFILES[$profile] ?? self::PROFILES['card'];
    }
}
