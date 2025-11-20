Firebase Setup

Auth
- Enable Email/Password in Firebase Console → Authentication → Sign-in method.

Firestore
- Create a Firestore database in production or test mode.
- Recommended composite indexes:

  1) issues by user and created_at desc
     - Collection: issues
     - Fields: user_id ASC, created_at DESC

  2) comments by issue and created_at asc
     - Collection: comments
     - Fields: issue_id ASC, created_at ASC

Storage
- Default bucket is used from the Firebase config. Avatars are uploaded to avatars/{uid}.jpg.
- Ensure storage rules allow authenticated users to write to their own folder (starter rule):

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{uid}.jpg {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
  }
}

Rules (Firestore)

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function authed() { return request.auth != null; }
    match /issues/{id} {
      allow read: if true;
      allow create: if authed();
      allow update, delete: if authed() && request.auth.uid == resource.data.user_id;
    }
    match /profiles/{uid} {
      allow read: if true;
      allow write: if authed() && request.auth.uid == uid;
    }
    match /issue_votes/{voteId} {
      allow read: if true;
      allow write: if authed();
    }
    match /comments/{commentId} {
      allow read: if true;
      allow create: if authed();
    }
  }
}

