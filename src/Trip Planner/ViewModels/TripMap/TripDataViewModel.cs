using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Trip_Planner.ViewModels.TripMap
{
    public class TripDataViewModel
    {
        public LatLng StartPlace { get; set; }
        public LatLng EndPlace { get; set; }
        public List<LatLng> Waypoints { get; set; }
    }
}
