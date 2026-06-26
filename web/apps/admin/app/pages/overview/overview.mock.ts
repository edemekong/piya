import type { OverviewRange } from "@piya/shared/types";

export const overviewTrend = [
  { label: "Mon", revenue: 420000, contacts: 18 },
  { label: "Tue", revenue: 520000, contacts: 24 },
  { label: "Wed", revenue: 470000, contacts: 21 },
  { label: "Thu", revenue: 680000, contacts: 32 },
  { label: "Fri", revenue: 760000, contacts: 38 },
  { label: "Sat", revenue: 640000, contacts: 29 },
  { label: "Sun", revenue: 820000, contacts: 41 },
];

export const overviewRangeOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 3 days", value: "last_3_days" },
  { label: "Last 7 days", value: "last_7_days" },
  { label: "Last 30 days", value: "last_30_days" },
  { label: "Last 90 days", value: "last_90_days" },
  { label: "Lifetime", value: "lifetime" },
] as const satisfies readonly { label: string; value: OverviewRange }[];

export const communicationTrend = [
  { failed: 12, label: "Mon", opened: 310, received: 560, unsubscribed: 4 },
  { failed: 9, label: "Tue", opened: 382, received: 620, unsubscribed: 6 },
  { failed: 16, label: "Wed", opened: 344, received: 590, unsubscribed: 5 },
  { failed: 11, label: "Thu", opened: 438, received: 760, unsubscribed: 7 },
  { failed: 20, label: "Fri", opened: 512, received: 840, unsubscribed: 8 },
  { failed: 15, label: "Sat", opened: 461, received: 720, unsubscribed: 5 },
  { failed: 18, label: "Sun", opened: 590, received: 910, unsubscribed: 9 },
];

export const communicationPerformance = [
  {
    audience: "VIP customers",
    name: "June VIP Rewards",
    sent: 1240,
    status: "Active",
  },
  {
    audience: "New customers",
    name: "Welcome Offer",
    sent: 680,
    status: "Scheduled",
  },
  {
    audience: "At-risk customers",
    name: "Win Back Rewards",
    sent: 432,
    status: "Draft",
  },
];

export const recentConversations = [
  {
    contactName: "Amara Okafor",
    lastMessage: "Thanks, I will stop by this weekend.",
    time: "12 min ago",
  },
  {
    contactName: "Tunde Balogun",
    lastMessage: "Does the discount apply in store?",
    time: "1 hr ago",
  },
  {
    contactName: "Maya Chen",
    lastMessage: "Can you share options for business gifting?",
    time: "Yesterday",
  },
];

export const productPerformance = [
  {
    name: "Premium Gift Box",
    revenue: 1280000,
    sold: 48,
    status: "Active",
  },
  {
    name: "Starter Bundle",
    revenue: 940000,
    sold: 36,
    status: "Active",
  },
  {
    name: "Weekend Pack",
    revenue: 620000,
    sold: 27,
    status: "Low stock",
  },
];
