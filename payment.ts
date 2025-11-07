import { ENV } from "./env";

export interface TapChargeRequest {
  amount: number;
  currency: "KWD" | "AED" | "USD";
  description: string;
  reference: string;
  customer: {
    first_name: string;
    last_name?: string;
    email: string;
  };
  source: {
    id: string;
  };
  redirect: {
    url: string;
  };
}

export interface TapChargeResponse {
  id: string;
  status: "INITIATED" | "CAPTURED" | "FAILED" | "DECLINED";
  amount: number;
  currency: string;
  reference: string;
  customer: {
    id: string;
    email: string;
  };
  source: {
    id: string;
    object: string;
  };
  redirect: {
    url: string;
  };
}

const TAP_API_URL = "https://api.tap.company/v2";

export async function createTapCharge(
  chargeData: TapChargeRequest
): Promise<TapChargeResponse> {
  const response = await fetch(`${TAP_API_URL}/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ENV.tapApiKey}`,
    },
    body: JSON.stringify(chargeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Tap API error: ${error.errors?.[0]?.description || response.statusText}`);
  }

  return response.json();
}

export async function getTapCharge(chargeId: string): Promise<TapChargeResponse> {
  const response = await fetch(`${TAP_API_URL}/charges/${chargeId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ENV.tapApiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to retrieve charge: ${response.statusText}`);
  }

  return response.json();
}

export function getPriceByLanguage(language: "fa" | "ar" | "en"): {
  amount: number;
  currency: "KWD" | "AED" | "USD";
} {
  if (language === "fa") {
    return { amount: 0, currency: "KWD" }; // Free for Persian
  } else if (language === "ar") {
    return { amount: 20, currency: "AED" }; // 20 AED for Arabic
  } else {
    return { amount: 6, currency: "USD" }; // 6 USD for English
  }
}

export function validateReferralCode(code: string, masterCode: string): boolean {
  return code === masterCode || code.length === 8; // Simple validation
}
