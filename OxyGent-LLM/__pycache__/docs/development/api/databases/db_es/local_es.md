# LocalEs
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

`LocalEs` is a filesystem-based Elasticsearch implementation that simulates a subset of Elasticsearch functionality by persisting documents as JSON files on the local filesystem. It provides robust cross-platform behavior with UTF-8 persistence, atomic file operations, and data safety features. This implementation is designed for development and testing scenarios where a full Elasticsearch instance is not available.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `data_dir` | `str` | `local_es_data` | Directory path for storing JSON files |
| `_locks` | `dict[str, asyncio.Lock]` | `{}` | Dictionary of locks for thread-safe index operations |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `create_index()` | Yes | `dict[str, bool]` | Create a new index with specified configuration |
| `index()` | Yes | `dict[str, str]` | Index a document in the filesystem |
| `update()` | Yes | `dict[str, str]` | Update an existing document |
| `search()` | Yes | `dict` | Execute a search query with basic filtering and sorting |
| `exists()` | Yes | `bool` | Check if a document exists in the specified index |
| `close()` | Yes | `bool` | Close the local ES client (no-op, returns True) |
| `insert()` | Yes | `dict[str, str]` | Internal method to insert or update documents with atomic operations |
| `find_node_safe()` | Yes | `Optional[dict]` | Find a node by node_id with trace_id validation |
| `get_by_node_id()` | Yes | `Optional[dict]` | Get a document by node_id |
| `update_by_node_id()` | Yes | `dict[str, str]` | Update a document by node_id |
| `_index_path()` | No | `str` | Get the file path for an index |
| `_mapping_path()` | No | `str` | Get the file path for index mapping |
| `_write_json_atomic()` | Yes | `None` | Write JSON data to file atomically with UTF-8 encoding |
| `_read_json_safe()` | Yes | `Optional[dict]` | Read JSON file safely with encoding fallback |
| `_build_docs()` | No | `list[dict]` | Static method to build document list from data dictionary |
| `_filter_docs()` | No | `list[dict]` | Filter documents based on query conditions |
| `_sort_docs()` | No | `list[dict]` | Static method to sort documents based on sort specifications |
| `_match_single_condition()` | No | `bool` | Check if a document matches a single query condition |


## Inherited

Please refer to the [BaseEs](./base_es.md) class for inherited abstract method definitions and the [BaseDB](../base_db.md) class for retry functionality and error handling.

 
