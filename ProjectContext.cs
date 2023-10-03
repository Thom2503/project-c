using Microsoft.EntityFrameworkCore;

public class ProjectContext : DbContext
{
	public ProjectContext(DbContextOptions<ProjectContext> options) : base(options) {}

	public DbSet<Accounts> Accounts { get; set; }
}