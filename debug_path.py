import sys
import os

print("Current working directory:", os.getcwd())
print("Python path:", sys.path)

# 模拟 spot_rec.py 中的路径计算
file_path = "backend/test/spot_rec.py"
abs_file_path = os.path.abspath(file_path)
print("Absolute file path:", abs_file_path)

parent_dir = os.path.dirname(abs_file_path)
print("Parent directory:", parent_dir)

project_root = os.path.dirname(parent_dir)
print("Project root:", project_root)

# 检查backend目录是否存在
backend_path = os.path.join(project_root, "backend")
print("Backend path exists:", os.path.exists(backend_path))

# 检查DataDefinition目录是否存在
datadef_path = os.path.join(backend_path, "DataDefinition")
print("DataDefinition path exists:", os.path.exists(datadef_path))

# 检查DataDefinition.py文件是否存在
datadef_file = os.path.join(datadef_path, "DataDefinition.py")
print("DataDefinition.py exists:", os.path.exists(datadef_file))

# 检查__init__.py文件是否存在
init_file = os.path.join(backend_path, "__init__.py")
print("backend/__init__.py exists:", os.path.exists(init_file))

init_file2 = os.path.join(datadef_path, "__init__.py")
print("backend/DataDefinition/__init__.py exists:", os.path.exists(init_file2))
