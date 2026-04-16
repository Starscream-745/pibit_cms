export interface Asset {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetDTO {
  name: string;
  url: string;
  category: string;
  description: string;
}

export interface UpdateAssetDTO {
  name?: string;
  url?: string;
  category?: string;
  description?: string;
}
