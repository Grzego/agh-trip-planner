using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace Trip_Planner.Migrations
{
    public partial class TripDataCity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "TripData",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "City", table: "TripData");
        }
    }
}
