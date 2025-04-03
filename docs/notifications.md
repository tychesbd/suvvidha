# Notification System Documentation

## Overview

The notification system in Suvvidha provides real-time notifications to users across all roles (Admin, Vendor, Customer). Notifications appear in the sidebar of all dashboard layouts and provide visual feedback for important events.

## Features

- Real-time notifications with unread count badge
- Different notification types (info, success, warning, error) with appropriate icons
- Mark individual notifications as read
- Mark all notifications as read at once
- Delete notifications
- Relative time display (e.g., "2 hours ago")
- Clickable notifications that can navigate to specific pages

## Technical Implementation

### Backend

1. **Notification Model** (`server/models/notificationModel.js`)
   - Stores notification data including recipient, title, message, type, read status, and optional link

2. **Notification Controller** (`server/controllers/notificationController.js`)
   - API endpoints for creating, fetching, marking as read, and deleting notifications

3. **Notification Routes** (`server/routes/notificationRoutes.js`)
   - Defines API routes for notification operations

4. **Notification Utilities** (`server/utils/notificationUtils.js`)
   - Helper functions for creating notifications for specific users, roles, or all users

### Frontend

1. **Notification Redux Slice** (`client/src/features/notifications/notificationSlice.js`)
   - Manages notification state and API interactions

2. **Notification Icon Component** (`client/src/components/notifications/NotificationIcon.js`)
   - UI component that displays the notification bell icon with badge and dropdown menu

## How to Use

### Creating Notifications from Backend

Import the notification utilities in your controller:

```javascript
const { createUserNotification, createRoleNotifications, createAllUsersNotification } = require('../utils/notificationUtils');
```

#### Create a notification for a specific user

```javascript
await createUserNotification(
  userId,           // User ID to send notification to
  'Title',          // Notification title
  'Message content', // Notification message
  'success',        // Type: 'info', 'success', 'warning', 'error'
  '/some/path'      // Optional link to navigate to when clicked
);
```

#### Create notifications for all users with a specific role

```javascript
await createRoleNotifications(
  'admin',          // Role: 'admin', 'vendor', 'customer'
  'Title',          // Notification title
  'Message content', // Notification message
  'info',           // Type: 'info', 'success', 'warning', 'error'
  '/some/path'      // Optional link to navigate to when clicked
);
```

#### Create notifications for all users

```javascript
await createAllUsersNotification(
  'Title',          // Notification title
  'Message content', // Notification message
  'warning',        // Type: 'info', 'success', 'warning', 'error'
  '/some/path'      // Optional link to navigate to when clicked
);
```

### Accessing Notifications in Frontend Components

Use the Redux state to access notifications in your components:

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../features/notifications/notificationSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, isLoading } = useSelector(
    (state) => state.notifications
  );

  // Fetch notifications
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  // Mark a notification as read
  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  // Delete a notification
  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  return (
    // Your component UI
  );
};
```

## Best Practices

1. **Keep notifications concise** - Use clear, short titles and messages
2. **Use appropriate notification types** - Choose the right type based on the nature of the message
3. **Include links when relevant** - Make notifications actionable by linking to relevant pages
4. **Clean up old notifications** - Implement a mechanism to delete old notifications periodically
5. **Limit notification frequency** - Avoid overwhelming users with too many notifications

## Future Enhancements

- Real-time notifications using WebSockets
- Notification preferences for users
- Email notifications for important events
- Notification categories for better organization
- Scheduled/timed notifications