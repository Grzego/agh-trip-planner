using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Trip_Planner.ViewModels.TripMap;

namespace Trip_Planner.Models
{
    public class TripData
    {
		public int TripDataID { get; set; }
		public virtual ApplicationUser User { get; set; }
		public string City { get; set; }
		public string CityId { get; set; }
		public string StartPlace { get; set; }
		public string EndPlace { get; set; }
		public virtual ICollection<Waypoint> Waypoints { get; set; }

		public TripData()
		{
			Waypoints = new List<Waypoint>();
		}
	}

	public class Waypoint
	{
		public int WaypointID { get; set; }
		public string Place { get; set; }
		public virtual TripData TripData { get; set; }

		public Waypoint()
		{

		}
		public Waypoint(string _id)
		{
			Place = _id;
		}
	}
}
