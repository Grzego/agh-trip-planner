using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Trip_Planner.ViewModels.TripMap
{
    public class TripDataViewModel
    {
        [Display(Name = "Start")]
        public LatLng StartPlace { get; set; }
        [Display(Name = "Koniec")]
        public LatLng EndPlace { get; set; }
        [Display(Name = "Miejsca")]
        public List<LatLng> Waypoints { get; set; }


    }
}
