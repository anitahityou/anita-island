# Welcome to Anita’s home

Anita 的互动 3D 海岛简历：飞机登岛、欢迎对话、作品馆、经历馆、社交客厅、活动相册、中英文与昼夜模式。

在线访问：https://tideline-beach-resume.greatanita.chatgpt.site/

## 本地运行

需要 Python 3；无构建步骤。

```sh
python3 -m http.server 8000 --directory site
```

访问 http://localhost:8000 。请使用 HTTP 服务运行，避免直接打开 HTML。

## 文件结构

- `site/`：当前上线网站源码、Three.js 依赖和照片素材。
- `site/profile.js`：作品、经历、社交与照片数据。
- `site/language.js`：英文文案。
- `site/island.js`：3D 场景和交互。
- `site/nature.js`：植被、岩丘和环境动态。
- `demo/`：演示视频制作实验代码，尚未生成或验证最终带 BGM 成片。

## 静态部署

将 `site/` 目录作为静态站点根目录即可。原托管平台凭证、Git 历史和部署元数据未包含在此备份中。

## 素材说明

人物照片与个人资料属于 Anita；第三方依赖遵循其各自许可证。本项目未自动授予照片或个人资料的再使用许可。
