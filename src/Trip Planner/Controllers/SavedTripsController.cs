using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace Trip_Planner.Controllers
{
    public class SavedTripsController : Controller
    {
        // GET: /SavedTrips/
        public IActionResult SavedTrips()
        {
            return View();
        }


    }
}
