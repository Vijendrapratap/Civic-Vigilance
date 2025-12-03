# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage for uploading photos from the CivicVigilance app.

## Overview

The app uses Supabase Storage to store:
- Issue report photos
- User profile avatars
- Other media files

## Storage Configuration

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (`endrnbacxyjpxvgxhpjj`)
3. Navigate to **Storage** in the left sidebar
4. Click **"Create Bucket"**
5. Enter the following details:
   - **Name**: `civic-vigilance`
   - **Public bucket**: ✅ **Enabled** (so photos can be viewed publicly)
   - **File size limit**: 50 MB (recommended)
   - **Allowed MIME types**: `image/*` (images only)
6. Click **"Create bucket"**

### 2. Configure Storage Policies

After creating the bucket, set up Row Level Security (RLS) policies:

#### Policy 1: Allow Public Read Access

```sql
-- Allow anyone to view photos
CREATE POLICY "Public Access for Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'civic-vigilance');
```

#### Policy 2: Allow Authenticated Users to Upload

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'civic-vigilance'
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Allow Users to Delete Their Own Files

```sql
-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'civic-vigilance'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Apply Policies via Dashboard

1. In the **Storage** section, click on your bucket (`civic-vigilance`)
2. Go to the **"Policies"** tab
3. Click **"New Policy"**
4. For each policy above:
   - Select the appropriate operation (SELECT, INSERT, DELETE)
   - Copy and paste the policy SQL
   - Click **"Review"** and then **"Save policy"**

### 4. Verify Storage Setup

Test your storage configuration:

```typescript
// Test upload
import { supabase } from './lib/supabase';

const testFile = new Blob(['Hello'], { type: 'text/plain' });

const { data, error } = await supabase.storage
  .from('civic-vigilance')
  .upload('test/hello.txt', testFile);

if (error) {
  console.error('Upload failed:', error);
} else {
  console.log('Upload success:', data);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('civic-vigilance')
    .getPublicUrl('test/hello.txt');

  console.log('Public URL:', publicUrl);
}
```

## Folder Structure

The app organizes files in the following structure:

```
civic-vigilance/
├── issues/
│   ├── <timestamp>_<random>.jpg
│   ├── <timestamp>_<random>.jpg
│   └── ...
├── profiles/
│   ├── <timestamp>_<random>.jpg
│   └── ...
└── test/
    └── (test files)
```

## Storage Usage in the App

### Uploading Photos

The app uses `lib/storage.ts` for all storage operations:

```typescript
import { uploadPhotos } from '../lib/storage';

// Upload multiple photos
const photoUrls = await uploadPhotos([uri1, uri2, uri3], 'issues');
```

### Viewing Photos

Photos are publicly accessible via their URLs:

```typescript
// Photo URLs returned from uploadPhotos() can be used directly
<Image source={{ uri: photoUrl }} />
```

### Deleting Photos

```typescript
import { deletePhoto } from '../lib/storage';

await deletePhoto(photoUrl);
```

## Troubleshooting

### Error: "new row violates row-level security policy"

**Solution**: Make sure you've created the storage policies (see step 2 above).

### Error: "Bucket not found"

**Solution**: Check that the bucket name is exactly `civic-vigilance` (lowercase, with hyphen).

### Photos not uploading

1. Check that you're authenticated (logged in)
2. Verify the bucket is public
3. Check the console logs for detailed error messages
4. Ensure the Supabase URL and keys are correct in `.env`

### Storage quota exceeded

Supabase free tier includes:
- **1 GB storage**
- **2 GB bandwidth/month**

To check usage:
1. Go to **Settings** → **Usage** in Supabase Dashboard
2. Monitor storage and bandwidth usage

If you exceed limits, consider:
- Upgrading to Pro plan ($25/month)
- Compressing images before upload
- Implementing image optimization

## Security Considerations

### File Size Limits

The storage service limits uploads to reasonable sizes to prevent abuse:

```typescript
// In lib/storage.ts
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

if (blob.size > MAX_FILE_SIZE) {
  throw new Error('File too large. Maximum size is 10 MB.');
}
```

### File Type Validation

Only allow image uploads:

```typescript
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

if (!allowedTypes.includes(blob.type)) {
  throw new Error('Invalid file type. Only images are allowed.');
}
```

### Rate Limiting

Supabase automatically rate-limits API requests to prevent abuse.

## Next Steps

After setting up storage:

1. ✅ Create the `civic-vigilance` bucket
2. ✅ Configure the 3 RLS policies
3. ✅ Test upload/download in the app
4. ✅ Monitor storage usage in the dashboard
5. Consider setting up automatic image optimization

## Related Documentation

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Image Optimization Guide](https://supabase.com/docs/guides/storage/serving/image-transformations)
