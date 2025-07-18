namespace backend.Models
{
    public class ZohoAccessTokenResponse
    {
        public string access_token { get; set; }
        public string api_domain { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
    }
}
