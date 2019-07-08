using Doist.Estimate.Api.Hubs;
using Doist.Estimate.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Doist.Estimate.Api
{
    public class Startup
    {
        private const string DefaultCorsPolicy = nameof(DefaultCorsPolicy);

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options => options.AddPolicy(DefaultCorsPolicy,
            builder =>
            {
                builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .AllowCredentials();
            }));

            services.AddSignalR();

            services.AddSingleton<ISprintEstimationService, SprintEstimationService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors(DefaultCorsPolicy);
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSignalR(routes =>
            {
                routes.MapHub<SprintEstimationHub>("/sprint_estimation");
            });

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World!");
            });
        }
    }
}
