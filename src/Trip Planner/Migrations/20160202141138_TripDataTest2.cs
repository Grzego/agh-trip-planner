using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;
using Microsoft.Data.Entity.Metadata;

namespace Trip_Planner.Migrations
{
    public partial class TripDataTest2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Waypoint",
                columns: table => new
                {
                    WaypointID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PlaceID = table.Column<string>(nullable: true),
                    TripDataTripDataID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Waypoint", x => x.WaypointID);
                    table.ForeignKey(
                        name: "FK_Waypoint_TripData_TripDataTripDataID",
                        column: x => x.TripDataTripDataID,
                        principalTable: "TripData",
                        principalColumn: "TripDataID");
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("Waypoint");
        }
    }
}
