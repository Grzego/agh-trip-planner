using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;

namespace Trip_Planner.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
		public virtual DbSet<TripData> Trips { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
