using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace Trip_Planner.Migrations
{
    public partial class TripDataTest5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PlaceID", table: "Waypoint");
            migrationBuilder.AddColumn<string>(
                name: "Place",
                table: "Waypoint",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Place", table: "Waypoint");
            migrationBuilder.AddColumn<string>(
                name: "PlaceID",
                table: "Waypoint",
                nullable: true);
        }
    }
}
