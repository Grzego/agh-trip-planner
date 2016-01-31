using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;
using Microsoft.Data.Entity.Metadata;

namespace Trip_Planner.Migrations
{
    public partial class TripDataToID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_TripData_LatLng_EndPlaceId", table: "TripData");
            migrationBuilder.DropForeignKey(name: "FK_TripData_LatLng_StartPlaceId", table: "TripData");
            migrationBuilder.DropColumn(name: "EndPlaceId", table: "TripData");
            migrationBuilder.DropColumn(name: "StartPlaceId", table: "TripData");
            migrationBuilder.DropTable("LatLng");
            migrationBuilder.AddColumn<string>(
                name: "EndPlace",
                table: "TripData",
                nullable: true);
            migrationBuilder.AddColumn<string>(
                name: "StartPlace",
                table: "TripData",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "EndPlace", table: "TripData");
            migrationBuilder.DropColumn(name: "StartPlace", table: "TripData");
            migrationBuilder.CreateTable(
                name: "LatLng",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Lat = table.Column<double>(nullable: false),
                    Lng = table.Column<double>(nullable: false),
                    TripDataTripDataID = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LatLng", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LatLng_TripData_TripDataTripDataID",
                        column: x => x.TripDataTripDataID,
                        principalTable: "TripData",
                        principalColumn: "TripDataID");
                });
            migrationBuilder.AddColumn<int>(
                name: "EndPlaceId",
                table: "TripData",
                nullable: true);
            migrationBuilder.AddColumn<int>(
                name: "StartPlaceId",
                table: "TripData",
                nullable: true);
            migrationBuilder.AddForeignKey(
                name: "FK_TripData_LatLng_EndPlaceId",
                table: "TripData",
                column: "EndPlaceId",
                principalTable: "LatLng",
                principalColumn: "Id");
            migrationBuilder.AddForeignKey(
                name: "FK_TripData_LatLng_StartPlaceId",
                table: "TripData",
                column: "StartPlaceId",
                principalTable: "LatLng",
                principalColumn: "Id");
        }
    }
}
