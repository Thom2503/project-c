using Microsoft.EntityFrameworkCore;

public class ProjectContext : DbContext
{
	public ProjectContext(DbContextOptions<ProjectContext> options) : base(options) {}

	public DbSet<Accounts> Accounts { get; set; }
	public DbSet<AgendaItems> AgendaItems { get; set; }
	public DbSet<Rooms> Rooms { get; set; }
	public DbSet<Supplies> Supplies { get; set; }
	public DbSet<News> News { get; set; }
	public DbSet<Events> Events { get; set; }
}