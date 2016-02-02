using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace Trip_Planner.Migrations
{
    public partial class TripDataCityId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CityId",
                table: "TripData",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "CityId", table: "TripData");
        }
    }
}
