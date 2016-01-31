using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Trip_Planner.ViewModels.TripMap
{
    public class TripDataViewModel
    {
		public string City { get; set; }
        public string StartPlace { get; set; }
        public string EndPlace { get; set; }
        public List<string> Waypoints { get; set; }
	}
}
