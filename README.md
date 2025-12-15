# URL Shortener with Analytics

A simple full-stack URL shortener built using Node.js, Express, MongoDB, and vanilla JavaScript.

## Features
- Create short URLs
- Redirect to original URLs
- Track click count
- View analytics via API and simple frontend

## Tech Stack
- Backend: Node.js, Express
- Database: MongoDB Atlas, Mongoose
- Frontend: HTML, CSS, JavaScript

## API Endpoints
- POST /shorten  
  Create a short URL

- GET /:id  
  Redirect to original URL and increment click count

- GET /stats/:id  
  View analytics for a short URL

## Run Locally
1. Clone the repo
2. `cd server`
3. `npm install`
4. Create a `.env` file:
5. `node index.js`
6. Open `client/index.html` in browser

## Notes
This project was built to learn full-stack fundamentals including REST APIs, databases, and frontend–backend integration.

## Live Demo
- Frontend: https://genuine-kleicha-0a2098.netlify.app/
- Backend API: https://url-shortener-api-5hfn.onrender.com

### Note
Short URLs are generated dynamically based on deployment environment.
