using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Trip_Planner.Models
{
    public class TripData
    {
		public int TripDataID { get; set; }
		public virtual ApplicationUser User { get; set; }

		//...
    }
}
