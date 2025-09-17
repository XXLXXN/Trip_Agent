import os, json, traceback, subprocess
from adalflow.core.mcp_tool import mcp_session_context, MCPServerStdioParams

async def probe(server_path: str):
    server_abspath = os.path.abspath(server_path)
    params = MCPServerStdioParams(
        command=sys.executable,
        args=["-u", server_abspath],
        env={**os.environ, "PYTHONUNBUFFERED": "1"}
    )
    print("[INFO] python:", sys.executable)
    print("[INFO] server:", server_abspath)
    try:
        async with mcp_session_context(params) as session:
            tools = await session.list_tools()
            names = [t.name for t in tools.tools]
            print("[OK] tools:", names)
    except Exception as e:
        print("[ERR] exception:", type(e).__name__, e)
        print("[TRACEBACK]")
        print(traceback.format_exc())
        # 额外：探针子进程，抓 server.py 的 stdout/stderr
        try:
            proc = subprocess.run(
                [sys.executable, "-u", server_abspath, "--help"],
                text=True, capture_output=True, timeout=5,
                env={**os.environ, "PYTHONUNBUFFERED": "1"},
            )
            print("[PROBE] returncode:", proc.returncode)
            if proc.stdout: print("[PROBE] stdout tail:\n", proc.stdout[-2000:])
            if proc.stderr: print("[PROBE] stderr tail:\n", proc.stderr[-2000:])
        except Exception as ee:
            print("[PROBE] failed:", type(ee).__name__, ee)

# mcp_probe.py 末尾
if __name__ == "__main__":
    import sys, asyncio
    if len(sys.argv) < 2:
        server_path = input("请输入 MCP 服务器文件的绝对路径（如 C:\\path\\to\\server.py）：").strip()
        if not server_path:
            print("未输入路径，退出。")
            sys.exit(1)
    else:
        server_path = sys.argv[1]
    asyncio.run(probe(server_path))