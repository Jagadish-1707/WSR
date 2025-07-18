namespace backend.Models
{
    public class ZohoEmployeeRecord
    {
        public string EmailID { get; set; }
        public string EmployeeID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string Employeestatus { get; set; }
        public string Zoho_ID { get; set; }
    }

    public class ZohoEmployeeWrapper
    {
        public ZohoEmployeeResponse response { get; set; }
    }

    public class ZohoEmployeeResponse
    {
        public List<Dictionary<string, List<ZohoEmployeeRecord>>> result { get; set; }
        public int status { get; set; }
        public string message { get; set; }
    }


}
