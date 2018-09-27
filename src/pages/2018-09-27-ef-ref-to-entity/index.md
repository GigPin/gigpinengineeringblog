---
title: Entity Framework - reference to entity
date: "2018-09-27T12:00:00.000Z"
---

When writing reusable service methods for creating entities with references to other entities, a foreign key is used for establishing relationship. Let's look at method that creates an order for the specified customer:

```csharp
void CreateOrder(int customerId, ...)
{
    var order = new Order
    {
        OwnerId = customerId
    };
}
```

Since entities usually have both the foreign key and the navigational property, setting the foreign key correctly initializes/updates the target entity.

While it is common that the related entity already exists, this isn't always the case. If we are creating two related entities inside the transaction the above method cannot work. We only get the id once the changes are committed to database. To establish relationships in that case, instead of setting foreign key the entire object is used:

```csharp
void CreateOrder(Customer customer, ...)
{
    var order = new Order
    {
        Owner = customer
    };
}
```

Entity Framework will handle object graph in this case and create objects correctly. Using both approaches can lead to inconsistency and possibly duplicate methods. It would be great if we can use the same method for handling relationships without knowing if the object is created or not.

Let's use the second approach for existing entities. Given its `id`, we can create a dummy object that EF can track and use in this case:

```csharp
var customer = new Customer { Id = id };
context.Customers.Attach(entity);
```

Using this approach it doesn't matter if the object is new (created in transaction, no id) or old (simply attached). We can standardise on the second approach and pass in explicit objects. Appears that the problem is solved.

But if we start passing entities around with only its id set properly (when attached, other properties are default) we might run into subtle bugs. Having `Customer` object doesn't tell you if it is a full object or just a dummy one. We have to somehow abstract a _reference_ to an entity. Let's introduce a wrapper class named `Ref<T>` that will actually represent this concept.

```csharp
public class Ref<T>
    where T : class
{
    public T Value { get; }

    public Ref(T t) => Value = t;

    // Ref<Customer> refCustomer = customer;
    public static implicit operator Ref<T>(T t) => new Ref<T>(t);

    // Customer customer = refCustomer;
    public static implicit operator T(Ref<T> @ref) => @ref.Value;
}
```

We can now refactor the second method to:

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