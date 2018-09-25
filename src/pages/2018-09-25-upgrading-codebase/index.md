---
title: Upgrading codebase
date: "2018-09-25T12:00:00.000Z"
---

In the previous post we touched upon migrating React frontend from E6 to TypeScript. In the recent months we have come to realization that our stack has multiple issues which need addressing. The most obious issue is using ASP.NET on the backend which forced us to work on Windows and restricted us from using the latest advances in .NET world.

We are also using Web Jobs instead of Azure Functions which have different issues. They were written as consumers of our internal libraries and had way too much logic instead of being useful functions.

Why were we using old ASP.NET framework? When GigPin was started, .NET Core was at its infancy along with Entity Framework Core. One of the (still) missing features is support for spatial types which GigPin relies on when searching for venues. But since searching for venues is only used in one endpoint we've come to realization that simply porting that code to raw SQL and using query types in EF 2.1 will give us the same result. So that area of the code will be done through classic SQL, everything else will use regular EF.

Additionaly, EF Core doesn't support many-to-many relationships without explicit tables which will have to be modeled separately. It also doesn't support mapping inherited classes to same table, but that can be proxied through the same wrapper EF6 is using anyway.

### Migration

Migrating to "shiny" new tech also brings up possibility to fix some of the backend design issues. But how do we migrate a large app from one tech to another? Let's look at the steps:

1. Copy and adjust data layer
2. Export data from the old database and map it in the new one
3. Copy all service logic and fix differences

That sounds rather straightforward and is done alongside the main project in the separate branch. The goal in the initial phase is not to diverge too much from the original services to prevent refactoring alongside porting. Refactoring is a step that should be covered with tests and having porting issues alongside refactoring issue will slow down development.

### The goal

The goal as always should be to increase the value for our users. One way of doing that is to increase the productivity on the developer's side. If developers can create more features with less issues, that is a win for the both sides. Migrating codebase always brings up the question of why do this, but in this case the increased productivity using the new stack is not just desireable, it is also necessary.

### What's next

In the next posts we'll explore how culture change in the company drives technological change.