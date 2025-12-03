/**
 * Storage Service - Supabase Storage for Photo Uploads
 *
 * Handles uploading photos to Supabase Storage bucket
 * for issue reports and user profiles.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { getBackend } from './backend';

/**
 * Upload a photo to Supabase Storage
 *
 * @param uri - Local file URI from the camera or gallery
 * @param folder - Storage folder (e.g., 'issues', 'profiles')
 * @returns Public URL of the uploaded photo
 */
export async function uploadPhoto(uri: string, folder: string = 'issues'): Promise<string> {
  if (getBackend() !== 'supabase' || !isSupabaseConfigured) {
    // For SQLite backend, just return the local URI
    console.log('[Storage] Using local URI for SQLite backend');
    return uri;
  }

  try {
    // Convert local URI to blob for upload
    const response = await fetch(uri);
    const blob = await response.blob();

    // Generate unique filename
    const fileExt = uri.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('civic-vigilance')
      .upload(filePath, blob, {
        contentType: `image/${fileExt}`,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('[Storage] Upload error:', error);
      throw new Error(`Failed to upload photo: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('civic-vigilance')
      .getPublicUrl(filePath);

    console.log('[Storage] Photo uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error('[Storage] Upload failed:', error);
    // Fallback to local URI if upload fails
    return uri;
  }
}

/**
 * Upload multiple photos and return their URLs
 *
 * @param uris - Array of local file URIs
 * @param folder - Storage folder
 * @returns Array of public URLs
 */
export async function uploadPhotos(uris: string[], folder: string = 'issues'): Promise<string[]> {
  console.log(`[Storage] Uploading ${uris.length} photos...`);

  const uploadPromises = uris.map(uri => uploadPhoto(uri, folder));
  const urls = await Promise.all(uploadPromises);

  console.log(`[Storage] Successfully uploaded ${urls.length} photos`);
  return urls;
}

/**
 * Delete a photo from Supabase Storage
 *
 * @param url - Public URL of the photo to delete
 */
export async function deletePhoto(url: string): Promise<void> {
  if (getBackend() !== 'supabase' || !isSupabaseConfigured) {
    return;
  }

  try {
    // Extract file path from URL
    const urlParts = url.split('/civic-vigilance/');
    if (urlParts.length < 2) {
      console.warn('[Storage] Invalid URL format:', url);
      return;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('civic-vigilance')
      .remove([filePath]);

    if (error) {
      console.error('[Storage] Delete error:', error);
    } else {
      console.log('[Storage] Photo deleted successfully:', filePath);
    }
  } catch (error) {
    console.error('[Storage] Delete failed:', error);
  }
}
