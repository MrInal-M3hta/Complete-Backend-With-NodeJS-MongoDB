🎬 YouTube Clone Backend (Node.js + Express + MongoDB)

A full-featured backend for a video streaming platform similar to YouTube.
Built with Node.js, Express, MongoDB, and Cloudinary, supporting videos, likes, comments, playlists, subscriptions, and authentication.

⸻

🚀 Features

🔐 Authentication
	•	JWT-based authentication (Access & Refresh Tokens)
	•	Secure password hashing using bcrypt
	•	Login / Signup / Logout

🎥 Video Management
	•	Upload videos (Cloudinary integration)
	•	Update / Delete videos
	•	Publish / Unpublish videos
	•	Search, filter, sort & pagination
	•	View count tracking

❤️ Likes System
	•	Like / Unlike videos, comments, tweets
	•	Prevent duplicate likes
	•	Fetch liked videos

💬 Comments
	•	Add / Update / Delete comments
	•	Nested data with owner info
	•	Like system on comments
	•	Pagination support

📺 Subscriptions
	•	Subscribe / Unsubscribe channels
	•	Get subscribers list
	•	Get subscribed channels
	•	Channel profile with stats

📂 Playlists
	•	Create / Update / Delete playlists
	•	Add / Remove videos
	•	Fetch user playlists

📊 Channel Dashboard
	•	Total videos
	•	Total views
	•	Total likes
	•	Total subscribers

⸻

🛠️ Tech Stack
	•	Backend: Node.js, Express.js
	•	Database: MongoDB + Mongoose
	•	Authentication: JWT
	•	File Upload: Multer
	•	Cloud Storage: Cloudinary
	•	Pagination: mongoose-aggregate-paginate-v2

⸻

📁 Project Structure
```
src/
│
├── controllers/     # Business logic
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middleware/      # Auth & error handling
├── utils/           # Helper functions
├── db/              # Database connection
└── app.js           # Express app setup
```
⚙️ Environment Variables

Create a .env file in root:
```
PORT=8000

MONGODB_URI=your_mongodb_uri

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

▶️ Installation & Setup
```
# Clone repo
git clone https://github.com/your-username/your-repo.git

# Install dependencies
npm install

# Run server
npm run dev
```
📡 API Endpoints (Overview)

🔐 Auth
```
POST   /api/v1/users/register
POST   /api/v1/users/login
POST   /api/v1/users/logout
```
🎥 Videos
```
GET    /api/v1/videos
POST   /api/v1/videos
GET    /api/v1/videos/:videoId
PATCH  /api/v1/videos/:videoId
DELETE /api/v1/videos/:videoId
```

❤️ Likes
```
POST   /api/v1/likes/video/:videoId
POST   /api/v1/likes/comment/:commentId
POST   /api/v1/likes/tweet/:tweetId
GET    /api/v1/likes/videos
```
💬 Comments
```
GET    /api/v1/comments/:videoId
POST   /api/v1/comments/:videoId
PATCH  /api/v1/comments/:commentId
DELETE /api/v1/comments/:commentId
```

📺 Subscriptions
```
POST   /api/v1/subscriptions/:channelId
GET    /api/v1/subscriptions/channel/:channelId
GET    /api/v1/subscriptions/user/:userId
```
📂 Playlists
```
POST   /api/v1/playlists
GET    /api/v1/playlists/:userId
GET    /api/v1/playlists/detail/:playlistId
PATCH  /api/v1/playlists/:playlistId
DELETE /api/v1/playlists/:playlistId
```
🔥 Key Concepts Used
	•	Aggregation Pipeline ($match, $lookup, $addFields)
	•	Pagination using aggregation
	•	JWT Authentication Middleware
	•	File upload using Multer
	•	Cloudinary integration
	•	Schema design (Reference vs Embed)

⸻

🧠 Learning Highlights
	•	Backend system design (YouTube-like architecture)
	•	REST API best practices
	•	Secure authentication flow
	•	Database optimization using indexes
	•	Real-world scalable backend patterns

⸻

📌 Future Improvements
	•	🔔 Real-time notifications (Socket.IO)
	•	📈 Analytics dashboard
	•	🎯 Recommendation system
	•	⚡ Redis caching
	•	🧵 Nested comments (replies)

⸻

👨‍💻 Author

Mrinal Mehta

⸻

⭐ Support

If you like this project, give it a ⭐ on GitHub!
:::
