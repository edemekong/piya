import type {
  CommunicationData,
  CommunicationRecipient,
} from "@/pages/communications/types";

const now = new Date("2026-06-24T09:00:00.000Z").getTime();
const day = 1000 * 60 * 60 * 24;

const communications: CommunicationData[] = [
  {
    id: "comm_welcome_series",
    createdAt: now - day * 45,
    updatedAt: now - day * 2,
    name: "Welcome series",
    businessId: "biz_northstar",
    createdBy: "admin_001",
    isActive: true,
    status: "active",
    type: "onboarding",
    hasPendingBatch: true,
    lastExecutedAt: now - 1000 * 60 * 35,
    lastCursor: "ct_004",
    trigger: {
      type: "onboarding",
      schedule: null,
    },
    targetAudience: {
      targetTags: ["new lead", "first order"],
      targetBadgeTypes: ["regular", "bronze"],
    },
    stepsOrder: ["welcome_email", "welcome_whatsapp"],
    steps: {
      welcome_email: {
        channel: "email",
        delay: 0,
        identityId: "email_resend_default",
        message: {
          subject: "Welcome to Yinapp",
          body: "Hi {{firstName}}, your rewards profile is ready. Explore your perks and start earning today.",
        },
        ctas: [
          {
            label: "View rewards",
            url: "https://yinapp.com/rewards",
            type: "primary",
          },
        ],
        template: {
          name: "welcome_email",
          language: "en",
          providerTemplateId: "tmpl_welcome_001",
        },
      },
      welcome_whatsapp: {
        channel: "whatsapp",
        delay: 1440,
        identityId: "wa_cloud_main",
        message: {
          body: "Your welcome points are waiting. Reply HELP if you need anything.",
        },
        ctas: [],
        template: {
          name: "welcome_whatsapp_followup",
          language: "en",
        },
      },
    },
    stats: {
      recipients: 1248,
      delivered: 1196,
      failed: 18,
      pending: 34,
    },
  },
  {
    id: "comm_june_discount",
    createdAt: now - day * 12,
    updatedAt: now - day,
    name: "June discount alert",
    businessId: "biz_northstar",
    createdBy: "admin_001",
    isActive: true,
    status: "active",
    type: "discount_alert",
    hasPendingBatch: false,
    lastExecutedAt: now - day,
    lastCursor: null,
    trigger: {
      type: "discount_alert",
      schedule: {
        frequency: "once",
        dayOfWeek: 3,
        hour: 10,
        minute: 30,
        startDate: now + day * 2,
        timezone: "Africa/Lagos",
      },
    },
    targetAudience: {
      targetTags: ["vip", "high value"],
      targetBadgeTypes: ["gold", "platinum"],
    },
    stepsOrder: ["discount_sms"],
    steps: {
      discount_sms: {
        channel: "sms",
        delay: 0,
        identityId: "sms_link_mobility_ng",
        message: {
          body: "YINAPP: Your VIP discount is live. Use code JUNE20 before Sunday.",
        },
        ctas: [],
        template: null,
      },
    },
    stats: {
      recipients: 428,
      delivered: 401,
      failed: 6,
      pending: 21,
    },
  },
  {
    id: "comm_winback",
    createdAt: now - day * 62,
    updatedAt: now - day * 8,
    name: "Win back inactive customers",
    businessId: "biz_northstar",
    createdBy: "admin_002",
    isActive: false,
    status: "paused",
    type: "win_back_inactive",
    hasPendingBatch: false,
    lastExecutedAt: now - day * 8,
    lastCursor: null,
    trigger: {
      type: "win_back_inactive",
      schedule: {
        frequency: "weekly",
        dayOfWeek: 1,
        hour: 9,
        minute: 0,
        startDate: now - day * 45,
        timezone: "Africa/Lagos",
      },
    },
    targetAudience: {
      targetTags: ["at risk"],
      targetBadgeTypes: ["bronze", "silver"],
    },
    stepsOrder: ["winback_email"],
    steps: {
      winback_email: {
        channel: "email",
        delay: 0,
        identityId: "email_resend_default",
        message: {
          subject: "We saved something for you",
          body: "Come back this week and unlock a loyalty reward on your next order.",
        },
        ctas: [
          {
            label: "Claim reward",
            url: "https://yinapp.com/offers/winback",
            type: "primary",
          },
        ],
        template: {
          name: "winback_offer",
          language: "en",
        },
      },
    },
    stats: {
      recipients: 812,
      delivered: 768,
      failed: 23,
      pending: 0,
    },
  },
];

const recipientsByCommunicationId: Record<string, CommunicationRecipient[]> = {
  comm_welcome_series: [
    {
      id: "ct_001",
      name: "Amara Okafor",
      email: "amara@example.com",
      phoneNumber: "+234 801 230 9921",
      status: "delivered",
      channel: "email",
      lastActivityAt: now - 1000 * 60 * 35,
    },
    {
      id: "ct_002",
      name: "Tunde Balogun",
      email: "tunde@example.com",
      phoneNumber: "+234 809 441 1820",
      status: "pending",
      channel: "whatsapp",
      lastActivityAt: now - 1000 * 60 * 8,
    },
  ],
  comm_june_discount: [
    {
      id: "ct_003",
      name: "Maya Chen",
      email: "maya@example.com",
      phoneNumber: "+1 415 209 7744",
      status: "delivered",
      channel: "sms",
      lastActivityAt: now - day,
    },
  ],
  comm_winback: [
    {
      id: "ct_004",
      name: "Daniel Mensah",
      email: "daniel@example.com",
      phoneNumber: "+233 24 778 1091",
      status: "failed",
      channel: "email",
      lastActivityAt: now - day * 8,
    },
  ],
};

export function getCommunications() {
  return communications;
}

export function getCommunicationRecipients(communicationId: string) {
  return recipientsByCommunicationId[communicationId] ?? [];
}
