# Transfer Funds Flow Guide

## Overview
This guide documents the complete transfer funds flow including form validation, confirmation modal, and success modal.

## System Flow

### 1. Transfer Form Entry
**Location:** Dashboard → Transfer Funds

**Fields:**
- Account Name* - Recipient's account name (required, trimmed)
- Account Number* - Must be exactly 10 digits (e.g., 1234567890)
- Bank Name* - Recipient's bank name (required, trimmed)
- Switch Code* - SWIFT code (required, e.g., VBNKUS33)
- IBM Number* - International Bank Account Number (required)
- Country* - Recipient's country (required, trimmed)
- Amount* - Transfer amount in decimal format (must be > 0, max = available balance)

**Validations:**
- All fields are required
- Account number must be exactly 10 digits
- Amount must be positive and not exceed available balance
- If insufficient funds: Error toast → "Insufficient funds for this transfer."

**Action:** Click "Continue" button

---

### 2. Confirmation Modal
**Triggered When:** Valid form submission

**Modal Title:** "Confirm Transfer"

**Display Elements:**
- Recipient Name
- Amount (displayed in red with minus sign)
- Bank Name
- IMF Code input field (password type)

**Required Input:**
- IMF Code (password field, required to proceed)

**Buttons:**
- "Confirm Transfer" - Submits the transfer (primary button)
- "Cancel" - Closes modal without processing

**Validations:**
- IMF Code cannot be empty
- If empty: Error toast → "Kindly enter your IMF code to proceed."

**Action:** Enter IMF code and click "Confirm Transfer"

---

### 3. Success Modal
**Triggered When:** Transfer processes successfully after confirmation

**Modal Title:** None (displays success state)

**Visual Elements:**
- Green checkmark icon in circular background
- "Transfer Successful" heading
- "Your funds have been transferred successfully" subtext

**Display Details:**
- Recipient Name
- Account Number (displayed in monospace font)
- Bank Name
- Amount Transferred (in red, NGN currency format)
- Date & Time (formatted date with time)
- Email confirmation message

**Buttons:**
- "Done" - Closes modal and resets form (primary)
- "Copy Details" - Copies formatted transfer details to clipboard (secondary)

**What Happens:**
- Transaction is recorded in Firebase
- Amount is debited from user account balance
- Form is reset for new transfer
- Transaction appears in Transaction History

---

## Data Recording

### Transaction Record
When transfer is successful, the following is recorded:

```javascript
{
  description: `Transfer to ${recipientName}`,
  amount: -Math.abs(transferAmount),
  date: ISO date string,
  balance: updated balance after transfer,
  status: "successful",
  source: "customer",
  createdAt: timestamp
}
```

### Transaction History
- Appears under Dashboard → Transaction History
- Shows as debit (negative amount in red)
- Includes recipient name in description
- Sorted with most recent first

---

## Error Scenarios

### 1. Invalid Account Number
**Trigger:** Enter account number that's not exactly 10 digits
**Response:** Inline error message
**Message:** "Enter a valid 10-digit account number"

### 2. Insufficient Funds
**Trigger:** Enter amount greater than available balance
**Response:** Toast notification
**Message:** "Insufficient funds for this transfer."

### 3. Empty IMF Code
**Trigger:** Try to confirm without entering IMF code
**Response:** Toast notification
**Message:** "Kindly enter your IMF code to proceed."

### 4. Failed Transaction
**Trigger:** Database or server error during transfer
**Response:** Toast notification (error)
**Message:** "Could not complete this transfer."
**State:** Confirmation modal remains open, user can retry

---

## Testing Checklist

- [ ] Fill transfer form with valid 10-digit account number
- [ ] Verify "Continue" button submits form
- [ ] Confirmation modal appears with transfer details
- [ ] IMF code field is password type (hidden text)
- [ ] "Confirm Transfer" requires IMF code
- [ ] Success modal displays after confirmation
- [ ] Success modal shows all transfer details correctly
- [ ] "Copy Details" button works (check clipboard)
- [ ] "Done" button closes modal
- [ ] Form resets after successful transfer
- [ ] Transaction appears in Transaction History
- [ ] Amount is debited correctly (negative value)
- [ ] Available balance updates after transfer

---

## Code Structure

### Components
- `src/pages/dashboard/TransferFunds.jsx` - Main page with form and modals
- `src/components/TransferFunds/TransferSuccessModal.jsx` - Success modal component

### State Management
- `pendingTransfer` - Stores form data awaiting confirmation
- `successfulTransfer` - Stores successful transfer details
- `code` - IMF code input value
- `confirming` - Loading state during confirmation

### Key Functions
- `onSubmit(data)` - Validates form and shows confirmation modal
- `handleConfirm(event)` - Processes transfer after IMF verification
- `handleSuccessModalClose()` - Closes success modal and resets form

### Integration Points
- `addTransaction()` - Records transaction in Firebase
- `useAuth()` - Gets user data and updates balance
- `notifyError()` - Shows error toast notifications
- `formatCurrency()` - Formats amounts to NGN currency

---

## Configuration

### Account Number Validation
Currently accepts: Exactly 10 digits (0-9)
```javascript
.matches(/^\d{10}$/, "Enter a valid 10-digit account number")
```

To modify: Edit `src/pages/dashboard/TransferFunds.jsx` line 20

### Currency Format
Default: Nigerian Naira (NGN)
Location: `TransferSuccessModal.jsx` line 21

To change: Update currency code in `new Intl.NumberFormat()`

### Date/Time Format
Uses locale format: 'en-NG'
Example: "25 Aug 2026 at 15:31:42"

---

## Future Enhancements

1. Add transfer history/tracking
2. Save frequently used recipients
3. Schedule transfers
4. Add transaction fees display
5. Add verification step (OTP)
6. Add transfer limits
7. Add beneficiary management
8. Export transfer receipts as PDF

