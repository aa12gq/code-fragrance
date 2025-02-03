export interface CodeFragrance {
  // 基础特征（0-1之间的值）
  freshness: number;   // 清新调：代码简洁性
  woody: number;       // 木质调：代码结构稳定性
  floral: number;      // 花香调：设计模式优雅度
  fruity: number;      // 果香调：创新解决方案
  oriental: number;    // 东方调：算法复杂度
  marine: number;      // 海洋调：接口灵活性

  // 详细指标
  metrics: {
    complexity: number;         // 代码复杂度
    commentRatio: number;       // 注释比率
    functionLength: number;     // 函数平均长度
    namingConsistency: number;  // 命名一致性
    codeRepetition: number;     // 代码重复度
    patternUsage: number;       // 设计模式使用度
  };
}

export interface TeamStyle {
  namingStyle: 'camelCase' | 'snake_case' | 'PascalCase';
  maxFunctionLength: number;
  minCommentRatio: number;
  maxComplexity: number;
}

export interface FragranceTheme {
  name: string;
  description: string;
  thresholds: {
    freshness: number;
    woody: number;
    floral: number;
    fruity: number;
    oriental: number;
    marine: number;
  };
} 