## 如何安装OxyGent？

### 如何配置环境？
---

我们支持通过`conda`或者`uv`配置环境。

+ 创建运行环境（conda）
```bash
   conda create -n oxy_env python==3.10
   conda activate oxy_env
```
或者（uv）
```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   uv python install 3.10 
   uv venv .venv --python 3.10
   source .venv/bin/activate
```
+ 下载发行包（conda）
```bash
   pip install oxygent
```
或者（uv）
```bash
   uv pip install oxygent
```

### 可不可以使用其他python版本？
---

建议您现在使用**Python 3.10**运行OxyGent。未来版本将兼容最新的python包。

### 是否需要配置其他环境选项？
---

不需要，OxyGent的核心是纯Python。但是为了您的使用体验，建议您先安装好[Node.js](https://nodejs.org)。

### 如何安装OxyGent？
---
```bash
   pip install oxygent # conda
   uv pip install oxygent # uv
```

### 安装OxyGent网速太慢怎么办？
---
您可以使用镜像安装，比如

```bash
uv pip install oxygent -i https://pypi.tuna.tsinghua.edu.cn/simple
```

或者从github直接下载`oxygent`文件夹，放在项目根目录下。（使用本地包需要先安装requirements.txt）

OxyGent会优先引用本地包。


[下一章：运行demo](./0_1_demo.md)
[回到首页](./readme.md)