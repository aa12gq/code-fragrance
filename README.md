# Code Fragrance - 代码香气分析器

一个创新的 VS Code 扩展，通过将代码特征转化为"香气特征"，帮助您更直观地理解和改进代码质量。

## ✨ 特性

### 🌸 六种香调分析

- **清新调**：代码简洁性，包括行长度、缩进一致性和空白字符使用
- **木质调**：代码结构稳定性，评估复杂度和依赖关系
- **花香调**：设计模式优雅度，分析接口设计和封装性
- **果香调**：创新解决方案，评估算法创新性和独特性
- **东方调**：算法复杂度，分析逻辑密度和深度
- **海洋调**：接口灵活性，评估可扩展性和适应性

### 📊 详细指标

- 代码复杂度
- 注释比率
- 函数平均长度
- 命名一致性
- 代码重复度
- 设计模式使用度

### 🎯 主要功能

1. 实时代码分析
2. 可视化雷达图展示
3. 团队风格配置
4. 工作区分析支持

## 🚀 安装

1. 打开 VS Code
2. 按下 `Ctrl+P` / `Cmd+P`
3. 输入 `ext install code-fragrance`
4. 点击安装

## 📖 使用方法

### 分析当前文件

1. 打开任意代码文件
2. 点击活动栏中的烧杯图标
3. 查看代码香气分析结果

### 配置团队风格

1. 打开设置面板
2. 搜索 "Code Fragrance"
3. 根据团队需求调整配置项

### 快捷键

Windows/Linux:

- 分析当前文件：`Alt+Shift+F`
- 分析工作区：`Alt+Shift+W`

macOS:

- 分析当前文件：`Cmd+Shift+F`
- 分析工作区：`Cmd+Shift+W`

## ⚙️ 配置项

```json
{
  "codeFragrance.teamStyle": {
    "namingStyle": "camelCase",
    "maxFunctionLength": 30,
    "minCommentRatio": 0.1,
    "maxComplexity": 10
  }
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](LICENSE) © aa12gq
