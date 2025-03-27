# Tech Design Document: URL Shortener with Analytics

## Overview

### Project Goal

The goal of this project is to build a URL Shortener application with analytics tracking. The application will allow users to shorten long URLs, track clicks, locations, and referrers, and optionally create custom short links.

### Tech Stack

- **Frontend**: Next.js
- **Backend**: Node.js/Express with Apollo Server (GraphQL)
- **Database**: PostgreSQL with Sequelize ORM
- **Environment Management**: dotenv

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
           |   (Apollo Server)    |
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

2. **Backend (Node.js/Express with Apollo Server)**

   - **GraphQL Schema**:
     - Queries:
       - `urls`: Fetch all URLs.
       - `url(short_id: String!)`: Fetch a single URL by its short ID.
       - `clicks(url_id: ID!)`: Fetch all clicks for a specific URL.
     - Mutations:
       - `shortenUrl(long_url: String!, custom_id: String)`: Shorten a long URL with an optional custom ID.
   - **Resolvers**:
     - Map GraphQL queries and mutations to Sequelize models.
     - Handle database interactions and business logic.

3. **Database (PostgreSQL with Sequelize ORM)**

   - **Tables**:
     - `urls`: Store original URLs and their shortened versions.
     - `clicks`: Store click analytics (timestamp, location, referrer).
   - **Synchronization**:
     - Sequelize's `sync` method is used to synchronize the database schema with the models.

4. **Environment Management**
   - Use `dotenv` to manage environment variables, such as database credentials and server configuration.

## Database Design

### Tables

#### `urls`

| Column     | Type        | Description                 |
| ---------- | ----------- | --------------------------- |
| id         | SERIAL      | Primary key                 |
| long_url   | TEXT        | Original long URL           |
| short_id   | VARCHAR(10) | Shortened URL identifier    |
| custom_id  | VARCHAR(10) | Custom short URL identifier |
| created_at | TIMESTAMP   | Timestamp of URL creation   |
| updated_at | TIMESTAMP   | Timestamp of last update    |

#### `clicks`

| Column     | Type         | Description                    |
| ---------- | ------------ | ------------------------------ |
| id         | SERIAL       | Primary key                    |
| url_id     | INTEGER      | Foreign key referencing `urls` |
| timestamp  | TIMESTAMP    | Timestamp of the click         |
| location   | VARCHAR(100) | Location of the click          |
| referrer   | TEXT         | Referrer URL                   |
| created_at | TIMESTAMP    | Timestamp of record creation   |
| updated_at | TIMESTAMP    | Timestamp of last update       |

## API Endpoints

### GraphQL Queries

#### `urls`

**Description**: Fetch all URLs.

**Response**:

- `urls` (array): List of all URLs.

#### `url(short_id: String!)`

**Description**: Fetch a single URL by its short ID.

**Request Parameters**:

- `short_id` (string): The shortened URL identifier.

**Response**:

- `url` (object): The URL object.

#### `clicks(url_id: ID!)`

**Description**: Fetch all clicks for a specific URL.

**Request Parameters**:

- `url_id` (ID): The ID of the URL.

**Response**:

- `clicks` (array): List of click analytics.

### GraphQL Mutations

#### `shortenUrl(long_url: String!, custom_id: String)`

**Description**: Shorten a long URL with an optional custom ID.

**Request Parameters**:

- `long_url` (string): The original long URL.
- `custom_id` (string, optional): Custom short URL identifier.

**Response**:

- `url` (object): The newly created URL object.

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

   - Contains the URL shortening form (`UrlForm` component).
   - Allows users to shorten URLs with optional custom short links.

2. **URLs Page**

   - Displays a list of all shortened URLs.
   - Each URL links to its original long URL.

3. **Analytics Dashboard**

   - Displays analytics for a specific shortened URL.
   - Includes a bar chart for click data using `react-chartjs-2`.

4. **Analytics Index Page**
   - Lists all created URLs with links to their respective analytics dashboards.

### Components

1. **UrlForm**

   - Handles URL shortening via a GraphQL mutation.
   - Allows users to input a long URL and an optional custom short link.

2. **Analytics Chart**
   - Displays click data using `react-chartjs-2` and `chart.js`.
   - Dynamically updates based on the selected short URL.

### Technologies

- **API Calls**: Handled using `axios` for GraphQL queries and mutations.
- **Charts**: Built with `react-chartjs-2` and `chart.js` for visualizing analytics data.
- **Routing**: Managed with Next.js dynamic routing for pages like `/analytics/[shortId]`.
- **Styling**: Global styles defined in `globals.css` and modular styles in `page.module.css`.
