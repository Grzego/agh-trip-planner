using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Trip_Planner.Models;
using Microsoft.AspNet.Identity;
using System.Security.Claims;

namespace Trip_Planner.Controllers
{
    public class SavedTripsController : Controller
    {
		private readonly ApplicationDbContext _applicationDbContext;
		private readonly UserManager<ApplicationUser> _userManager;

		public SavedTripsController(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager)
		{
			_applicationDbContext = applicationDbContext;
			_userManager = userManager;
		}

		// GET: /SavedTrips/
		public async Task<IActionResult> SavedTrips()
        {
			var currentUser = await _userManager.FindByIdAsync(User.GetUserId());
            return View(_applicationDbContext.Trips.Where(t => t.User.Equals(currentUser)).ToList());
        }


    }
}
