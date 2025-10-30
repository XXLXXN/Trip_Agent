# VearchDB

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

`VearchDB` implements a comprehensive interface for Vearch vector database operations, providing functionality for vector storage, similarity search, and tool retrieval with embedding support and advanced filtering capabilities.

## Parameters

| Parameter      | Type / Allowed value | Default             | Description                                                                                              |                                                                                              |
| -------------- | -------------------- | ------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `config`       | `VearchConfig`       | must be assigned    | Wrapped configuration object created from the input `config` dict (e.g., URLs, space names, model URL).  |                                                                                              |
| `vearch_tools` | `VectorToolAsync`    | `VectorToolAsync()` | Helper for low-level HTTP calls to Vearch (create/drop space, insert, search).                           |                                                                                              |
| `emb_func`     | \`Callable           | None\`              | `None`                                                                                                   | Async embedding function set when `embedding_model_url` exists in config; otherwise `None`.  |

## Methods

| Method                                                                                                  | Coroutine (async) | Return Value     | Purpose (concise)                                                                                                       |
| ------------------------------------------------------------------------------------------------------- | ----------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `__init__(self, config)`                                                                                | No                | `None`           | Store config, create `vearch_tools`, and set `emb_func` if an embedding URL is provided.                                |
| `create_space(self, space_config)`                                                                      | Yes               | `Dict[str, Any]` | Create a space with a provided schema via master node API.                                                              |
| `create_tool_df_space(self, tool_space_name)`                                                        | Yes               | `Dict[str, Any]` | Create a predefined “tool dataframe” space (properties include `app_name`, `agent_name`, `tool_name`, `vector`, etc.).  |
| `drop_space(self, space_name)`                                                                          | Yes               | `str`            | Drop a space using low-level helper; underlying API returns text.                                                       |
| `query_search(self, space_name, query, retrieval_nums, fields=[], threshold=None)`                      | Yes               | `pd.DataFrame`   | Embed the text query and run vector search; optionally filter by score threshold.                                       |
| `query_search_batch(self, space_name, query_list, retrieval_nums, fields=[])`                           | Yes               | `pd.DataFrame`   | Batch version of semantic search, concatenating results for all queries.                                                |
| `check_space_exist(self, space_name)`                                                                   | Yes               | `bool`           | Check whether a space exists by fetching its info and evaluating the response.                                          |
| `create_vearch_table_by_tool_list(self, tool_list)`                                                     | Yes               | `None`           | System init: embed tool descriptions, ensure single app, clear old rows, and bulk-insert new ones.                      |
| `upload_by_df(self, df)`                                                                                | Yes               | `str`            | Bulk-insert tools from a DataFrame (NDJSON `_bulk`).                                                                    |
| `delete_by_appname(self, app_name)`                                                                     | Yes               | `None`           | Delete all docs for an app by recalling IDs then removing each one.                                                     |
| `recall_by_appname(self, app_name)`                                                                     | Yes               | `list[str]`      | Return all document IDs matching the given app name.                                                                    |
| `tool_retrieval(self, query, app_name=None, agent_name=None, top_k=5, threshold=0.01, *args, **kwargs)` | Yes               | `list[str]`      | Retrieve tool names by hybrid (vector + metadata) search with a score threshold.                                        |
| `single_mode_insert_by_text(self, body, vector_col, sapce_name)`                                        | Yes               | `str`            | Generate an embedding for `body[vector_col]`, attach as `vector`, and insert one record.                                |
| `emb_search(self, emb, retrieval_nums, fields)`                                                         | Yes               | `pd.DataFrame`   | Direct vector search using a provided embedding (helper path).                                                          |
| `filter_and_emb_search(self, emb, retrieval_nums, fields, filter={})`                                   | Yes               | `pd.DataFrame`   | Vector search combined with term filters; returns a DataFrame or empty DataFrame.                                       |
| `search_by_filter(self, space_name, filter)`                                                            | Yes               | `pd.DataFrame`   | Filter-only search (no vector term) and DataFrame conversion of results.                                                |

## Inherited

Please refer to the [BaseVectorDB](./base_vector_db.md) class for inherited parameters and methods including retry functionality and error handling.
