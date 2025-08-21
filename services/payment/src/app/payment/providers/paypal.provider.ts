import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable()
export class PaypalProvider {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('PAYPAL_BASE_URL') || 
                   'https://api-m.sandbox.paypal.com';
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    const response = await axios.post<PayPalAccessToken>(
      `${this.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = new Date(Date.now() + (response.data.expires_in - 60) * 1000);

    return this.accessToken;
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    orderId: string;
  }): Promise<PayPalOrder> {
    const accessToken = await this.getAccessToken();

    const response = await axios.post<PayPalOrder>(
      `${this.baseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: params.currency,
            value: (params.amount / 100).toFixed(2),
          },
          reference_id: params.orderId,
        }],
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  async captureOrder(orderId: string): Promise<PayPalOrder> {
    const accessToken = await this.getAccessToken();

    const response = await axios.post<PayPalOrder>(
      `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  async getOrder(orderId: string): Promise<PayPalOrder> {
    const accessToken = await this.getAccessToken();

    const response = await axios.get<PayPalOrder>(
      `${this.baseUrl}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  }

  async refundOrder(
    captureId: string,
    params: { amount: number; currency: string }
  ): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await axios.post(
      `${this.baseUrl}/v2/payments/captures/${captureId}/refund`,
      {
        amount: {
          currency_code: params.currency,
          value: params.amount.toFixed(2),
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }
}