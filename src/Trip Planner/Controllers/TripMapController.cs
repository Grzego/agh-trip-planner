using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Data.Entity;
using Trip_Planner.Models;
using Trip_Planner.Services;
using Trip_Planner.ViewModels.TripMap;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Trip_Planner.Controllers
{
    public class TripMapController : Controller
    {
		private readonly ApplicationDbContext _applicationDbContext;
		private readonly UserManager<ApplicationUser> _userManager;

		public TripMapController(ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager)
		{
			_applicationDbContext = applicationDbContext;
			_userManager = userManager;
		}

		// GET: /<controller>/
		public IActionResult TripMap(int? id)
        {
            return View();
        }

		[HttpPost]
		public async Task<IActionResult> SavePath(TripDataViewModel tripData)
		{
			var _tripData = new TripData();
			_tripData.User = await _userManager.FindByIdAsync(User.GetUserId());
			_tripData.City = tripData.City;
			_tripData.CityId = tripData.CityId;
			_tripData.StartPlace = tripData.StartPlace;
			_tripData.EndPlace = tripData.EndPlace;
			_tripData.Waypoints = tripData.Waypoints.Select(t => new Waypoint(t)).ToList();

			_applicationDbContext.Add(_tripData);

			await _applicationDbContext.SaveChangesAsync();
			
            return Json(new { saved = true });
		}

		[HttpPost]
		public IActionResult GetPath(int id)
		{
			var tdvm = _applicationDbContext.Trips.Include(t => t.Waypoints).Single(t => t.TripDataID == id);

			return Json(new {
				City = tdvm.City,
				CityId = tdvm.CityId,
				StartPlace = tdvm.StartPlace,
				EndPlace = tdvm.EndPlace,
				Waypoints = tdvm.Waypoints.Select(t => t.Place).ToList()
			});
		}
    }
}
