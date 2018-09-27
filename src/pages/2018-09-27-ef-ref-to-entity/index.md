---
title: Entity Framework - reference to entity
date: "2018-09-27T12:00:00.000Z"
---

When writing reusable service methods to create entities with references to other entities, a foreign key is typically passed to the method.

```csharp
void CreateOrder(int customerId, ...)
{
    var order = new Order
    {
        OwnerId = customerId
    };
}
```

Since entities usually have both the foreign key and the navigational property, setting the foreign key correctly initializes or updates the target entity.

However, if during the transaction we _also_ create the referenced entity, we cannot use above mentioned method since the id is created only when we commit changes to the database.

In that case, we can use the referenced entity directly:

```csharp
void CreateOrder(Customer customer, ...)
{
    var order = new Order
    {
        Owner = customer
    };
}
```

This can lead to inconsistency and possibly duplicate methods. How can we in one parameter specify a new object without an id or just reference an existing one via its id.

Given its `id`, we can create a dummy object that represents the actual one quite easily:

```csharp
var customer = new Customer { Id = id };
context.Customers.Attach(entity);
```

This way no matter if the object is new (created in transaction, no id) or old (simply attached) we can standardise on the second version and pass in explicit objects. So problem solved.

But if we start passing entities around with only its id set properly, we might run into bugs. So we have to somehow abstract _reference_ to an entity. To do this, let's introduce a wrapper class named `Ref<T>` that will actually represent this concept.

```csharp
public class Ref<T>
    where T : class
{
    private static Ref<T> _invalid;
    public static Ref<T> Invalid => _invalid = new Ref<T>(null);

    public T Value { get; }

    public Ref(T t) => Value = t;

    public static implicit operator Ref<T>(T t) => new Ref<T>(t);
    public static implicit operator T(Ref<T> @ref) => @ref.Value;

    public bool IsValid() => Value != null;
}
```

We can now refactor the original method to:

```csharp
void CreateOrder(Ref<Customer> customer, ...)
{
    var order = new Order
    {
        Owner = customer
    };
}
```

This function signature explicitly states that the parameter will only be used as a reference and that we don't expect any of its properties to be initialized. Thus we cover both cases with this approach.