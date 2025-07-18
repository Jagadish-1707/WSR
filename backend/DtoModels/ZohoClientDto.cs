namespace backend.DtoModels
{
    public class ZohoClientDto
    {
        public string clientId { get; set; }
        public string clientName { get; set; }
        public string currencyCode { get; set; }
        public string billingMethod { get; set; }
        public string emailId { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phoneNo { get; set; }
        public string mobileNo { get; set; }
        public string faxNo { get; set; }
        public string streetAddr { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string pincode { get; set; }
        public string country { get; set; }
        public string industry { get; set; }
        public string compsize { get; set; }
        public string description { get; set; }
    }

    public class ZohoClientApiResponse
    {
        public ZohoClientResponse response { get; set; }
    }

    public class ZohoClientResponse
    {
        public List<ZohoClientDto> result { get; set; }
        public string message { get; set; }
        public string uri { get; set; }
        public int status { get; set; }
        public bool? isNextAvailable { get; set; }
    }
}
