using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Client")]
    public class Client
    {
        [Key]
        public int client_id { get; set; }
        public string client_name { get; set; }
        public int status { get; set;}
        public string createdon { get; set; }
        public string modifiedon { get; set; }
        public int createdby { get; set; }
        public int modifiedby { get; set; }

    }
}
