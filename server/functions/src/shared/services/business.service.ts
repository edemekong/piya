type BusinessBrand = {
  businessId: string;
};

export class BusinessService {
  static async getBrandConfig(hostname: string): 
    Promise<BusinessBrand | null> {
    return null;
  }
}
