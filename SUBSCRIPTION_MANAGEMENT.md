# Subscription Management System

This document explains how users can analyze their payments and how admins can manage subscription requests.

## For Users

### Viewing Subscription History

1. **Access Dashboard**: Navigate to `/dashboard` after signing in
2. **Subscription History Section**: You'll see a table showing:
   - **Plan**: The subscription plan you requested (Basic, Standard, or Premium)
   - **Status**: Current status (Pending, Approved, or Rejected)
   - **Payment Reference**: Transaction ID or reference number you provided
   - **Date**: When the subscription request was created

### Understanding Status

- **⏳ Pending**: Your payment is being reviewed by an admin
- **✓ Approved**: Your subscription has been approved and your plan has been upgraded
- **Rejected**: Your subscription request was rejected (contact support for details)

### Making a Payment

1. Go to `/pricing` to view available plans
2. Select a plan and click "Subscribe"
3. You'll be redirected to the subscription form
4. Fill in your details and payment reference (optional)
5. Scan the QR code to make payment via Payphone
6. Submit the form after payment
7. Your request will be pending until an admin approves it

## For Admins

### Accessing Admin Panel

1. **Set Admin Email**: Add your email to the `ADMIN_EMAILS` environment variable in `.env.local`:
   ```
   ADMIN_EMAILS=admin@example.com,another-admin@example.com
   ```
   For frontend visibility (optional), also add:
   ```
   NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another-admin@example.com
   ```

2. **Access Admin Panel**: Navigate to `/admin/subscriptions` or click "Admin Panel" in your dashboard

### Admin Dashboard Features

The admin panel shows:

1. **Statistics Cards**:
   - Total subscription requests
   - Pending requests count
   - Approved requests count
   - Total revenue from approved subscriptions

2. **Filter Options**:
   - View all requests
   - View only pending requests
   - View only approved requests

3. **Subscription Requests Table**:
   - User information (name and email)
   - Current plan
   - Requested plan
   - Amount (₹999 for Basic, ₹1499 for Standard, ₹2999 for Premium)
   - Payment reference (if provided)
   - Status
   - Date of request
   - Action buttons (Approve/Reject for pending requests)

### Managing Subscription Requests

1. **Review Payment**: Check the payment reference provided by the user
2. **Verify Payment**: Confirm payment was received via your payment gateway
3. **Approve Request**:
   - Click "Approve" button on a pending request
   - This will:
     - Update the request status to "approved"
     - Upgrade the user's plan automatically
     - User will be able to use their new plan immediately

4. **Reject Request**:
   - Click "Reject" button if payment verification fails
   - The request will be removed from the system
   - User can submit a new request if needed

## API Endpoints

### User Endpoints

- `GET /api/subscriptions` - Get user's subscription requests
  - Requires authentication
  - Returns list of user's subscription requests

### Admin Endpoints

- `GET /api/admin/subscriptions` - Get all subscription requests
  - Requires admin authentication (checks ADMIN_EMAILS)
  - Returns all subscription requests with user details

- `POST /api/admin/subscriptions` - Approve or reject a request
  - Requires admin authentication
  - Body: `{ requestId: string, action: "approve" | "reject" }`
  - Approving automatically upgrades the user's plan

## Database Schema

Subscription requests are stored in the `subscription_requests` table with:
- `id`: Unique request ID
- `user_id`: User who made the request
- `selected_plan`: Plan requested (basic, standard, premium)
- `payment_reference`: Transaction reference (optional)
- `status`: Request status (pending, approved)
- `created_at`: Timestamp of request

## Security Notes

1. **Admin Access**: Admin checks are performed server-side using the `ADMIN_EMAILS` environment variable
2. **Authentication**: All endpoints require user authentication
3. **Authorization**: Admin endpoints verify admin status before allowing access
4. **Plan Updates**: Plan upgrades happen automatically when a request is approved

## Environment Variables

Add these to your `.env.local` file:

```bash
# Admin emails (comma-separated)
ADMIN_EMAILS=admin@example.com,another-admin@example.com

# Optional: For showing admin link in dashboard (client-side check)
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

## Workflow

1. **User Flow**:
   - User selects a plan → Fills subscription form → Makes payment → Submits request → Waits for approval → Gets upgraded automatically when approved

2. **Admin Flow**:
   - Admin logs in → Accesses admin panel → Views pending requests → Verifies payment → Approves request → User's plan is upgraded automatically

## Troubleshooting

- **Can't see Admin Panel link**: Make sure your email is in `NEXT_PUBLIC_ADMIN_EMAILS` and you've refreshed the page
- **403 Error on Admin Panel**: Verify your email is in `ADMIN_EMAILS` environment variable
- **User plan not updating**: Check that the subscription request was approved (status should be "approved")
- **Payment reference missing**: Users can submit requests without payment reference, but it's recommended to ask for it

