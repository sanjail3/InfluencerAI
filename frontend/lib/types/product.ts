export interface ProductInfo {
  product_name: string;
  product_description: string;
  problem_their_solving: string;
  unique_selling_point: string;
  features: string;
  customer_reviews: string;
  pricing: string;
}
export type ProductInfoArray = ProductInfo[];
export interface ApiResponse {
  product_information: ProductInfoArray;
  screenshot: {
    data: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}