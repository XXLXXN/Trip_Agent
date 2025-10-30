# BaseEs
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

`BaseEs` is an abstract base class for Elasticsearch database services. It inherits from BaseDB to get retry functionality and error handling, while defining the essential interface that all Elasticsearch implementations must provide. All methods are abstract and must be implemented by subclasses to provide specific Elasticsearch functionality.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| No instance parameters | - | - | BaseEs is an abstract base class with no instance parameters |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `create_index()` | Yes | `Any` | Abstract method to create a new index with specified configuration |
| `index()` | Yes | `Any` | Abstract method to index a document in Elasticsearch |
| `update()` | Yes | `Any` | Abstract method to update an existing document |
| `search()` | Yes | `Any` | Abstract method to execute a search query against an index |
| `exists()` | Yes | `bool` | Abstract method to check if a document exists in the specified index |
| `close()` | Yes | `None` | Abstract method to close the Elasticsearch client connection |

## Inherited

Please refer to the [BaseDB](../base_db.md) class for inherited parameters and methods including retry functionality and error handling.

## Usage

```python
Config.set_es_config( 
    {
        "hosts": ["${PROD_ES_HOST_1}", "${PROD_ES_HOST_2}", "${PROD_ES_HOST_3}"],
        "user": "${PROD_ES_USER}",
        "password": "${PROD_ES_PASSWORD}",
    }
)
```