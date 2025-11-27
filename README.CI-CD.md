# CI/CD Setup for Civic Vigilance

This document explains the production-ready CI/CD setup for the Civic Vigilance app.

## 🏗️ Architecture Overview

### Environments
- **Development**: Local development with hot reload
- **Preview**: Internal testing builds
- **Production**: App Store / Play Store builds

### Tech Stack
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Build System**: EAS Build (Expo Application Services)
- **Testing**: Jest with React Native Testing Library
- **Backend**: Supabase (PostgreSQL + PostGIS)

## 🚀 Quick Start

### Local Development

```bash
# Using Docker Compose
docker-compose up app-dev

# Or locally
npm install
npm start
```

### Run Tests
```bash
# Using Docker
docker-compose --profile test up test

# Or locally
npm test
```

## 📦 Docker Setup

### Development Environment
```bash
docker-compose up app-dev
```
- Hot reload enabled
- Exposes ports: 8081, 19000-19002
- Volumes mounted for live code changes

### Production Build
```bash
docker-compose --profile production up app-prod
```

### Run Tests in Container
```bash
docker-compose --profile test up test
```

## 🔄 CI/CD Pipelines

### GitHub Actions Workflows

#### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
Runs on every push and pull request:
- ✅ Lint and type checking
- ✅ Run tests with coverage
- ✅ Security audit
- ✅ Docker build test

#### 2. **Build Android** (`.github/workflows/build-android.yml`)
- Builds Android APK/AAB
- Runs on main branch pushes and manual triggers
- Uploads artifacts

#### 3. **Build iOS** (`.github/workflows/build-ios.yml`)
- Builds iOS IPA
- Runs on macOS runner
- Uploads artifacts

#### 4. **Deploy** (`.github/workflows/deploy.yml`)
- Deploys EAS updates
- Submits to app stores (on version tags)
- Runs on production tags (v*.*.*)

## 🔐 Required Secrets

Add these to your GitHub repository secrets:

### Expo/EAS
```
EXPO_TOKEN=<your-expo-access-token>
```

### Supabase
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### iOS (for store submission)
```
APPLE_ID=your-apple-id@example.com
ASC_APP_ID=your-asc-app-id
APPLE_TEAM_ID=your-team-id
```

### Android (for store submission)
```
ANDROID_SERVICE_ACCOUNT_JSON=<base64-encoded-json>
```

## 🧪 Testing Strategy

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm test -- --testPathPattern=integration
```

### E2E Tests (TODO)
```bash
npm run test:e2e
```

### Coverage Reports
```bash
npm test -- --coverage
```

## 📱 Building Apps

### Development Build
```bash
# Android
eas build --platform android --profile development

# iOS
eas build --platform ios --profile development
```

### Preview Build (Internal Testing)
```bash
# Android APK
eas build --platform android --profile preview

# iOS (TestFlight)
eas build --platform ios --profile preview
```

### Production Build
```bash
# Android App Bundle
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

## 🚢 Deployment

### Manual Deployment
```bash
# Deploy to specific environment
./scripts/deploy.sh [development|preview|production]
```

### Automated Deployment
1. **Development**: Automatic on push to `develop` branch
2. **Preview**: Automatic on push to `main`/`master` branch
3. **Production**: Automatic on version tags (`v1.0.0`)

### EAS Updates (Over-the-Air)
```bash
# Update development
eas update --branch development

# Update production
eas update --branch production
```

## 🔍 Quality Checks

### Pre-commit Hooks
Automatically runs before each commit:
- Type checking
- Related tests
- Linting (if configured)

### Pre-push Hooks
Runs before push:
- Full test suite with coverage
- Type checking

### Setting Up Husky
```bash
npm install husky --save-dev
npx husky install
```

## 🐛 Debugging CI/CD Issues

### Check Workflow Logs
1. Go to GitHub Actions tab
2. Click on the failed workflow
3. Check individual job logs

### Local Testing
```bash
# Test CI setup locally
./scripts/setup-ci.sh

# Test Docker build
docker build -t civicvigilance:test .

# Test Docker Compose
docker-compose config
```

### Common Issues

#### Build Failures
- Check EXPO_TOKEN is valid
- Verify environment variables are set
- Ensure dependencies are up to date

#### Test Failures
- Run tests locally first
- Check for environment-specific issues
- Verify test data/mocks are correct

#### Docker Issues
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`

## 📊 Monitoring & Analytics

### Build Status
Monitor builds at:
- GitHub Actions: https://github.com/your-repo/actions
- EAS Dashboard: https://expo.dev/accounts/your-account/projects

### Performance Metrics
- App size tracking in EAS
- Bundle analysis
- Test coverage reports

## 🔄 Versioning

### Semantic Versioning
We follow semver (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Creating a Release
```bash
# Update version in app.json
npm version [major|minor|patch]

# Create and push tag
git push origin --tags

# This triggers production deployment
```

## 📝 Best Practices

1. **Always run tests locally** before pushing
2. **Use feature branches** for development
3. **Create PR** for code review before merging to main
4. **Tag releases** with semantic version numbers
5. **Monitor CI/CD** pipelines for failures
6. **Keep dependencies** up to date
7. **Document changes** in commit messages
8. **Test in preview** environment before production

## 🆘 Support

- GitHub Issues: Report bugs and request features
- EAS Documentation: https://docs.expo.dev/build/introduction/
- Supabase Docs: https://supabase.com/docs

## 📚 Additional Resources

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Supabase](https://supabase.com/docs)
