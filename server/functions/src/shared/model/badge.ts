interface BadgeRule {
  metric: string;
  value?: number | null;
}

interface BadgeData {
  id: string;
  businessId: string;
  name: string;
  description: string;
  icon?: string | null;
  rule: BadgeRule;
  createdBy: string;
  createdAt: number;
}

export { BadgeData, BadgeRule };
