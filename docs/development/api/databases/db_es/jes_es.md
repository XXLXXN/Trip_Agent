# JesEs
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

## Introduce

`JesEs` is a concrete implementation of the BaseEs abstract class for Elasticsearch database operations. It provides full Elasticsearch functionality using the AsyncElasticsearch client with authentication support. The class implements all required abstract methods from BaseEs and includes additional helper methods for index management and document operations.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `hosts` | `str or list` | Required | Elasticsearch host(s) to connect to |
| `user` | `str` | Required | Username for authentication |
| `password` | `str` | Required | Password for authentication |
| `maxsize` | `int` | `200` | Maximum number of connections in the pool |
| `timeout` | `int` | `20` | Request timeout in seconds |
| `client` | `AsyncElasticsearch` | `None` | Internal Elasticsearch client instance |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `create_index()` | Yes | `dict or None` | Create a new index with specified configuration |
| `index()` | Yes | `dict` | Index a document in Elasticsearch |
| `update()` | Yes | `dict` | Update an existing document |
| `search()` | Yes | `dict` | Execute a search query against an index |
| `exists()` | Yes | `bool` | Check if a document exists in the specified index |
| `close()` | Yes | `None` | Close the Elasticsearch client connection |
| `_index_exists()` | Yes | `bool` | Internal method to check if an index exists |
| `_create_new_index()` | Yes | `dict` | Internal method to create a new index |

## Inherited

Please refer to the [BaseEs](./base_es.md) class for inherited abstract method definitions and the [BaseDB](../base_db.md) class for retry functionality and error handling.

