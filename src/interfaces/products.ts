export interface ProductVariant {
  id: number;
  price: number;
  variant_color_id: number;
  variant_size_id: number;
  diameter?: number;
  grams?: number;
  height?: number;
  length?: number;
  mililiters?: number;
  width?: number;
}

export interface ProductCreated {
  id: number;
  title: string;
  slug: string;
  description: string;
  discount: number;
  is_published: boolean;
  is_active: boolean;
  image_id: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsVariants {
  id: number;
  product_id: number;
  variant_option_id: number;
}

export interface ProductBody {
  title: string;
  description: string;
  discount: number;
  created_by: number;
  updated_by: number;
  image_id: string;
  variant_options: ProductVariant[];
  tags: Tags[];
  is_published?: boolean;
  is_active?: boolean;
}

export interface Tags {
  id: number;
}
