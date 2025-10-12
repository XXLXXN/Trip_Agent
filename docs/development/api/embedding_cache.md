# EmbeddingCache
---
The position of the class is:

```
oxygent/embedding_cache.py
```

---

## Introduce

`EmbeddingCache` is a lightweight, disk-backed cache for text embeddings. The cache stores the MD5 hash of an input string as the key and its corresponding embedding vector as the value. Writing to disk is batched to minimize I/O overhead. It provides both synchronous and asynchronous methods for retrieving cached or freshly computed embeddings.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `save_batch` | `int` | `1000` | Number of new embeddings that can accumulate before the in-memory cache is flushed to disk |
| `file` | `str` | `cache.pkl` | Path to the cache file in the cache directory |
| `count` | `int` | `0` | Counter for new embeddings added since last save |
| `data` | `dict` | `{}` | In-memory cache dictionary storing MD5 keys and embedding values |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `get_md5()` | No | `str` | Static method to return the 32-character MD5 hex digest for a key |
| `load()` | No | `dict` | Load the on-disk cache if it exists, otherwise return an empty dict |
| `save()` | No | `None` | Persist the in-memory cache to disk |
| `is_in()` | No | `bool` | Check if a key exists in the cache |
| `set()` | No | `None` | Set a key-value pair in the cache and trigger save if batch size is reached |
| `get()` | Yes | `np.ndarray` | Return cached or freshly computed embeddings for single key or multiple keys |
| `_get_multiple()` | Yes | `np.ndarray` | Internal method to handle multiple key embedding retrieval |
| `_get_single()` | Yes | `np.ndarray` | Internal method to handle single key embedding retrieval |
| `_get_or_queue()` | Yes | `np.ndarray or None` | Internal method to get cached embedding or queue key for batch processing |
| `_embed_and_cache()` | Yes | `list` | Internal method to compute embeddings for queued texts and cache them |

## Functions

| Function | Coroutine (async) | Return Value | Purpose |
| -------- | ----------------- | ------------ | ------- |
| `get_embedding()` | Yes | `np.ndarray` | Retrieve L2-normalized embeddings for a batch of input texts via HTTP request |


