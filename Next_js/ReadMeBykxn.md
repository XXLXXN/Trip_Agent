#### **图片**

svg 格式图片请直接放在 public 路径下，不要再嵌套文件夹

其他格式图片新开文件夹排好

#### 你的页面

创建你的页面请在 app 下新开文件夹，下设 page.tsx，在里面放入你的页面，调试请自己写一个跳转至你的页面的按钮

#### AI 辅助

示例 figma mcp token 去 figma 设置

```
"Framelink Figma MCP": {      "command": "cmd",      "args": [        "/c",        "npx",        "-y",        "figma-developer-mcp",        "--figma-api-key=你的apikey",        "--stdio"      ],      "timeout": 300    }
```

示例提示词

```
https://www.figma.com/design/RweCMBtLfqQwbQt1F4vdmV/travel-app?node-id=1-1280&t=o4WcFbKOs2xcg2z5-4

根据figma mcp和上传的图片设计稿，阅读rules.md生成新的E:\work\Trip\Front\f1\my-app\src\app\page.tsx，令其与设计稿一致

{图片}
```
