/**
 * Report Issue Screen - 5-Stage Flow Orchestrator
 * PRD Section 5.2 - Complete Reporting Flow
 *
 * State Machine:
 * Stage 1 (Camera) → Stage 2 (Details) → Stage 3 (Privacy)
 * → Stage 4 (Preview) → Stage 5 (Success)
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { TwitterPostingMethod, CategoryKey } from '../types';
import { generateAnonymousUsername } from '../lib/username';

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
      // TODO: Implement actual submission
      // 1. Upload photos to Firebase Storage
      // 2. Create Firestore document
      // 3. Post to Twitter (if privacy !== 'none')
      // 4. Queue for offline if network fails

      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate anonymous username for this post
      const anonymousUsername = session?.user
        ? generateAnonymousUsername()
        : 'Anonymous_Citizen_0000';

      // Simulate response
      const issueId = 'issue_' + Date.now();
      const tweetUrl =
        reportData.privacy !== 'none'
          ? 'https://twitter.com/CivicVigilance/status/123456789'
          : undefined;

      setReportData({
        ...reportData,
        issueId,
        tweetUrl,
      });

      setCurrentStage(5);
    } catch (error) {
      console.error('[Report] Submission error:', error);
      // TODO: Show error alert
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
    // TODO: Implement native share functionality
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
          privacy={reportData.privacy || 'civic_vigilance'}
          onSubmit={handleStage4Submit}
          onBack={() => handleBack(3)}
          onEditDetails={() => handleBack(2)}
          onEditPrivacy={() => handleBack(3)}
        />
      )}

      {currentStage === 5 && (
        <Stage5SuccessScreen
          issueId={reportData.issueId || ''}
          privacy={reportData.privacy || 'civic_vigilance'}
          tweetUrl={reportData.tweetUrl}
          onViewPost={handleViewPost}
          onShareMore={handleShareMore}
          onDone={handleDone}
        />
      )}
    </View>
  );
}
