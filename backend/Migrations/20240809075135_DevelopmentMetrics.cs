using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class DevelopmentMetrics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DevelopmentMetrics",
                columns: table => new
                {
                    DevelopmentMetricsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    CustomerName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProjectId = table.Column<int>(type: "int", nullable: true),
                    ProjectName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProjectType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MonthYear = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    WeekStartDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    WeekEndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ModifiedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ModifiedBy = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevelopmentMetrics", x => x.DevelopmentMetricsId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DevelopmentTasks",
                columns: table => new
                {
                    TaskId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DevelopmentMetricsId = table.Column<int>(type: "int", nullable: false),
                    TaskName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CRNumber = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Priority = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PlannedStartDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PlannedEndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PlannedDuration = table.Column<int>(type: "int", nullable: true),
                    ActualStartDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ActualEndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ActualDuration = table.Column<int>(type: "int", nullable: true),
                    OnTimeDelivery = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    PlannedEffort = table.Column<double>(type: "double", nullable: true),
                    ActualEffort = table.Column<double>(type: "double", nullable: true),
                    NumberOfDefects = table.Column<int>(type: "int", nullable: true),
                    ReworkEffort = table.Column<double>(type: "double", nullable: true),
                    Status = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Remarks = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpectedCompletionMonth = table.Column<int>(type: "int", nullable: true),
                    TaskToBeCompletedThisMonth = table.Column<bool>(type: "tinyint(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DevelopmentTasks", x => x.TaskId);
                    table.ForeignKey(
                        name: "FK_DevelopmentTasks_DevelopmentMetrics_DevelopmentMetricsId",
                        column: x => x.DevelopmentMetricsId,
                        principalTable: "DevelopmentMetrics",
                        principalColumn: "DevelopmentMetricsId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_DevelopmentTasks_DevelopmentMetricsId",
                table: "DevelopmentTasks",
                column: "DevelopmentMetricsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DevelopmentTasks");

            migrationBuilder.DropTable(
                name: "DevelopmentMetrics");
        }
    }
}
