---
title: ASP.NET Core - check missing dependencies on startup
date: "2018-10-08T06:00:00.000Z"
---

When using DI without automatic interface/service registrations, it is easy to forget to register a service in `Startup.cs`. This is easy to fix, but sometimes hard to detect. It will be triggered once the code path requiring the newly used service is triggered, but that might be some time after the code is built.

In development mode we might want to test all dependencies as soon as possible. Typically, to test a controller dependencies one just needs to create a controller and see if it fails with an error. Let's see how to do that for a simple web application.

First you need to use logger in `Startup.ConfigureServices`:

```csharp
private readonly ILogger<Startup> _logger;

public Startup(ILogger<Startup> logger, IConfiguration configuration)
{
    Configuration = configuration;
    _logger = logger;
}
```

Next we need to have all controllers available through DI:

```csharp
services
    .AddMvc()
    .AddControllersAsServices()
    .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
```

And now the actual check at the end of `ConfigureServices`:

```csharp
var controllers = Assembly.GetExecutingAssembly().GetTypes()
    .Where(type => typeof(ControllerBase).IsAssignableFrom(type))
    .ToList();

var sp = services.BuildServiceProvider();
foreach (var controllerType in controllers)
{
    _logger.LogInformation($"Found {controllerType.Name}");
    try
    {
        var controller = sp.GetService(controllerType);
    }
    catch (System.Exception ex)
    {
        _logger.LogCritical(ex, $"Cannot create instance of controller {controllerType.FullName}, it is missing some services");
    }
}
```

You should keep this code enabled in development mode at all times. If the error is too 'silent', it is easy to simply crash down the server and force fixing of this issue.

An example error:

```
crit: GigPin.Api2.Startup[0]
      Cannot create instance of controller GigPin.Api2.Controllers.UserController, it is missing some services
System.InvalidOperationException: Unable to resolve service for type 'GigPin.Api2.IAzureQueueService' while attempting to activate 'GigPin.Api2.Controllers.UserController'.
```

In the next post we'll examine how to handle other DI related issues as soon as possible.