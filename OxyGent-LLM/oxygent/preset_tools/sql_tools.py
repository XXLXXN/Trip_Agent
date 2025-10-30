import json
import logging
import os
from typing import Optional

from oxygent.oxy import FunctionHub

try:
    from sqlalchemy import Engine, create_engine
    from sqlalchemy.inspection import inspect
    from sqlalchemy.orm import Session, sessionmaker
    from sqlalchemy.sql.expression import text
except ImportError:
    raise ImportError("`sqlalchemy` not installed, please install it.")

logger = logging.getLogger(__name__)


class SQLFunctionHub(FunctionHub):
    db_engine: Optional[Engine] = None
    Session: Optional[sessionmaker[Session]] = None

    class Config:
        arbitrary_types_allowed = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.init_config()

    def init_config(self):
        # "{dialect}://{user}:{password}@{host}:{port}")
        db_url: str = os.getenv("SQL_TOOLS_DB_URL")
        if not db_url:
            raise ValueError("Could not find the db_url from environ")

        engine = create_engine(db_url)
        self.db_engine = engine
        self.Session = sessionmaker(bind=engine)


sql_tools = SQLFunctionHub(name="sql_tools")


@sql_tools.tool(
    description="Use this function to get a list of table names in the database"
)
def list_tables() -> str:
    try:
        inspector = inspect(sql_tools.db_engine)
        table_names = inspector.get_table_names()
        logger.debug(f"get the tables: {table_names}")
        return json.dumps(table_names)
    except Exception as e:
        error_msg = f"Error getting tables: {e}"
        logger.error(error_msg)
        return json.dumps({"error": error_msg})


@sql_tools.tool(
    description="run a sql query and return the result"
)
def run_sql(sql: str, limit: Optional[int] = None) -> str:
    logger.debug(f"Running sql |\n{sql}")

    try:
        with sql_tools.Session() as sess:
            result = sess.execute(text(sql))
            if limit:
                rows = result.fetchmany(limit)
            else:
                rows = result.fetchall()
            return json.dumps(
                [row._asdict() for row in rows],
                ensure_ascii=False
            )
    except Exception as e:
        error_msg = f"Error running query: {e}"
        logger.error(error_msg)
        return json.dumps({"error": error_msg})


@sql_tools.tool(
    description="describe the given table"
)
def describe_tables(table_name: str) -> str:
    try:
        logger.debug(f"Describing table: {table_name}")
        inspector = inspect(sql_tools.db_engine)
        table_schema = inspector.get_columns(table_name)
        result = [
            {"name": column["name"], "type": str(column["type"]),
             "nullable": column["nullable"]}
            for column in table_schema
        ]
        return json.dumps(result)
    except Exception as e:
        error_msg = f"Error getting table schema: {e}"
        logger.error(error_msg)
        return json.dumps({"error": error_msg})
