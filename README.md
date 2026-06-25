# Piya

Piya provides businesses with contact management, campaign and loyalty tooling, scheduled customer communications, and multi-channel conversation history.

## Core capabilities

- Maintain business profiles, contact details, and team access.
- Segment contacts by tags, lifecycle status, engagement, and loyalty badge.
- Create loyalty and discount campaigns with rewards, redemption limits, and audience rules.
- Deliver event-driven or scheduled communications through email, SMS, and WhatsApp.
- Keep customer conversations and message delivery state together across email, SMS, WhatsApp, and the native app.

## Domain model overview

The data contracts live in [`server/functions/src/shared/model`](server/functions/src/shared/model). This README intentionally describes their responsibilities rather than duplicating their fields or TypeScript types; the source files are the current contract.

| Model | Responsibility |
| --- | --- |
| [`base.ts`](server/functions/src/shared/model/base.ts) | Defines the common model identity and audit timestamps used by persisted records. |
| [`business.ts`](server/functions/src/shared/model/business.ts) | Represents a business profile, its public contact details and branding, plus business members with owner/manager and edit/view access. |
| [`user.ts`](server/functions/src/shared/model/user.ts) | Represents an account, verification and notification settings, location, and its membership across businesses. |
| [`contact.ts`](server/functions/src/shared/model/contact.ts) | Represents a business contact, including contact channels, address, lifecycle status, preferences, tags, engagement and value metrics, and loyalty badge. |
| [`campaign.ts`](server/functions/src/shared/model/campaign.ts) | Represents loyalty and discount campaigns, including lifecycle status, rewards, timing, codes, eligibility rules, and usage limits. |
| [`communication.ts`](server/functions/src/shared/model/communication.ts) | Represents multi-step communications triggered by customer events or schedules, with audience filtering and email, SMS, or WhatsApp delivery. |
| [`chat.ts`](server/functions/src/shared/model/chat.ts) | Represents conversations, participants, active channels, message content, delivery status, and provider message references. |

## Key relationships

- A user can belong to multiple businesses; each business has members and a business-scoped role/permission.
- Contacts, campaigns, communications, chats, and messages are scoped to a business.
- Campaign and communication audiences can target contacts by tags and loyalty badge.
- Communications can react to onboarding, birthdays, anniversaries, badge upgrades, inactivity, broadcasts, and discount alerts.
- Chats connect a business and contact; messages within them retain their channel and delivery status.



* Authentication
- Email 
- OTP or Password (if password is enabled)
- Name + Phone number (if register)

* Onboarding
- Business Profile
  1. Business name
  2. Business description
  3. Business category

- Contact details
  1. Business email
  2. Business phone
  3. Locations

- Branding
  1. Logo 
  2. Cover image
  3. Primary + Secondary color
  6. website
  4. Social links
  5. Privacy + Terms of use links
