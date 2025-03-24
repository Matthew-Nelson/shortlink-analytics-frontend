# Tech Design Document: URL Shortener with Analytics

## Overview

### Project Goal
The goal of this project is to build a URL Shortener application with analytics tracking. The application will allow users to shorten long URLs, track clicks, locations, and referrers, and optionally create custom short links.

### Tech Stack
- **Frontend**: Next.js
- **Backend**: Node.js/Express
- **Database**: PostgreSQL

## Features

1. **URL Shortening**: Allow users to shorten long URLs.
2. **Analytics Tracking**: Track clicks, locations, and referrers.
3. **Custom Short Links**: Optionally allow users to create custom short links.

## System Architecture

### High-Level Architecture Diagram
```
           +---------------------+
           |    User Interface   |
           |       (Next.js)     |
           +----------+----------+
                      |
                      v
           +----------+----------+
           |      API Gateway     |
           |   (Node.js/Express)  |
           +----------+----------+
                      |
                      v
           +----------+----------+
           |       Database       |
           |      (PostgreSQL)    |
           +----------------------+
```

### Components

1. **Frontend (Next.js)**
   - **Pages**: Home, URL Shortening Form, Analytics Dashboard
   - **Components**: URL Shortening Form, Analytics Chart, Custom Link Input

2. **Backend (Node.js/Express)**
   - **Endpoints**:
     - `POST /shorten`: Shorten a long URL
     - `GET /:shortId`: Redirect to the long URL and track analytics
     - `GET /analytics/:shortId`: Get analytics for a short URL

3. **Database (PostgreSQL)**
   - **Tables**:
     - `urls`: Store original URLs and their shortened versions
     - `clicks`: Store click analytics (timestamp, location, referrer)

## Database Design

### Tables

#### `urls`

| Column     | Type         | Description                   |
|------------|--------------|-------------------------------|
| id         | SERIAL       | Primary key                   |
| long_url   | TEXT         | Original long URL             |
| short_id   | VARCHAR(10)  | Shortened URL identifier      |
| custom_id  | VARCHAR(10)  | Custom short URL identifier   |
| created_at | TIMESTAMP    | Timestamp of URL creation     |

#### `clicks`

| Column     | Type         | Description                   |
|------------|--------------|-------------------------------|
| id         | SERIAL       | Primary key                   |
| url_id     | INTEGER      | Foreign key referencing `urls`|
| timestamp  | TIMESTAMP    | Timestamp of the click        |
| location   | VARCHAR(100) | Location of the click         |
| referrer   | TEXT         | Referrer URL                  |

## API Endpoints

### `POST /shorten`

**Description**: Shorten a long URL.

**Request Parameters**:
- `long_url` (string): The original long URL.
- `custom_id` (string, optional): Custom short URL identifier.

**Response**:
- `short_url` (string): The shortened URL.

### `GET /:shortId`

**Description**: Redirect to the long URL and track analytics.

**Request Parameters**:
- `shortId` (string): The shortened URL identifier.

**Response**:
- Redirect to the original long URL.

### `GET /analytics/:shortId`

**Description**: Get analytics for a short URL.

**Request Parameters**:
- `shortId` (string): The shortened URL identifier.

**Response**:
- `clicks` (array): List of click analytics.

## Analytics Tracking

### Click Tracking
When a user clicks on a shortened URL, the backend will:
1. Record the click in the `clicks` table with the timestamp, location, and referrer.
2. Redirect the user to the original long URL.

### Location Tracking
Use an external API (such as IP Geolocation API) to determine the location of the click based on the user's IP address.

### Referrer Tracking
Capture the `Referer` header from the request to determine the referrer URL.

## Frontend Design

### Pages

1. **Home Page**
   - Contains the URL shortening form.
   - Displays a list of recently shortened URLs.

2. **Analytics Dashboard**
   - Displays analytics for a specific shortened URL.
   - Includes charts and graphs for clicks, locations, and referrers.

## Security Considerations

1. **Input Validation**: Ensure all user inputs are validated to prevent SQL injection and XSS attacks.
2. **Rate Limiting**: Implement rate limiting to prevent abuse of the URL shortening service.
3. **HTTPS**: Ensure all communications are encrypted using HTTPS.

## Conclusion

This tech design document outlines the architecture, database design, API endpoints, and security considerations for the URL Shortener with Analytics application. The project is designed to be small yet impressive, with features that demonstrate full-stack development skills and the ability to handle analytics tracking.