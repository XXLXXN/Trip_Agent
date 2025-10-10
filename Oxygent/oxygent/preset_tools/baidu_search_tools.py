import json
from typing import List, Dict

from oxygent.oxy import FunctionHub

try:
    from baidusearch.baidusearch import search  # type: ignore
except ImportError:
    raise ImportError(
        "`baidusearch` not installed. Please install using `pip install baidusearch`")

baidu_search_tools = FunctionHub(name="baidu_search_tools")


@baidu_search_tools.tool(
    description="Search the query to baidu search"
)
def search_baidu(query: str) -> str:
    results = search(keyword=query, num_results=10)

    res: List[Dict[str, str]] = []
    for idx, item in enumerate(results, 1):
        res.append(
            {
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "abstract": item.get("abstract", ""),
                "rank": str(idx),
            }
        )
    return json.dumps(res, indent=2, ensure_ascii=False)
