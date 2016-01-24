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

		public TripMapController(ApplicationDbContext applicationDbContext)
		{
			_applicationDbContext = applicationDbContext;
		}

		// GET: /<controller>/
		public IActionResult TripMap()
        {
            return View();
        }

		[HttpPost]
		public async Task<IActionResult> SavePath(TripDataViewModel tripDataViewModel)
		{
			TripData tripData = new TripData();
			// TODO: somehow assign received values

			//_applicationDbContext.Add(tripData);

			await _applicationDbContext.SaveChangesAsync();

			Console.WriteLine(tripDataViewModel);

            return Json(new { saved = true });
		}
    }
}
