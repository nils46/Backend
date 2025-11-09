# Learnato Discussion Forum Microservice

### Hackathon Theme: “Empower learning through conversation.”

This project is a real-time, microservice-based discussion forum built for the **Learnato Hackathon**. It provides a fast, responsive, and engaging platform for learners and instructors to post questions, share insights, and upvote content, all updated live without needing to refresh.

---

## 🚀 Live Demo

You can access the live, deployed application here:

* **Frontend (React App):** `https://learnato-client.onrender.com`
* **Backend (Node.js API):** `https://learnato-server.onrender.com`

---

## ✨ Features

### Core MVP
* **Create Posts:** Users can add new questions or topics.
* **View All Posts:** A clean, sorted list of all discussion topics.
* **View Single Post:** A detailed view to see a post and all its replies.
* **Add Replies:** Users can add replies under any post.
* **Upvote:** Posts can be upvoted to highlight popular content.
* **Responsive UI:** The interface is fully responsive for both desktop and mobile use.

###  bonus Features (Stretch Goals)
* **⚡ Real-Time Updates:** New posts, replies, and upvotes appear instantly for all connected users, thanks to **Socket.io**.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, `socket.io-client` |
| **Backend** | Node.js, Express |
| **Real-time** | Socket.io |
| **Database** | In-Memory JSON Array |
| **Deployment** | Docker, Render (for Web Service & Static Site) |

---

## 🏁 Getting Started

You can run this project in two ways: with Docker (recommended) or locally.

### 1. Run with Docker (Recommended)

This is the fastest way to get the entire application running, as it mirrors the production deployment.

**Prerequisites:**
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

**Steps:**
1.  Clone this repository.
2.  Open your terminal in the project's root directory (where `docker-compose.yml` is).
3.  Run the following command:
    ```bash
    docker compose up --build
    ```
4.  That's it!
    * The **Frontend** will be running at `http://localhost:3000`.
    * The **Backend** will be running at `http://localhost:8080`.

### 2. Run Locally (Development)

**Prerequisites:**
* [Node.js](https://nodejs.org/en) (v18 or higher)

**Terminal 1: Start the Backend**
```bash
# From the root folder
cd server
npm install
node index.js


Method,Endpoint,Description
GET,/api/posts,Get all posts
POST,/api/posts,Create a new post
GET,/api/posts/:id,Get a single post and its replies
POST,/api/posts/:id/upvote,Upvote a post
POST,/api/posts/:id/reply,Add a reply to a post