using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class ProjectContextFactory : IDesignTimeDbContextFactory<ProjectContext>
{
    public ProjectContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ProjectContext>();
        optionsBuilder.UseSqlite("Data Source=db/project.db");

        return new ProjectContext(optionsBuilder.Options);
    }
}