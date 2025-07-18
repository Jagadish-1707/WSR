﻿using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Projects
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public long project_id { get; set; }
        public string project_name { get; set; }
        public string project_code { get; set;}
        public string alias_name { get; set;}
        public int bu_id { get; set;}
        public int client_id { get; set; }
        public int project_owner { get; set; }
        public string start_date { get; set; }
        public string end_date { get; set;}
        public int status { get; set;}
        public string description { get; set;}
        public string createdon { get; set;}
        public string modifiedon { get; set;}
        public int createdby { get; set;}
        public int modifiedby { get; set;}
    }
}
