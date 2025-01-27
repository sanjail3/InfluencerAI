declare global {
  interface Window {
    LemonSqueezy: any;
    LemonSqueezy: {
      settings: {
        storeId: string;
        storeUrl: string;
      };
    }; 
  }
}

export {};
