import * as vscode from "vscode";
import { CodeFragrance } from "../types";

// 语言配置接口
interface LanguageConfig {
  lineComment: string;
  blockCommentStart: string;
  blockCommentEnd: string;
  functionPattern: RegExp;
  classPattern: RegExp;
  variablePattern: RegExp;
  constantPattern: RegExp;
  patterns: {
    singleton: RegExp[];
    factory: RegExp[];
    observer: RegExp[];
    decorator: RegExp[];
  };
}

export class CodeAnalyzer {
  private readonly supportedFileTypes: string[] = [
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".dart",
    ".go",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
    ".rb",
    ".php",
    ".swift",
    ".kt",
    ".rs",
  ];

  constructor() {}

  public async analyzeFile(
    document: vscode.TextDocument
  ): Promise<CodeFragrance> {
    console.log("Starting file analysis");
    const fileName = document.fileName;
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    if (!this.supportedFileTypes.includes(fileExtension)) {
      console.log(`Unsupported file type: ${fileExtension}`);
      return this.getDefaultFragrance();
    }

    try {
      const text = document.getText();
      console.log("Analyzing file content");
      const config = this.getLanguageConfig(fileExtension);

      return {
        freshness: await this.analyzeFreshness(text, config),
        woody: await this.analyzeWoody(text, config),
        floral: await this.analyzeFloral(text, config),
        fruity: await this.analyzeFruity(text, config),
        oriental: await this.analyzeOriental(text, config),
        marine: await this.analyzeMarine(text, config),
        metrics: {
          complexity: await this.calculateComplexity(text, config),
          commentRatio: await this.calculateCommentRatio(text, config),
          functionLength: await this.calculateAverageFunctionLength(
            text,
            config
          ),
          namingConsistency: await this.analyzeNamingConsistency(text, config),
          codeRepetition: await this.analyzeCodeRepetition(text),
          patternUsage: await this.analyzeDesignPatterns(text, config),
        },
      };
    } catch (error) {
      console.error("Analysis error:", error);
      return this.getDefaultFragrance();
    }
  }

  private getLanguageConfig(fileExtension: string): LanguageConfig {
    const defaultConfig: LanguageConfig = {
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      functionPattern:
        /function\s+\w+\s*\([^)]*\)|const\s+\w+\s*=\s*\([^)]*\)\s*=>/g,
      classPattern: /class\s+\w+/g,
      variablePattern: /let\s+[a-z][a-zA-Z0-9]*/g,
      constantPattern: /const\s+[A-Z][A-Z0-9_]*/g,
      patterns: {
        singleton: [/private\s+static\s+\w+\s*=/g],
        factory: [/create\w+/g],
        observer: [/subscribe|notify|observe/g],
        decorator: [/@\w+/g],
      },
    };

    switch (fileExtension) {
      case ".dart":
        return {
          ...defaultConfig,
          functionPattern: /\w+\s+\w+\([^)]*\)\s*{/g,
          variablePattern: /var\s+[a-z][a-zA-Z0-9]*/g,
          constantPattern: /static\s+const\s+[A-Z][A-Z0-9_]*/g,
        };
      case ".go":
        return {
          ...defaultConfig,
          functionPattern: /func\s+\w+\([^)]*\)/g,
          classPattern: /type\s+\w+\s+struct/g,
          variablePattern: /var\s+[a-z][a-zA-Z0-9]*/g,
        };
      case ".py":
        return {
          ...defaultConfig,
          lineComment: "#",
          blockCommentStart: '"""',
          blockCommentEnd: '"""',
          functionPattern: /def\s+\w+\([^)]*\):/g,
          variablePattern: /[a-z][a-z0-9_]*/g,
          constantPattern: /[A-Z][A-Z0-9_]*/g,
        };
      default:
        return defaultConfig;
    }
  }

  private async analyzeFreshness(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    // 分析代码的清新度（简洁性）
    const metrics = [
      await this.calculateLineLength(code), // 行长度适中
      await this.calculateCommentRatio(code, config), // 注释比例合适
      await this.calculateIndentation(code), // 缩进规范
      await this.calculateEmptyLines(code), // 空行使用合理
    ];
    return this.normalizeScore(metrics);
  }

  private async analyzeWoody(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    // 分析代码的木质感（结构稳定性）
    const metrics = [
      await this.calculateComplexity(code, config), // 复杂度适中
      await this.analyzeFunctionStructure(code, config), // 函数结构良好
      await this.analyzeClassStructure(code, config), // 类结构合理
      await this.analyzeNamingConsistency(code, config), // 命名一致性
    ];
    return this.normalizeScore(metrics);
  }

  private async analyzeFloral(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    // 分析代码的花香调（设计模式优雅度）
    const metrics = [
      await this.analyzeDesignPatterns(code, config), // 设计模式使用
      await this.analyzeInterfaceDesign(code), // 接口设计
      await this.analyzeDependencyInjection(code), // 依赖注入
      await this.analyzeModularity(code), // 模块化程度
    ];
    return this.normalizeScore(metrics);
  }

  private async analyzeFruity(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    // 分析代码的果香调（创新解决方案）
    const metrics = [
      await this.analyzeAlgorithmInnovation(code), // 算法创新性
      await this.analyzeFeatureImplementation(code), // 功能实现方式
      await this.analyzeErrorHandling(code), // 错误处理方式
      await this.analyzeOptimizationTechniques(code), // 优化技术
    ];
    return this.normalizeScore(metrics);
  }

  private async analyzeOriental(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    // 分析代码的东方调（算法复杂度）
    const metrics = [
      await this.calculateTimeComplexity(code), // 时间复杂度
      await this.calculateSpaceComplexity(code), // 空间复杂度
      await this.analyzeAlgorithmEfficiency(code), // 算法效率
      await this.analyzeResourceUsage(code), // 资源使用
    ];
    return this.normalizeScore(metrics);
  }

  private async analyzeMarine(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    // 分析代码的海洋调（接口灵活性）
    const metrics = [
      await this.analyzeInterfaceFlexibility(code), // 接口灵活性
      await this.analyzeExtensibility(code), // 可扩展性
      await this.analyzeCompatibility(code), // 兼容性
      await this.analyzeReusability(code), // 可重用性
    ];
    return this.normalizeScore(metrics);
  }

  // 具体分析方法实现
  private async calculateLineLength(code: string): Promise<number> {
    const lines = code.split("\n");
    const avgLength =
      lines.reduce((sum, line) => sum + line.trim().length, 0) / lines.length;
    // 理想行长度为80字符，根据接近程度返回0-1的分数
    return Math.max(0, Math.min(1, 1 - Math.abs(avgLength - 80) / 80));
  }

  private async calculateIndentation(code: string): Promise<number> {
    const lines = code.split("\n");
    let consistentIndentation = 0;
    lines.forEach((line) => {
      const indentMatch = line.match(/^(\s+)/);
      if (indentMatch) {
        const indent = indentMatch[1];
        if (indent.length % 2 === 0 || indent.length % 4 === 0) {
          consistentIndentation++;
        }
      }
    });
    return consistentIndentation / lines.length;
  }

  private async calculateEmptyLines(code: string): Promise<number> {
    const lines = code.split("\n");
    const emptyLines = lines.filter((line) => line.trim() === "").length;
    const ratio = emptyLines / lines.length;
    // 理想空行比例为10-20%
    return Math.max(0, Math.min(1, 1 - Math.abs(ratio - 0.15) / 0.15));
  }

  private async calculateComplexity(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    // 计算圈复杂度
    const functionMatches = code.match(config.functionPattern) || [];
    const branchingStatements = (code.match(/if|while|for|switch|catch/g) || [])
      .length;
    const complexity = branchingStatements / (functionMatches.length || 1);
    // 理想复杂度为5-10
    return Math.max(0, Math.min(1, 1 - Math.abs(complexity - 7.5) / 7.5));
  }

  private async analyzeFunctionStructure(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    const functionMatches = code.match(config.functionPattern) || [];
    const avgFunctionLength = code.length / (functionMatches.length || 1);
    // 理想函数长度为20-50行
    return Math.max(0, Math.min(1, 1 - Math.abs(avgFunctionLength - 35) / 35));
  }

  private async analyzeClassStructure(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    const classMatches = code.match(config.classPattern) || [];
    const methodsPerClass =
      (code.match(config.functionPattern) || []).length /
      (classMatches.length || 1);
    // 理想方法数为5-15个
    return Math.max(0, Math.min(1, 1 - Math.abs(methodsPerClass - 10) / 10));
  }

  private async calculateCommentRatio(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    const lines = code.split("\n");
    const commentLines = lines.filter(
      (line) =>
        line.trim().startsWith(config.lineComment) ||
        line.trim().startsWith(config.blockCommentStart)
    ).length;
    const ratio = commentLines / lines.length;
    // 理想注释比例为15-25%
    return Math.max(0, Math.min(1, 1 - Math.abs(ratio - 0.2) / 0.2));
  }

  private async calculateAverageFunctionLength(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    return 0.5; // 临时实现
  }

  private async analyzeNamingConsistency(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    const variableMatches = code.match(config.variablePattern) || [];
    const constantMatches = code.match(config.constantPattern) || [];
    const functionMatches = code.match(config.functionPattern) || [];

    // 检查命名一致性
    const totalMatches =
      variableMatches.length + constantMatches.length + functionMatches.length;
    const consistentNaming = [
      ...variableMatches,
      ...constantMatches,
      ...functionMatches,
    ].filter((name) => {
      return name.match(/^[a-zA-Z][a-zA-Z0-9]*$/) !== null;
    }).length;

    return consistentNaming / (totalMatches || 1);
  }

  private async analyzeCodeRepetition(code: string): Promise<number> {
    const lines = code.split("\n");
    const uniqueLines = new Set(lines.map((line) => line.trim())).size;
    // 重复度 = 1 - 独特行数/总行数
    const repetitionRate = 1 - uniqueLines / lines.length;
    // 理想重复率应该在0.1-0.2之间
    return Math.max(0, Math.min(1, 1 - Math.abs(repetitionRate - 0.15) / 0.15));
  }

  private async analyzeDesignPatterns(
    code: string,
    config: LanguageConfig
  ): Promise<number> {
    let patternScore = 0;

    // 检查单例模式
    patternScore += config.patterns.singleton.some((pattern) =>
      pattern.test(code)
    )
      ? 0.25
      : 0;

    // 检查工厂模式
    patternScore += config.patterns.factory.some((pattern) =>
      pattern.test(code)
    )
      ? 0.25
      : 0;

    // 检查观察者模式
    patternScore += config.patterns.observer.some((pattern) =>
      pattern.test(code)
    )
      ? 0.25
      : 0;

    // 检查装饰器模式
    patternScore += config.patterns.decorator.some((pattern) =>
      pattern.test(code)
    )
      ? 0.25
      : 0;

    return patternScore;
  }

  private async analyzeInterfaceDesign(code: string): Promise<number> {
    // 检查接口定义的质量
    const interfaceMatches = code.match(/interface\s+\w+/g) || [];
    const methodsInInterfaces = code.match(/\w+\s*:\s*\([^)]*\)\s*=>/g) || [];
    return Math.min(
      1,
      (interfaceMatches.length + methodsInInterfaces.length) / 10
    );
  }

  private async analyzeDependencyInjection(code: string): Promise<number> {
    // 检查依赖注入的使用
    const constructorInjection = (code.match(/constructor\s*\([^)]+\)/g) || [])
      .length;
    const propertyInjection = (code.match(/@Inject\(\)/g) || []).length;
    return Math.min(1, (constructorInjection + propertyInjection) / 5);
  }

  private async analyzeModularity(code: string): Promise<number> {
    // 检查模块化程度
    const exportStatements = (code.match(/export\s+/g) || []).length;
    const importStatements = (code.match(/import\s+/g) || []).length;
    return Math.min(1, (exportStatements + importStatements) / 10);
  }

  private async analyzeAlgorithmInnovation(code: string): Promise<number> {
    // 检查算法创新性（这里只是一个简单的实现）
    const algorithmicPatterns = [
      /recursion/i,
      /dynamic programming/i,
      /optimization/i,
      /cache/i,
      /memoization/i,
    ];

    let innovationScore = 0;
    algorithmicPatterns.forEach((pattern) => {
      if (pattern.test(code)) innovationScore += 0.2;
    });

    return Math.min(1, innovationScore);
  }

  private async analyzeFeatureImplementation(code: string): Promise<number> {
    // 检查功能实现的多样性
    const features = [
      /async|await/,
      /Promise/,
      /try|catch/,
      /map|reduce|filter/,
      /class|extends/,
    ];

    let featureScore = 0;
    features.forEach((feature) => {
      if (feature.test(code)) featureScore += 0.2;
    });

    return Math.min(1, featureScore);
  }

  private async analyzeErrorHandling(code: string): Promise<number> {
    // 检查错误处理的完整性
    const errorHandling = [
      /try\s*{[^}]*}\s*catch/g,
      /throw\s+new\s+Error/g,
      /Promise\.catch/g,
      /error\s*=>/g,
    ];

    let errorScore = 0;
    errorHandling.forEach((pattern) => {
      const matches = code.match(pattern) || [];
      errorScore += matches.length * 0.1;
    });

    return Math.min(1, errorScore);
  }

  private async analyzeOptimizationTechniques(code: string): Promise<number> {
    // 检查代码优化技术的使用
    const optimizations = [
      /cache|memoize/i,
      /performance|optimize/i,
      /benchmark/i,
      /complexity/i,
    ];

    let optimizationScore = 0;
    optimizations.forEach((pattern) => {
      if (pattern.test(code)) optimizationScore += 0.25;
    });

    return Math.min(1, optimizationScore);
  }

  private async calculateTimeComplexity(code: string): Promise<number> {
    // 简单估算时间复杂度
    const loops = (code.match(/for|while/g) || []).length;
    const recursion = (code.match(/function\s+(\w+).*\{.*\1\s*\(.*\)/g) || [])
      .length;
    const complexity = loops + recursion;
    // 理想复杂度应该在2-3之间
    return Math.max(0, Math.min(1, 1 - Math.abs(complexity - 2.5) / 2.5));
  }

  private async calculateSpaceComplexity(code: string): Promise<number> {
    // 简单估算空间复杂度
    const arrayCreation = (
      code.match(/new Array|Array\(|Array\.from|\[\]/g) || []
    ).length;
    const objectCreation = (
      code.match(/new Object|\{\}|new Map|new Set/g) || []
    ).length;
    const complexity = arrayCreation + objectCreation;
    // 理想复杂度应该在3-5之间
    return Math.max(0, Math.min(1, 1 - Math.abs(complexity - 4) / 4));
  }

  private async analyzeAlgorithmEfficiency(code: string): Promise<number> {
    // 检查算法效率
    const inefficientPatterns = [
      /for.*for/g, // 嵌套循环
      /while.*while/g, // 嵌套while
      /recursion.*recursion/g, // 嵌套递归
    ];

    let inefficiencyScore = 0;
    inefficientPatterns.forEach((pattern) => {
      const matches = code.match(pattern) || [];
      inefficiencyScore += matches.length * 0.2;
    });

    return Math.max(0, 1 - Math.min(1, inefficiencyScore));
  }

  private async analyzeResourceUsage(code: string): Promise<number> {
    // 检查资源使用
    const resourcePatterns = [
      /new\s+/g, // 对象创建
      /\[\]/g, // 数组创建
      /Map|Set/g, // 集合使用
      /async|await/g, // 异步资源
    ];

    let resourceScore = 0;
    resourcePatterns.forEach((pattern) => {
      const matches = code.match(pattern) || [];
      resourceScore += matches.length * 0.1;
    });

    return Math.min(1, resourceScore);
  }

  private async analyzeInterfaceFlexibility(code: string): Promise<number> {
    // 检查接口灵活性
    const flexibilityPatterns = [
      /interface/g, // 接口定义
      /extends/g, // 继承
      /implements/g, // 实现
      /generic|<T>/g, // 泛型
    ];

    let flexibilityScore = 0;
    flexibilityPatterns.forEach((pattern) => {
      const matches = code.match(pattern) || [];
      flexibilityScore += matches.length * 0.25;
    });

    return Math.min(1, flexibilityScore);
  }

  private async analyzeExtensibility(code: string): Promise<number> {
    // 检查代码可扩展性
    const extensibilityPatterns = [
      /abstract/g, // 抽象类
      /protected/g, // 保护成员
      /virtual/g, // 虚方法
      /override/g, // 重写
    ];

    let extensibilityScore = 0;
    extensibilityPatterns.forEach((pattern) => {
      const matches = code.match(pattern) || [];
      extensibilityScore += matches.length * 0.25;
    });

    return Math.min(1, extensibilityScore);
  }

  private async analyzeCompatibility(code: string): Promise<number> {
    // 检查代码兼容性
    const compatibilityPatterns = [
      /polyfill/i,
      /fallback/i,
      /support/i,
      /compatibility/i,
    ];

    let compatibilityScore = 0;
    compatibilityPatterns.forEach((pattern) => {
      if (pattern.test(code)) compatibilityScore += 0.25;
    });

    return Math.min(1, compatibilityScore);
  }

  private async analyzeReusability(code: string): Promise<number> {
    // 检查代码可重用性
    const reusabilityPatterns = [
      /export/g, // 导出
      /function/g, // 函数定义
      /class/g, // 类定义
      /interface/g, // 接口定义
    ];

    let reusabilityScore = 0;
    reusabilityPatterns.forEach((pattern) => {
      const matches = code.match(pattern) || [];
      reusabilityScore += matches.length * 0.1;
    });

    return Math.min(1, reusabilityScore);
  }

  private getDefaultFragrance(): CodeFragrance {
    return {
      freshness: 0.5,
      woody: 0.5,
      floral: 0.5,
      fruity: 0.5,
      oriental: 0.5,
      marine: 0.5,
      metrics: {
        complexity: 0.5,
        commentRatio: 0.5,
        functionLength: 0.5,
        namingConsistency: 0.5,
        codeRepetition: 0.5,
        patternUsage: 0.5,
      },
    };
  }

  private normalizeScore(metrics: number[]): number {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((a, b) => a + b, 0);
    return Math.min(Math.max(sum / metrics.length, 0), 1);
  }
}
