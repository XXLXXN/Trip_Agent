# BaseVectorDB

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

`BaseVectorDB` defines the abstract base class for vector database services, inheriting from BaseDB and providing the interface contract for Redis operations.

## Parameters

| Parameter       | Type / Allowed value | Default | Description                                                                     |
| --------------- | -------------------- | ------- | ------------------------------------------------------------------------------- |
| *None declared* | —                    | —       | `BaseVectorDB` adds no fields; it is an abstract interface on top of `BaseDB`.  |

## Methods

| Method                                 | Coroutine （async） | Return Value           | Purpose (concise) |
| -------------------------------------- | ----------------- | ---------------------- | ----------------- |
| `create_space(self, index_name, body)` | Yes               | implementation-defined | in inheritance.   |
| `query_search(self, index_name, body)` | Yes               | implementation-defined | in inheritance.   |

## Inherited

Please refer to the [BaseDB](../base_db.md) class for inherited parameters and methods including retry functionality and error handling.

