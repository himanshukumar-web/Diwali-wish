import { PlanId } from './types';

export interface ServerPlanConfig {
  id: PlanId;
  nameEn: string;
  nameHi: string;
  priceInInr: number;
  amountInPaise: number;
}

export const SERVER_PLANS: Record<PlanId, ServerPlanConfig> = {
  basic: {
    id: 'basic',
    nameEn: 'Basic Plan',
    nameHi: 'मूल योजना (Basic)',
    priceInInr: 10,
    amountInPaise: 1000
  },
  premium: {
    id: 'premium',
    nameEn: 'Premium Plan',
    nameHi: 'प्रीमियम योजना (Premium)',
    priceInInr: 49,
    amountInPaise: 4900
  },
  royal: {
    id: 'royal',
    nameEn: 'Royal Custom Plan',
    nameHi: 'राजसी योजना (Royal Custom)',
    priceInInr: 99,
    amountInPaise: 9900
  }
};

