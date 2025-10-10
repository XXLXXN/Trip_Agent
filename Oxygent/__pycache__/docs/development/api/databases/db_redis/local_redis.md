# LocalES

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

`LocalRedis` implements a local file system-based simulation of Key-value database, providing Redis-like functionality for development and testing environments without requiring an actual Elasticsearch server.

## Parameters

| Parameter               | Type / Allowed value | Default | Description                                          |
| ----------------------- | -------------------- | ------- | ---------------------------------------------------- |
| `data`                  | `Dict[str, deque]`   | `{}`    | In-memory store mapping keys to deques for list ops. |
| `expiry`                | `Dict[str, float]`   | `{}`    | Epoch-seconds TTL per key for auto-expiration.       |
| `default_expire_time`   | `int`                | `86400` | Default time-to-live (seconds).                      |
| `default_list_max_size` | `int`                | `10`    | Default maximum list length for new deques.          |


## Methods

| Method                                                                | Coroutine （async） | Return Value                           | Purpose (concise)                                                           |
| --------------------------------------------------------------------- | ----------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| `__init__(self)`                                                      | No                | `None`                                 | Initialize in-memory structures and default TTL/limits.                     |
| `lpush(self, key, *values, ex=None, max_size=None, max_length=20240)` | Yes               | `int`                                  | Push values to the head; enforce TTL, size limit, and type/length handling. |
| `rpop(self, key)`                                                     | Yes               | `str \| bytes \| int \| float \| None` | Pop from the tail after checking expiration.                                |
| `_check_expiry(self, key)`                                            | No                | `None`                                 | Remove a key if its TTL has expired.                                        |
| `close(self)`                                                         | Yes               | `None`                                 | in inheritance                                                              |
