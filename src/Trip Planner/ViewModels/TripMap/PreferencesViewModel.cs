using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace Trip_Planner.ViewModels.TripMap
{
    public class PreferencesViewModel
    {
        [Display(Name = "Miasto")]
        public String City { get; set; }
        [Display(Name = "Data przyjazdu")]
        public DataType BeginTrip { get; set; }
        [Display(Name = "Data wyjazdu")]
        public DataType EndTrip { get; set; }
        [Display(Name = "Zabytki")]
        public bool Monuments { get; set; }
        [Display(Name = "Kluby")]
        public bool Club { get; set; }
        [Display(Name = "Kino")]
        public bool Cinema { get; set; }
    }
}
