using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<ProjectContext>(options =>
            options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
    }
	public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
    }
}
