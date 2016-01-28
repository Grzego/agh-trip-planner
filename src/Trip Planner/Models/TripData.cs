﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Trip_Planner.ViewModels.TripMap;

namespace Trip_Planner.Models
{
    public class TripData : TripDataViewModel
    {
		public int TripDataID { get; set; }
		public virtual ApplicationUser User { get; set; }
    }
}
