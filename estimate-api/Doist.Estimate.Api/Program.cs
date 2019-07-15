using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Doist.Estimate.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseSentry("https://0d4c1b33a45e403ea9e4023965cebcbb@sentry.io/1499685");
    }
}
