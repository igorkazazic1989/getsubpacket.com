export interface Company {
  id: string;
  owner_id: string;
  name: string;
  contact_email: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  share_token: string | null;
  share_enabled: boolean;
  created_at: string;
}

export interface Sub {
  id: string;
  company_id: string;
  name: string;
  trade: string | null;
  email: string | null;
  phone: string | null;
  invite_token: string;
  ytd_paid: number;
  is_corporation: boolean;
  last_invited_at: string | null;
  created_at: string;
}
