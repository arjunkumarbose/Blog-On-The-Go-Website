# Arnob On the Go - Blog Website

## Live Link

https://arnob-on-the-go.web.app/

## Overview

Arnob On the Go is a dynamic blog website built using React, Firebase, React Router, Node.js, Express, MongoDB, and other technologies. The website allows users to explore, add, and manage blogs, as well as engage in a vibrant community through comments and wishlists.

## Features

### Home Page

- **Header:** Simple navbar with navigation links.
- **Banner:** Hero section to grab attention.
- **Recent Blog Posts:** Display six recent blogs with title, image, short description, category, and buttons.
- **Newsletter Section:** Allows users to subscribe with a toast message on submission.
- **User Authentication:** Display login and register buttons if not logged in; show user profile picture and logout button if logged in.
- **Extra Sections:** Two additional unique sections to enhance user experience.

### All Blogs Page

- Display all blogs with filtering by category and a search field.
- Each blog includes title, image, short description, category, details button, and wishlist button.
- Wishlist functionality with a separate database collection.

### Blog Details Page

- Show detailed information about a blog.
- Comment section with user name, profile picture, and conditional update button.
- Users cannot comment on their own blogs.

### Add Blog Page

- Form to add a new blog with title, image URL, category, short description, and long description.
- Category selection through dropdown element.

### Update Blog Page

- Private/protected route for logged-in users to update/edit their blogs.

### Featured Blogs Page

- Table showcasing the top 10 posts based on word count in the long description.
- Visualized using a table library (e.g., React-data-table).

### Wishlist Page

- Display all blogs wishlisted by a specific user.
- Each blog includes title, image, short description, category, details button, and remove wishlist button.

### Authentication

- Email and password-based authentication.
- Additional login options (e.g., Facebook, GitHub, Google).
- Error display on login and registration pages.

### Reload Functionality

- Private routes retain user session upon reloading.

### Responsive Design

- Mobile and desktop responsive homepage.

### Tanstack Query

- Use Tanstack query for data fetching across all pages.

### Framer Motion Package

- Implement Framer Motion for dynamic animations on the home page.

### JWT Authentication

- Implement JWT authentication on all private routes.

## Backend

- MongoDB is used as the backend database.

## Technologies Used

- React
- Firebase
- React Router
- Node.js
- Express
- MongoDB
