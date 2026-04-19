import { Asset, CreateAssetDTO, UpdateAssetDTO } from '../types/asset';

class AssetService {
  private baseUrl: string;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.baseUrl = `${apiUrl}/api/assets`;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getAll(): Promise<Asset[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.statusText}`);
    }
    return response.json();
  }

  async getById(id: string): Promise<Asset> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.statusText}`);
    }
    return response.json();
  }

  async getByCategory(category: string): Promise<Asset[]> {
    const response = await fetch(`${this.baseUrl}/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch assets by category: ${response.statusText}`);
    }
    return response.json();
  }

  async create(data: CreateAssetDTO): Promise<Asset> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Failed to create asset: ${response.statusText}`);
    }
    return response.json();
  }

  async update(id: string, data: UpdateAssetDTO): Promise<Asset> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Failed to update asset: ${response.statusText}`);
    }
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to delete asset: ${response.statusText}`);
    }
  }

  async getCategories(): Promise<string[]> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return response.json();
  }

  async downloadAsset(id: string): Promise<{ url: string; name: string; category: string }> {
    const sessionId = this.getOrCreateSessionId();
    const response = await fetch(`${this.baseUrl}/${id}/download`, {
      headers: {
        'X-Session-Id': sessionId,
        ...this.getHeaders()
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to download asset: ${response.statusText}`);
    }
    return response.json();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
}

export default new AssetService();
