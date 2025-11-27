# Production Deployment Guide - Civic Vigilance

## 🚀 Pre-Production Checklist

### 1. Environment Setup
- [ ] Supabase project configured and production-ready
- [ ] Environment variables set in GitHub Secrets
- [ ] EAS account created and configured
- [ ] Apple Developer account (for iOS)
- [ ] Google Play Console account (for Android)

### 2. App Store Preparation

#### iOS App Store
- [ ] App Store Connect app created
- [ ] Screenshots prepared (all required sizes)
- [ ] App icons (1024x1024)
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] App description and keywords
- [ ] Age rating completed

#### Google Play Store
- [ ] Google Play Console app created
- [ ] Screenshots prepared (all required sizes)
- [ ] Feature graphic (1024x500)
- [ ] App icons
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Content rating completed

### 3. Security & Compliance
- [ ] Privacy policy finalized
- [ ] Terms of service finalized
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policies
- [ ] User data deletion process
- [ ] Security audit completed

## 📋 First-Time Setup

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Project
```bash
eas build:configure
```

### 4. Set up GitHub Secrets

Go to GitHub repo → Settings → Secrets and variables → Actions

Add the following secrets:

```
# Expo
EXPO_TOKEN=<your-expo-token>

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>

# iOS (for automatic submission)
APPLE_ID=your-apple-id@example.com
ASC_APP_ID=<app-store-connect-app-id>
APPLE_TEAM_ID=<your-team-id>

# Android (for automatic submission)
# Create service account in Google Play Console
# Download JSON key and base64 encode it
ANDROID_SERVICE_ACCOUNT_JSON=<base64-encoded-json>
```

## 🏗️ Building for Production

### Manual Builds

#### Android
```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

#### iOS
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production
```

### Automated Builds (CI/CD)

#### Trigger via Git Tag
```bash
# Create a version tag
git tag v1.0.0
git push origin v1.0.0

# This automatically triggers:
# 1. EAS Update deployment
# 2. Android & iOS builds
# 3. Automatic store submission
```

#### Trigger Manually
1. Go to GitHub → Actions
2. Select "Build Android" or "Build iOS"
3. Click "Run workflow"
4. Select build profile (development/preview/production)

## 📱 Deployment Strategies

### 1. EAS Updates (Recommended for Minor Changes)

**Pros:**
- Instant updates without app store review
- No need to resubmit to stores
- Great for bug fixes and minor updates

**Limitations:**
- Cannot update native code
- Cannot change app permissions
- Cannot update app.json configuration

**Deploy:**
```bash
# Development
eas update --branch development

# Production
eas update --branch production
```

### 2. Full App Store Release (For Major Updates)

**When to use:**
- Native code changes
- New permissions required
- Major version updates
- First release

**Steps:**
1. Update version in `app.json`
2. Create git tag: `git tag v1.0.0`
3. Push tag: `git push origin v1.0.0`
4. CI/CD automatically builds and submits

## 🔄 Release Process

### Development → Preview → Production

#### 1. Development (Internal Testing)
```bash
# Deploy to development branch
git push origin develop

# Build development version
eas build --platform all --profile development
```

#### 2. Preview (Beta Testing)
```bash
# Merge to main
git checkout main
git merge develop

# Deploy preview
eas build --platform all --profile preview

# Distribute via:
# - Android: Internal testing track
# - iOS: TestFlight
```

#### 3. Production (Public Release)
```bash
# Create version tag
npm version [major|minor|patch]
git push origin --tags

# Automatic:
# - Builds production version
# - Submits to stores
# - Deploys EAS update
```

## 📊 Monitoring & Analytics

### EAS Dashboard
- Build status and history
- Update deployments
- Crash reports
- Performance metrics

Access at: https://expo.dev/accounts/[your-account]/projects/civicvigilance

### Supabase Dashboard
- Database metrics
- API usage
- Auth statistics
- Storage usage

Access at: https://supabase.com/dashboard/project/[your-project-id]

## 🐛 Troubleshooting

### Build Fails

**Check:**
1. GitHub secrets are correctly set
2. EXPO_TOKEN is valid
3. Dependencies are up to date
4. No TypeScript errors
5. Tests pass locally

**Debug:**
```bash
# Run build locally
eas build --platform android --local

# Check logs
eas build:list
eas build:view [build-id]
```

### Submission Fails

**iOS:**
- Verify Apple ID credentials
- Check provisioning profiles
- Ensure app version is incremented
- Validate App Store Connect setup

**Android:**
- Verify service account permissions
- Check package name matches
- Ensure version code is incremented
- Validate Play Console setup

### EAS Update Not Working

**Check:**
1. Update branch matches app configuration
2. No native code changes
3. App version supports updates
4. Update published successfully

```bash
# Check update status
eas update:list --branch production

# View update details
eas update:view [update-id]
```

## 🔐 Security Best Practices

### Environment Variables
- Never commit `.env` files with real credentials
- Use GitHub Secrets for CI/CD
- Rotate secrets regularly
- Use different credentials for dev/prod

### API Keys
- Restrict API keys by domain/bundle ID
- Use environment-specific keys
- Monitor API usage
- Set up rate limiting

### App Security
- Enable SSL pinning
- Implement certificate validation
- Use secure storage for sensitive data
- Implement proper authentication

## 📈 Performance Optimization

### Bundle Size
```bash
# Analyze bundle
npx expo-cli export --public-url http://127.0.0.1:8000

# Check asset sizes
ls -lh dist/assets/
```

### Database Optimization
- Use proper indexes
- Enable Row Level Security (RLS)
- Optimize queries
- Monitor query performance

### Image Optimization
- Use appropriate formats (WebP)
- Implement lazy loading
- Use CDN for images
- Compress images before upload

## 📞 Support & Resources

### Documentation
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native](https://reactnative.dev/docs/getting-started)

### Community
- [Expo Discord](https://chat.expo.dev/)
- [Supabase Discord](https://discord.supabase.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

### Emergency Contacts
- Critical bugs: Create GitHub issue with `critical` label
- Security issues: security@your-domain.com
- Support: support@your-domain.com

## 🎯 Success Metrics

### Key Performance Indicators (KPIs)
- App store ratings (target: 4.5+)
- Crash-free rate (target: 99.9%)
- Daily active users (DAU)
- User retention (Day 1, 7, 30)
- Average session duration
- API response time (<200ms)

### Monitoring Dashboard
Set up monitoring for:
- Error tracking (Sentry)
- Analytics (Firebase/Mixpanel)
- Performance (EAS metrics)
- User feedback (App store reviews)

## 🔄 Rollback Procedures

### EAS Update Rollback
```bash
# List recent updates
eas update:list --branch production

# Rollback to previous version
eas update:republish --update-id [previous-update-id]
```

### App Store Rollback
- iOS: Use phased release to pause/rollback
- Android: Deactivate release in Play Console

## ✅ Launch Day Checklist

### T-7 Days
- [ ] All features tested and approved
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] App store assets prepared

### T-3 Days
- [ ] Beta testing completed
- [ ] Critical bugs fixed
- [ ] Monitoring systems tested
- [ ] Support team briefed

### T-1 Day
- [ ] Production builds created
- [ ] Store listings finalized
- [ ] Marketing materials ready
- [ ] Emergency rollback plan tested

### Launch Day
- [ ] Submit to stores
- [ ] Monitor error rates
- [ ] Watch user feedback
- [ ] Be ready for hotfixes

### T+1 Day
- [ ] Review analytics
- [ ] Address critical issues
- [ ] Collect user feedback
- [ ] Plan next iteration

---

**Remember:** Always test thoroughly in preview/staging before deploying to production!
