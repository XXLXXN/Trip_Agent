# BaseDB
---
The position of the class is:

```markdown
[BaseDB](../databases/base_db.md)
├── [BaseES](../databases/db_es/base_es.md)
    ├── [JesES](../databases/db_es/jes_es.md)
    └── [LocalES](../databases/db_es/local_es.md)
├── [BaseRedis](../databases/db_redis/base_redis.md)
└── [BaseVectorDB](../tools/base_tools.md)
    └── [VearchDB](../databases/db_vector/vearch_db.md)

[LocalRedis](../databases/db_redis/local_redis.md)
[JimdbApRedis](../databases/db_redis/jimdb_ap_redis.md)
[VectorToolAsync](../databases/db_vector/vearch_db.md)
```

---

## Introduce

`BaseDB` is a base class for database services providing common retry and error handling functionality. This class automatically applies retry decorators to all public methods of its subclasses, ensuring robust database operations with configurable retry policies. It serves as a foundation for implementing reliable database connections and operations across different database types.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| No instance parameters | - | - | BaseDB is a base class with no instance parameters |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `try_decorator()` | No | `Callable` | Static method that creates a retry decorator for database operations |
| `__init_subclass__()` | No | `None` | Class method called when a class is subclassed, automatically applies retry decorator |

## Decorator Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `max_retries` | `int` | `1` | Maximum number of retry attempts |
| `delay_between_retries` | `float` | `0.1` | Delay in seconds between retry attempts |

