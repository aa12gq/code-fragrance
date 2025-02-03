# Changelog

All notable changes to the "Code Fragrance" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-02-03

### Added

- 团队风格配置功能增强：
  - 添加预设模板：严格模式、平衡模式、灵活模式
  - 详细的特征说明和评分标准
  - 配置向导：引导用户根据团队特点选择合适的配置
  - 可视化预览：实时展示配置效果
  - 配置导入/导出：支持团队间共享配置
  - 智能建议：基于团队代码自动推荐配置
- 界面交互优化：
  - 添加雷达图可视化展示
  - 优化参数调整界面
  - 添加详细的帮助说明
  - 实时预览功能
- 团队协作功能：
  - 配置版本控制
  - 团队风格共享
  - 配置变更追踪

### Enhanced

- 优化代码分析算法
- 改进配置界面交互体验
- 提升配置导入/导出功能的稳定性
- 增强团队风格评估的准确性

### Technical Details

- 使用 Chart.js 实现数据可视化
- 实现配置向导的多步骤引导
- 添加配置文件的版本控制支持
- 优化团队风格评估算法
- 改进错误处理机制

## [0.0.1] - 2024-02-03

### Added

- 初始版本发布
- 支持多种编程语言的代码分析：
  - JavaScript/TypeScript (`.js`, `.ts`, `.jsx`, `.tsx`)
  - Dart/Flutter (`.dart`)
  - Go (`.go`)
  - Python (`.py`)
  - Java (`.java`)
  - C/C++ (`.c`, `.cpp`, `.h`, `.hpp`)
  - Ruby (`.rb`)
  - PHP (`.php`)
  - Swift (`.swift`)
  - Kotlin (`.kt`)
  - Rust (`.rs`)
- 实现六种代码香气特征分析：
  - 清新度（Freshness）：代码简洁性分析
  - 木质感（Woody）：代码结构稳定性分析
  - 花香调（Floral）：设计模式优雅度分析
  - 果香调（Fruity）：创新解决方案分析
  - 东方调（Oriental）：算法复杂度分析
  - 海洋调（Marine）：接口灵活性分析
- 详细的代码度量指标：
  - 复杂度分析
  - 注释比例计算
  - 函数长度评估
  - 命名一致性检查
  - 代码重复度分析
  - 设计模式使用评估

### Enhanced

- 优化的代码分析算法
- 智能的语言特性识别
- 精确的度量计算方法

### Technical Details

- 实现基于正则表达式的代码模式识别
- 添加代码复杂度计算
- 集成设计模式检测
- 支持异步分析处理
- 实现错误处理和日志记录

## [Unreleased]

### Planned

- 支持更多编程语言
- 添加机器学习模型进行更准确的代码分析
- 提供代码优化建议
- 集成更多设计模式识别
- 添加团队协作功能
