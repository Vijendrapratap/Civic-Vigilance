/**
 * Report Issue Screen - 5-Stage Flow Orchestrator
 * PRD Section 5.2 - Complete Reporting Flow
 *
 * State Machine:
 * Stage 1 (Camera) → Stage 2 (Details) → Stage 3 (Privacy)
 * → Stage 4 (Preview) → Stage 5 (Success)
 */

import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { TwitterPostingMethod, CategoryKey } from '../types';
import { generateAnonymousUsername } from '../lib/username';
import { createIssue } from '../hooks/useIssues';
import { uploadPhotos } from '../lib/storage';
import { composePostText, shareToTwitter, showShareDialog } from '../lib/sharingEnhanced';
import { getAuthorityHandles } from '../lib/smartAuthorities';

// Import all 5 stage screens
import Stage1CameraScreen from './reporting/Stage1CameraScreen';
import Stage2DetailsScreen from './reporting/Stage2DetailsScreen';
import Stage3PrivacyScreen from './reporting/Stage3PrivacyScreen';
import Stage4PreviewScreen from './reporting/Stage4PreviewScreen';
import Stage5SuccessScreen from './reporting/Stage5SuccessScreen';

type Stage = 1 | 2 | 3 | 4 | 5;

interface ReportData {
  // Stage 1
  photos: string[];
  coords: { lat: number; lng: number };
  address: string;

  // Stage 2
  title?: string;
  category?: CategoryKey;
  description?: string;

  // Stage 3
  privacy?: TwitterPostingMethod;
  rememberChoice?: boolean;

  // Stage 4/5
  issueId?: string;
  tweetUrl?: string;
}

export default function ReportIssueScreenV2() {
  const navigation = useNavigation();
  const { session } = useAuth();

  const [currentStage, setCurrentStage] = useState<Stage>(1);
  const [reportData, setReportData] = useState<ReportData>({
    photos: [],
    coords: { lat: 0, lng: 0 },
    address: '',
  });

  // Stage 1: Camera -> Stage 2: Details
  const handleStage1Complete = (
    photos: string[],
    coords: { lat: number; lng: number },
    address: string
  ) => {
    setReportData({ ...reportData, photos, coords, address });
    setCurrentStage(2);
  };

  // Stage 2: Details -> Stage 3: Privacy
  const handleStage2Complete = (data: {
    title: string;
    category: CategoryKey;
    description: string;
    address: string;
    coords: { lat: number; lng: number };
  }) => {
    setReportData({ ...reportData, ...data });
    setCurrentStage(3);
  };

  // Stage 3: Privacy -> Stage 4: Preview
  const handleStage3Complete = (privacyChoice: {
    method: TwitterPostingMethod;
    rememberChoice: boolean;
  }) => {
    setReportData({
      ...reportData,
      privacy: privacyChoice.method,
      rememberChoice: privacyChoice.rememberChoice,
    });
    setCurrentStage(4);
  };

  // Stage 4: Preview -> Submit -> Stage 5: Success
  const handleStage4Submit = async () => {
    try {
      if (__DEV__) console.log('[Report] Starting submission...');

      // Validate required fields
      if (!reportData.title || !reportData.category) {
        throw new Error('Missing required fields: title or category');
      }

      // Step 1: Upload photos to Supabase Storage
      if (__DEV__) console.log('[Report] Uploading photos...');
      const photoUrls = await uploadPhotos(reportData.photos, 'issues');
      if (__DEV__) console.log('[Report] Photos uploaded:', photoUrls);

      // Step 2: Create issue in database
      if (__DEV__) console.log('[Report] Creating issue in database...');
      const issueData = await createIssue({
        title: reportData.title,
        description: reportData.description || '',
        category: reportData.category,
        image_url: photoUrls[0], // Database expects single URL, use first photo
        lat: reportData.coords.lat,
        lng: reportData.coords.lng,
        address: reportData.address,
      });

      if (__DEV__) console.log('[Report] Issue created:', issueData);

      // Step 3: Share to Twitter via deep link (if user chose Twitter sharing)
      let tweetUrl: string | undefined;
      if (reportData.privacy === 'twitter') {
        if (__DEV__) console.log('[Report] Opening Twitter for sharing...');
        const authorities = getAuthorityHandles(
          reportData.coords.lat,
          reportData.coords.lng,
          reportData.address,
          reportData.category!
        );
        const tweetText = composePostText({
          title: reportData.title!,
          description: reportData.description,
          address: reportData.address,
          lat: reportData.coords.lat,
          lng: reportData.coords.lng,
          authorities: authorities.length > 0 ? authorities : ['@mygovindia'],
          category: reportData.category,
        });
        await shareToTwitter({ text: tweetText });
      }

      // Generate anonymous username for this post
      const anonymousUsername = session?.user
        ? generateAnonymousUsername()
        : 'Anonymous_Citizen_0000';

      // Update report data with submission results
      setReportData({
        ...reportData,
        issueId: issueData.id,
        tweetUrl,
      });

      if (__DEV__) console.log('[Report] Submission successful!');
      setCurrentStage(5);
    } catch (error: any) {
      console.error('[Report] Submission error:', error);
      Alert.alert(
        'Submission Failed',
        error.message || 'Failed to submit your report. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Navigation handlers
  const handleBack = (targetStage: Stage) => {
    setCurrentStage(targetStage);
  };

  const handleViewPost = () => {
    // Navigate to issue detail screen
    // @ts-ignore
    navigation.navigate('Home', {
      screen: 'Feed',
      params: { issueId: reportData.issueId },
    });
  };

  const handleShareMore = () => {
    const tweetText = composePostText({
      title: reportData.title || '',
      description: reportData.description,
      address: reportData.address,
      lat: reportData.coords.lat,
      lng: reportData.coords.lng,
      category: reportData.category,
    });
    showShareDialog({ text: tweetText });
  };

  const handleDone = () => {
    // Reset and go back to feed
    setCurrentStage(1);
    setReportData({
      photos: [],
      coords: { lat: 0, lng: 0 },
      address: '',
    });
    // @ts-ignore
    navigation.navigate('Home');
  };

  // Render current stage
  return (
    <View style={{ flex: 1 }}>
      {currentStage === 1 && (
        <Stage1CameraScreen
          onContinue={handleStage1Complete}
          onCancel={() => navigation.goBack()}
        />
      )}

      {currentStage === 2 && (
        <Stage2DetailsScreen
          photos={reportData.photos}
          initialAddress={reportData.address}
          coords={reportData.coords}
          onContinue={handleStage2Complete}
          onBack={() => handleBack(1)}
        />
      )}

      {currentStage === 3 && (
        <Stage3PrivacyScreen
          onContinue={handleStage3Complete}
          onBack={() => handleBack(2)}
          defaultMethod={reportData.privacy}
        />
      )}

      {currentStage === 4 && (
        <Stage4PreviewScreen
          photos={reportData.photos}
          title={reportData.title || ''}
          description={reportData.description || ''}
          category={reportData.category || 'other'}
          address={reportData.address}
          coords={reportData.coords}
          privacy={reportData.privacy || 'twitter'}
          onSubmit={handleStage4Submit}
          onBack={() => handleBack(3)}
          onEditDetails={() => handleBack(2)}
          onEditPrivacy={() => handleBack(3)}
        />
      )}

      {currentStage === 5 && (
        <Stage5SuccessScreen
          issueId={reportData.issueId || ''}
          privacy={reportData.privacy || 'twitter'}
          tweetUrl={reportData.tweetUrl}
          onViewPost={handleViewPost}
          onShareMore={handleShareMore}
          onDone={handleDone}
        />
      )}
    </View>
  );
}
