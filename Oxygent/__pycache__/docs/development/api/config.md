# Config
---
The position of the class is:

```
oxygent/config.py
```

---

## Introduce

`Config` is a centralized configuration management class for the OxyGent framework. It provides a hierarchical configuration system that supports environment-specific settings, JSON file loading, and environment variable substitution. The class manages all configuration aspects including app settings, logging, LLM parameters, database connections, server settings, and more.

## Parameters

| Parameter | Type / Allowed value | Default | Description |
| --------- | -------------------- | ------- | ----------- |
| `_env` | `str` | `"default"` | Current environment name |
| `_config` | `dict` | `{}` | Main configuration dictionary containing all settings |

## Configuration Modules

| Module | Description |
| ------ | ----------- |
| `app` | Application name and version settings |
| `env` | Environment file path and override settings |
| `log` | Logging configuration including levels, colors, and output settings |
| `llm` | Large Language Model configuration |
| `cache` | Cache directory settings |
| `message` | Message handling and storage configuration |
| `vearch` | Vector search database configuration |
| `es` | Elasticsearch configuration |
| `redis` | Redis configuration |
| `schema` | Data schema configuration |
| `server` | Web server configuration |
| `agent` | Agent-specific configuration |

## Methods

| Method | Coroutine (async) | Return Value | Purpose |
| ------ | ----------------- | ------------ | ------- |
| `load_from_json()` | No | `None` | Class method to load configuration from JSON file |
| `set_module_config()` | No | `None` | Set configuration for a specific module |
| `get_module_config()` | No | `Any` | Get configuration for a specific module |
| `set_app_config()` | No | `None` | Set application configuration |
| `get_app_config()` | No | `dict` | Get application configuration |
| `set_app_name()` | No | `None` | Set application name |
| `get_app_name()` | No | `str` | Get application name |
| `set_app_version()` | No | `None` | Set application version |
| `get_app_version()` | No | `str` | Get application version |
| `set_env_config()` | No | `None` | Set environment configuration |
| `get_env_config()` | No | `dict` | Get environment configuration |
| `set_env_path()` | No | `None` | Set environment file path |
| `get_env_path()` | No | `str` | Get environment file path |
| `set_env_is_override()` | No | `None` | Set environment override flag |
| `get_env_is_override()` | No | `bool` | Get environment override flag |
| `set_log_config()` | No | `None` | Set logging configuration |
| `get_log_config()` | No | `dict` | Get logging configuration |
| `set_log_path()` | No | `None` | Set log file path |
| `get_log_path()` | No | `str` | Get log file path |
| `set_log_level_root()` | No | `None` | Set root logger level |
| `get_log_level_root()` | No | `str` | Get root logger level |
| `set_log_level_terminal()` | No | `None` | Set terminal logger level |
| `get_log_level_terminal()` | No | `str` | Get terminal logger level |
| `set_log_level_file()` | No | `None` | Set file logger level |
| `get_log_level_file()` | No | `str` | Get file logger level |
| `set_log_color_is_on_background()` | No | `None` | Set background color flag |
| `get_log_color_is_on_background()` | No | `bool` | Get background color flag |
| `set_log_is_bright()` | No | `None` | Set bright color flag |
| `get_log_is_bright()` | No | `bool` | Get bright color flag |
| `set_log_only_message_color()` | No | `None` | Set message-only color flag |
| `get_log_only_message_color()` | No | `bool` | Get message-only color flag |
| `set_log_color_tool_call()` | No | `None` | Set tool call color |
| `get_log_color_tool_call()` | No | `str` | Get tool call color |
| `set_log_color_observation()` | No | `None` | Set observation color |
| `get_log_color_observation()` | No | `str` | Get observation color |
| `set_log_is_detailed_tool_call()` | No | `None` | Set detailed tool call flag |
| `get_log_is_detailed_tool_call()` | No | `bool` | Get detailed tool call flag |
| `set_log_is_detailed_observation()` | No | `None` | Set detailed observation flag |
| `get_log_is_detailed_observation()` | No | `bool` | Get detailed observation flag |
| `set_llm_config()` | No | `None` | Set LLM configuration |
| `get_llm_config()` | No | `dict` | Get LLM configuration |
| `set_cache_config()` | No | `None` | Set cache configuration |
| `get_cache_config()` | No | `dict` | Get cache configuration |
| `set_cache_save_dir()` | No | `None` | Set cache save directory |
| `get_cache_save_dir()` | No | `str` | Get cache save directory |
| `set_message_config()` | No | `None` | Set message configuration |
| `get_message_config()` | No | `dict` | Get message configuration |
| `set_message_is_send_tool_call()` | No | `None` | Set tool call send flag |
| `get_message_is_send_tool_call()` | No | `bool` | Get tool call send flag |
| `set_message_is_send_observation()` | No | `None` | Set observation send flag |
| `get_message_is_send_observation()` | No | `bool` | Get observation send flag |
| `set_message_is_send_think()` | No | `None` | Set think send flag |
| `get_message_is_send_think()` | No | `bool` | Get think send flag |
| `set_message_is_send_answer()` | No | `None` | Set answer send flag |
| `get_message_is_send_answer()` | No | `bool` | Get answer send flag |
| `set_message_is_stored()` | No | `None` | Set message storage flag |
| `get_message_is_stored()` | No | `bool` | Get message storage flag |
| `set_es_config()` | No | `None` | Set Elasticsearch configuration |
| `get_es_config()` | No | `dict` | Get Elasticsearch configuration |
| `set_vearch_config()` | No | `None` | Set Vearch configuration |
| `get_vearch_config()` | No | `dict` | Get Vearch configuration |
| `get_vearch_embedding_model_url()` | No | `str` | Get Vearch embedding model URL |
| `set_redis_config()` | No | `None` | Set Redis configuration |
| `get_redis_config()` | No | `dict` | Get Redis configuration |
| `set_server_config()` | No | `None` | Set server configuration |
| `get_server_config()` | No | `dict` | Get server configuration |
| `set_server_host()` | No | `None` | Set server host |
| `get_server_host()` | No | `str` | Get server host |
| `set_server_port()` | No | `None` | Set server port |
| `get_server_port()` | No | `int` | Get server port |
| `set_server_auto_open_webpage()` | No | `None` | Set auto open webpage flag |
| `get_server_auto_open_webpage()` | No | `bool` | Get auto open webpage flag |
| `set_server_on_latest_webpage()` | No | `None` | Set latest webpage flag |
| `get_server_on_latest_webpage()` | No | `bool` | Get latest webpage flag |
| `set_server_log_level()` | No | `None` | Set server log level |
| `get_server_log_level()` | No | `str` | Get server log level |
| `set_agent_config()` | No | `None` | Set agent configuration |
| `get_agent_config()` | No | `dict` | Get agent configuration |
| `set_agent_prompt()` | No | `None` | Set agent prompt |
| `get_agent_prompt()` | No | `str` | Get agent prompt |
| `set_agent_llm_model()` | No | `None` | Set agent LLM model |
| `get_agent_llm_model()` | No | `str` | Get agent LLM model |
| `set_agent_input_schema()` | No | `None` | Set agent input schema |
| `get_agent_input_schema()` | No | `dict` | Get agent input schema |
| `set_schema_config()` | No | `None` | Set schema configuration |
| `get_schema_config()` | No | `dict` | Get schema configuration |
| `get_shared_data_schema()` | No | `dict` | Get shared data schema |

## Functions

| Function | Coroutine (async) | Return Value | Purpose |
| -------- | ----------------- | ------------ | ------- |
| `deep_update()` | No | `None` | Recursively update a dictionary with another dictionary |
| `replace_env_var()` | No | `Any` | Replace environment variables in configuration values |

## Usage
 
