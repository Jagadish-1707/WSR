using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTimesheet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TimesheetStatus",
                table: "Timesheets",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "WeekEndDate",
                table: "Timesheets",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WeekStartDate",
                table: "Timesheets",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimesheetStatus",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "WeekEndDate",
                table: "Timesheets");

            migrationBuilder.DropColumn(
                name: "WeekStartDate",
                table: "Timesheets");
        }
    }
}
