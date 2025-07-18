export interface ZohoClient {
  clientId: string;
  clientName: string;
  currencyCode: string | null;
  billingMethod: string | null;
  emailId: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNo: string | null;
  mobileNo: string | null;
  faxNo: string | null;
  streetAddr: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
  industry: string | null;
  compsize: string | null;
  description: string | null;
}
