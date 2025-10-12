# BaseRedis

---
The position of the class is:

```markdown
[BaseDB](../base_db.md)
├── [BaseES](../db_es/base_es.md)
    ├── [JesES](../db_es/jes_es.md)
    └── [LocalES](../db_es/local_es.md)
├── [BaseRedis](../db_redis/base_redis.md)
└── [BaseVectorDB](../db_vector/base_vector_db.md)
    └── [VearchDB](../db_vector/vearch_db.md)

[LocalRedis](../db_redis/local_redis.md)
[JimdbApRedis](../db_redis/jimdb_ap_redis.md)
[VectorToolAsync](../db_vector/vearch_db.md)
```

---

## Introduction

`BaseRedis` defines the abstract base class for Key-value database services, inheriting from BaseDB and providing the interface contract for Redis operations.

## Parameters

| Parameter       | Type / Allowed value | Default | Description                                                                                 |
| --------------- | -------------------- | ------- | ------------------------------------------------------------------------------------------- |
| *None declared* | —                    | —       | `BaseRedis` adds no new fields; it defines an abstract Redis interface on top of `BaseDB`.  |

## Methods

| Method                                                  | Coroutine （async） | Return Value           | Purpose (concise) |
| ------------------------------------------------------- | ----------------- | ---------------------- | ----------------- |
| `set(self, key: str, value: str, ex: int = None)`       | Yes               | implementation-defined | in inheritance.   |
| `get(self, key: str)`                                   | Yes               | implementation-defined | in inheritance.   |
| `exists(self, key: str)`                                | Yes               | implementation-defined | in inheritance.   |
| `mset(self, items: dict, ex: int = None)`               | Yes               | implementation-defined | in inheritance.   |
| `mget(self, keys: list)`                                | Yes               | implementation-defined | in inheritance.   |
| `close(self)`                                           | Yes               | implementation-defined | in inheritance.   |
| `delete(self, key: str)`                                | Yes               | implementation-defined | in inheritance.   |
| `lpush(self, key: str, *values: list)`                  | Yes               | implementation-defined | in inheritance.   |
| `brpop(self, key: str, timeout: int = 1)`               | Yes               | implementation-defined | in inheritance.   |
| `lrange(self, key: str, start: int = 0, end: int = -1)` | Yes               | implementation-defined | in inheritance.   |
| `expire(self, key: str, ex: int)`                       | Yes               | implementation-defined | in inheritance.   |
| `llen(self, key: str)`                                  | Yes               | implementation-defined | in inheritance.   |
| `ltrim(self, key: str, start: int, end: int)`           | Yes               | implementation-defined | in inheritance.   |

## Inherited
Please refer to the [BaseDB](../base_db.md) class for inherited parameters and methods.