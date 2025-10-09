# JimdbApRedis

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

`JimdbApRedis` implements a Redis client specifically designed for JimDB (JD's internal
database), providing robust connection handling, automatic retries, and enhanced list operations with size limits and expiration management.

## Parameters

| Parameter               | Type / Allowed value | Default          | Description                                              |
| ----------------------- | -------------------- | ---------------- | -------------------------------------------------------- |
| `host`                  | `str`                | must be assigned | Redis server hostname or IP.                             |
| `port`                  | `int`                | must be assigned | Redis server port.                                       |
| `password`              | `str`                | must be assigned | Authentication password.                                 |
| `redis_pool`            | `Redis \| None`      | `None`           | Connection pool; created via `_get_redis_connection()`.  |
| `default_expire_time`   | `int`                | `86400`          | Default TTL (seconds) used by operations.                |
| `default_list_max_size` | `int`                | `1024`           | Default max list size for list operations.               |

## Methods

| Method                                                                 | Coroutine （async） | Return Value                      | Purpose (concise)                                                      |
| ---------------------------------------------------------------------- | ----------------- | --------------------------------- | ---------------------------------------------------------------------- |
| `__init__(host, port, password)`                                       | No                | `None`                            | Save connection params and create the Redis pool.                      |
| `_get_redis_connection(self)`                                          | No                | `Redis`                           | Build a Redis connection pool (`Redis.from_url`).                      |
| `close(self)`                                                          | Yes               | `None`                            | Close the pool and disconnect all connections.                         |
| `set(self, key, value, ex=86400)`                                      | Yes               | `Optional[bool]`                  | Set key with expiration (default 1 day).                               |
| `get(self, key)`                                                       | Yes               | `Optional[bytes]`                 | Get the value of a key.                                                |
| `exists(self, key)`                                                    | Yes               | `Optional[int]`                   | Check whether a key exists.                                            |
| `mset(self, items, ex=None)`                                           | Yes               | `Optional[bool]`                  | Set multiple keys at once (optional common TTL).                       |
| `mget(self, keys)`                                                     | Yes               | `Optional[List[Optional[bytes]]]` | Get multiple keys at once.                                             |
| `delete(self, key)`                                                    | Yes               | `Optional[int]`                   | Delete a key.                                                          |
| `expire(self, key, ex)`                                                | Yes               | `Optional[bool]`                  | Set a key’s TTL; returns `True` when `ex` is `None`.                   |
| `lpush(self, key, *values, ex=86400, max_size=1024, max_length=20240)` | Yes               | `int`                             | Left-push with value truncation, list trim, and TTL using a pipeline.  |
| `rpop(self, key)`                                                      | Yes               | `Optional[bytes]`                 | Pop the last element of a list.                                        |
| `brpop(self, key, timeout=1)`                                          | Yes               | `Optional[bytes]`                 | Simulated blocking pop (`rpop`, sleep, re-`rpop`) for JimDB.           |
| `lrange(self, key, start=0, end=-1)`                                   | Yes               | `Optional[List[bytes]]`           | Return a slice of a list (LIFO due to `lpush`).                        |
| `lrem(self, key, count, value)`                                        | Yes               | `Optional[int]`                   | Remove elements equal to `value`.                                      |
| `lindex(self, key, index)`                                             | Yes               | `Optional[bytes]`                 | Get list element by index.                                             |
| `llen(self, key)`                                                      | Yes               | `Optional[int]`                   | Get list length.                                                       |
| `ltrim(self, key, start, end)`                                         | Yes               | `Optional[bool]`                  | Trim a list to the given range.                                        |
