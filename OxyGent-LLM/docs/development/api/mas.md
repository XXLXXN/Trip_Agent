# MAS
---
The position of the class is:

```
oxygent/mas.py
```

---

## Introduce

`MAS` (Multi-Agent System) is the main class for the OxyGent Multi-Agent System. It provides a comprehensive framework for managing multiple agents, tools, LLMs, and other components. The MAS handles component registration, database connections, agent organization, and provides both CLI and web service interfaces for interaction.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `name` | `str` | `""` | Identifier for the MAS instance |
| `default_oxy_space` | `list` | `[]` | Built-in core components that are always present |
| `oxy_space` | `list` | `[]` | Initial list of Oxy objects to be registered |
| `oxy_name_to_oxy` | `dict[str, Oxy]` | `{}` | Dictionary mapping Oxy names to Oxy instances |
| `master_agent_name` | `str` | `""` | Name of the master agent |
| `first_query` | `str` | `""` | First query to be displayed in frontend |
| `agent_organization` | `dict` | `[]` | Organization structure of agents |
| `vearch_client` | `Optional[VearchDB]` | `None` | Vector database client |
| `es_client` | `Optional[AsyncElasticsearch]` | `None` | Elasticsearch client |
| `redis_client` | `Optional[JimdbApRedis]` | `None` | Redis client |
| `lock` | `bool` | `False` | Control task execution flow |
| `active_tasks` | `dict` | `{}` | Dictionary to manage active tasks |
| `background_tasks` | `set` | `set()` | Set of background tasks |
| `event_dict` | `dict` | `{}` | Dictionary for event management |
| `message_prefix` | `str` | `"oxygent"` | Prefix for messages |
| `global_data` | `dict` | `{}` | System-wide global data store |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `create()` | Yes | `MAS` | Class method to create and initialize MAS instance |
| `init()` | Yes | `None` | Initialize the MAS with all components and connections |
| `init_db()` | Yes | `None` | Initialize database connections (Elasticsearch, Redis) |
| `init_all_oxy()` | Yes | `None` | Initialize all registered Oxy objects |
| `batch_init_oxy()` | Yes | `None` | Batch initialize oxy objects of specified types |
| `create_vearch_table()` | Yes | `None` | Create Vearch tables for tools |
| `cleanup_servers()` | Yes | `None` | Gracefully shut down remote servers/clients |
| `add_oxy()` | No | `None` | Register a single Oxy object |
| `add_oxy_list()` | No | `None` | Register a list of Oxy objects |
| `call()` | Yes | `Any` | Invoke an Oxy component directly and return its output |
| `chat_with_agent()` | Yes | `OxyResponse` | Forward a chat query into the MAS |
| `send_message()` | Yes | `None` | Push message onto a Redis list for SSE |
| `start_cli_mode()` | Yes | `None` | Launch interactive CLI mode |
| `start_web_service()` | Yes | `None` | Start FastAPI + SSE web service |
| `start_batch_processing()` | Yes | `list` | Execute a batch of queries concurrently |
| `wait_next()` | Yes | `None` | Block execution until lock becomes False |
| `set_oxy_attr()` | No | `bool` | Dynamically mutate a component attribute at runtime |
| `show_banner()` | No | `None` | Display OxyGent startup banner |
| `show_mas_info()` | No | `None` | Display MAS initialization information |
| `show_org()` | No | `None` | Display organization structure |
| `init_global_data()` | No | `None` | Initialize the in-memory global data store |
| `get_global()` | No | `Any` | Get value from global data store |
| `set_global()` | No | `None` | Set value in global data store |
| `is_agent()` | No | `bool` | Check if an oxy name is an agent |
| `init_master_agent_name()` | No | `None` | Initialize the master agent name |
| `init_agent_organization()` | No | `None` | Build agent organization structure |

## Usage

```python
async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_web_service(
            first_query="Hello!" 
        )

async def main():
    async with MAS(oxy_space=oxy_space) as mas:
        await mas.start_cli_mode(
            first_query="Hello!" 
        )
```