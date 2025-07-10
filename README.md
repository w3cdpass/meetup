# FriendChat - Secure Friend-to-Friend Messaging App

## 📌 Overview

FriendChat is a secure messaging application that allows users to connect with friends through an invitation system and exchange messages in real-time. The app features OAuth authentication, friend request management, and end-to-end encrypted messaging.

## 🌐 System Architecture


### Component Diagram

```mermaid
flowchart TD
    A[React Components] -->|Axios Requests| B[Node.js/Express API]
    A -->|Socket.io| C[WebSocket Server]
    B --> D[Auth Controller]
    B --> E[Chat Controller]
    B --> F[Friend Controller]
    D --> G[User Service]
    E --> G
    F --> G
    G --> H[(MongoDB Users)]
    E --> I[Chat Service]
    I --> J[(MongoDB Chats)]
    C --> I
```
---

# 🔄 Workflow: From Invitation to Messaging

- Invitation Phase

    - User A sends friend request to User B via email

    -  System stores pending request in database

    -    User B receives notification

- Acceptance Phase

    - User B accepts request

    -    System creates chat room

     -   Both users are added to each other's friend lists

- Messaging Phase

    -   Either user can initiate chat

    -    Messages are encrypted end-to-end

    -   Real-time updates via WebSocket



# 🛠️ Technical Stack
## Frontend

* React.js

*   WebSocket API

*    CryptoJS (for encryption)

*    DOMPurify (for XSS protection)

## Backend

*    Node.js

*    Express.js

*    Mongoose (MongoDB ODM)

*    JSON Web Tokens (JWT)

*    Passport.js (OAuth)

## Database

- MongoDB with collections:

    -  users (user profiles and friend lists)

    -    chats (chat rooms and messages)

    -   friend_requests (pending invitations)

---
# Project Structure

```
friendchat/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Chat/       # Chat UI components
│   │   │   ├── Friends/    # Friend management
│   │   │   └── Layout/     # General layout
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── app.js              # Main server file
│
├── .env.example            # Environment variables template
└── README.md               # This file
```
---
# 🔒 Security Features

* Authentication

    -  OAuth 2.0 with Google/Facebook

    -    JWT token-based sessions

     -   Passwordless authentication

* Data Protection

     -   End-to-end message encryption

     -   Secure WebSocket connections (wss://)

    -  Message content sanitization

*    Privacy Controls

        - Friend approval system

      -  Message history controls

     -   Report/block functionality


---
# 🤝 Friend Relationship Model

```mermaid
erDiagram
    USER ||--o{ FRIEND_REQUEST : receives
    USER ||--o{ FRIEND : has
    USER {
        string _id
        string authId
        string name
        string email
    }
    FRIEND_REQUEST {
        string _id
        ObjectId from
        string status
        date createdAt
    }
    FRIEND {
        ObjectId userId
        ObjectId chatId
    }
    CHAT ||--o{ MESSAGE : contains
    CHAT {
        string _id
        ObjectId[] participants
    }
    MESSAGE {
        string _id
        ObjectId sender
        string content
        date timestamp
    }
```



---
## 🌐 Complete Application Workflow
```mermaid
flowchart TD
    A[User Visits App] --> B[OAuth Login]
    B --> C{New User?}
    C -->|Yes| D[Create Profile]
    C -->|No| E[Load Dashboard]
    D --> E
    E --> F[Friend Management]
    F --> G[Send Request]
    F --> H[Accept Request]
    G --> I[(Store in DB)]
    H --> I
    I --> J[Chat Interface]
    J --> K[Send Message]
    K --> L[Encrypt Message]
    L --> M[WebSocket Server]
    M --> N[(Store in DB)]
    N --> O[Receive Message]
    O --> P[Decrypt Message]
    P --> Q[Update UI]
```
---
# 🗃️ Database Operations Flow
```mermaid
flowchart LR
    subgraph MongoDB
        A[Users Collection]
        B[FriendRequests Collection]
        C[Chats Collection]
    end

    Auth-->|Upsert| A
    SendRequest-->|Insert| B
    AcceptRequest-->|Update| B
    AcceptRequest-->|Insert| C
    AcceptRequest-->|Update Both| A
    SendMessage-->|Push to Array| C
```
---
# 🔒 Security Flow

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Crypto

    Client->>Crypto: Generate key pair
    Client->>Server: Send public key
    Server->>DB: Store public key
    Client->>Crypto: Encrypt(message, friend's public key)
    Client->>Server: Send encrypted message
    Server->>DB: Store encrypted message
    Server->>FriendClient: Forward encrypted message
    FriendClient->>Crypto: Decrypt(message, private key)
```
---
# 📱 Real-time Update Flow

```mermaid
flowchart TB
    subgraph Frontend1
        A[User A]
    end
    subgraph Backend
        B[WebSocket Server]
        C[Message Queue]
    end
    subgraph Frontend2
        D[User B]
    end

    A -->|1. Send Message| B
    B -->|2. Validate Session| B
    B -->|3. Persist Message| C
    C -->|4. Push to Recipient| D
    D -->|5. Read Receipt| B
    B -->|6. Update Status| A
```