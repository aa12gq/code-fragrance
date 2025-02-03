import * as vscode from "vscode";

export class TeamStyleViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  // 预设模板定义
  private readonly presetTemplates = {
    strict: {
      name: "严格模式",
      description: "高标准的代码质量要求，适合企业级项目",
      style: {
        freshness: { min: 0.8, max: 1.0, weight: 1.2 },
        woody: { min: 0.7, max: 0.9, weight: 1.2 },
        floral: { min: 0.7, max: 0.9, weight: 1.1 },
        fruity: { min: 0.5, max: 0.8, weight: 0.9 },
        oriental: { min: 0.6, max: 0.8, weight: 1.0 },
        marine: { min: 0.7, max: 0.9, weight: 1.0 },
        metrics: {
          complexity: { min: 0.7, max: 0.9, weight: 1.2 },
          commentRatio: { min: 0.7, max: 1.0, weight: 1.1 },
          functionLength: { min: 0.8, max: 1.0, weight: 1.2 },
          namingConsistency: { min: 0.8, max: 1.0, weight: 1.2 },
          codeRepetition: { min: 0.8, max: 1.0, weight: 1.1 },
          patternUsage: { min: 0.7, max: 0.9, weight: 1.0 },
        },
      },
    },
    balanced: {
      name: "平衡模式",
      description: "在质量和灵活性之间取得平衡，适合大多数项目",
      style: {
        freshness: { min: 0.6, max: 0.9, weight: 1.0 },
        woody: { min: 0.5, max: 0.8, weight: 1.0 },
        floral: { min: 0.4, max: 0.7, weight: 1.0 },
        fruity: { min: 0.3, max: 0.6, weight: 1.0 },
        oriental: { min: 0.4, max: 0.7, weight: 1.0 },
        marine: { min: 0.5, max: 0.8, weight: 1.0 },
        metrics: {
          complexity: { min: 0.4, max: 0.7, weight: 1.0 },
          commentRatio: { min: 0.5, max: 0.8, weight: 1.0 },
          functionLength: { min: 0.6, max: 0.9, weight: 1.0 },
          namingConsistency: { min: 0.7, max: 1.0, weight: 1.0 },
          codeRepetition: { min: 0.6, max: 0.9, weight: 1.0 },
          patternUsage: { min: 0.4, max: 0.7, weight: 1.0 },
        },
      },
    },
    flexible: {
      name: "灵活模式",
      description: "更注重创新和实验性，适合创新项目和原型开发",
      style: {
        freshness: { min: 0.4, max: 0.8, weight: 0.8 },
        woody: { min: 0.3, max: 0.7, weight: 0.8 },
        floral: { min: 0.3, max: 0.6, weight: 0.9 },
        fruity: { min: 0.4, max: 0.8, weight: 1.2 },
        oriental: { min: 0.3, max: 0.6, weight: 0.9 },
        marine: { min: 0.4, max: 0.7, weight: 1.1 },
        metrics: {
          complexity: { min: 0.3, max: 0.6, weight: 0.8 },
          commentRatio: { min: 0.4, max: 0.7, weight: 0.9 },
          functionLength: { min: 0.4, max: 0.8, weight: 0.8 },
          namingConsistency: { min: 0.5, max: 0.8, weight: 0.9 },
          codeRepetition: { min: 0.4, max: 0.7, weight: 0.8 },
          patternUsage: { min: 0.3, max: 0.6, weight: 1.1 },
        },
      },
    },
  };

  // 特征说明
  private readonly featureDescriptions = {
    freshness: {
      title: "清新度",
      description: "评估代码的简洁性和可读性",
      details: [
        "行长度：每行代码不超过80-120个字符",
        "缩进一致性：使用统一的缩进风格（空格或制表符）",
        "空白字符：适当使用空行分隔代码块",
        "简单表达：避免复杂的嵌套和长表达式",
      ],
    },
    woody: {
      title: "木质感",
      description: "评估代码结构的稳定性和可维护性",
      details: [
        "类/函数大小：保持适当的代码单元大小",
        "循环复杂度：控制分支和循环的嵌套深度",
        "依赖管理：合理组织模块依赖关系",
        "错误处理：完善的异常处理机制",
      ],
    },
    floral: {
      title: "花香调",
      description: "评估设计模式的使用和代码优雅度",
      details: [
        "设计模式：恰当使用常见设计模式",
        "SOLID原则：遵循面向对象设计原则",
        "接口设计：清晰的接口定义和职责划分",
        "代码复用：提取共用组件和工具函数",
      ],
    },
    fruity: {
      title: "果香调",
      description: "评估解决方案的创新性和效率",
      details: [
        "算法选择：使用高效的算法和数据结构",
        "创新方案：采用新技术或创新方法",
        "性能优化：注重代码执行效率",
        "资源利用：合理使用系统资源",
      ],
    },
    oriental: {
      title: "东方调",
      description: "评估算法的复杂度和逻辑密度",
      details: [
        "时间复杂度：算法的执行效率评估",
        "空间复杂度：内存使用效率评估",
        "逻辑密度：单位代码的功能密度",
        "代码优化：关键路径的性能优化",
      ],
    },
    marine: {
      title: "海洋调",
      description: "评估接口设计的灵活性和扩展性",
      details: [
        "接口抽象：合理的抽象层次",
        "扩展性：支持未来功能扩展",
        "兼容性：向前/向后兼容设计",
        "可测试性：便于单元测试和集成测试",
      ],
    },
  };

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // 处理来自 Webview 的消息
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "saveTeamStyle":
          await this.saveTeamStyle(message.style);
          break;
        case "requestTeamStyle":
          await this.sendCurrentStyle();
          break;
        case "applyTemplate":
          await this.applyTemplate(message.templateName);
          break;
        case "exportConfig":
          await this.exportConfig();
          break;
        case "importConfig":
          await this.importConfig();
          break;
        case "startWizard":
          await this.startConfigWizard();
          break;
      }
    });

    // 初始化时发送当前配置
    this.sendCurrentStyle();
  }

  private async saveTeamStyle(style: any) {
    try {
      await vscode.workspace
        .getConfiguration("codeFragrance")
        .update("teamStyle", style, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage("团队风格配置已保存！");
    } catch (error) {
      vscode.window.showErrorMessage(`保存配置失败: ${error}`);
    }
  }

  private async sendCurrentStyle() {
    if (this._view) {
      const config = vscode.workspace.getConfiguration("codeFragrance");
      const style = config.get("teamStyle") || this.getDefaultStyle();
      this._view.webview.postMessage({
        command: "updateTeamStyle",
        style,
        templates: this.presetTemplates,
        descriptions: this.featureDescriptions,
      });
    }
  }

  private async applyTemplate(templateName: string) {
    const template =
      this.presetTemplates[templateName as keyof typeof this.presetTemplates];
    if (template) {
      await this.saveTeamStyle(template.style);
      vscode.window.showInformationMessage(`已应用${template.name}模板`);
    }
  }

  private async exportConfig() {
    try {
      const config = vscode.workspace.getConfiguration("codeFragrance");
      const style = config.get("teamStyle");
      if (!style) {
        throw new Error("没有可导出的配置");
      }

      const result = await vscode.window.showSaveDialog({
        filters: { JSON: ["json"] },
        defaultUri: vscode.Uri.file("code-fragrance-config.json"),
      });

      if (result) {
        const configJson = JSON.stringify(style, null, 2);
        await vscode.workspace.fs.writeFile(result, Buffer.from(configJson));
        vscode.window.showInformationMessage("配置已成功导出！");
      }
    } catch (error) {
      vscode.window.showErrorMessage(`导出配置失败: ${error}`);
    }
  }

  private async importConfig() {
    try {
      const result = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: { JSON: ["json"] },
      });

      if (result && result[0]) {
        const configBuffer = await vscode.workspace.fs.readFile(result[0]);
        const configJson = configBuffer.toString();
        const style = JSON.parse(configJson);
        await this.saveTeamStyle(style);
        vscode.window.showInformationMessage("配置已成功导入！");
      }
    } catch (error) {
      vscode.window.showErrorMessage(`导入配置失败: ${error}`);
    }
  }

  private async startConfigWizard() {
    if (this._view) {
      this._view.webview.postMessage({
        command: "startWizard",
        templates: this.presetTemplates,
        descriptions: this.featureDescriptions,
        style: this.getDefaultStyle(),
      });
    }
  }

  private getDefaultStyle() {
    return this.presetTemplates.balanced.style;
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>团队风格配置</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body {
            padding: 20px;
            color: var(--vscode-foreground);
            font-family: var(--vscode-font-family);
          }
          .container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .section {
            margin-bottom: 20px;
            padding: 15px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
          }
          .section-title {
            font-size: 1.1em;
            font-weight: bold;
            margin-bottom: 10px;
            color: var(--vscode-textLink-foreground);
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            margin-bottom: 5px;
          }
          .range-group {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          input[type="number"] {
            width: 80px;
            padding: 4px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
          }
          input[type="range"] {
            flex: 1;
          }
          button {
            padding: 8px 16px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            margin-right: 8px;
          }
          button:hover {
            background: var(--vscode-button-hoverBackground);
          }
          .description {
            margin: 10px 0;
            padding: 10px;
            background: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
          }
          .template-card {
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            cursor: pointer;
          }
          .template-card:hover {
            background: var(--vscode-list-hoverBackground);
          }
          .template-card h3 {
            margin: 0 0 5px 0;
          }
          .template-card p {
            margin: 0;
            color: var(--vscode-descriptionForeground);
          }
          .wizard-step {
            display: none;
          }
          .wizard-step.active {
            display: block;
          }
          .feature-details {
            margin-top: 10px;
            padding: 10px;
            background: var(--vscode-textBlockQuote-background);
            border-radius: 4px;
          }
          .feature-details ul {
            margin: 5px 0;
            padding-left: 20px;
          }
          .chart-container {
            position: relative;
            height: 300px;
            margin: 20px 0;
          }
          .toolbar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
          }
          .preview-code {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            padding: 10px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            white-space: pre;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="toolbar">
            <button onclick="startWizard()">配置向导</button>
            <button onclick="importConfig()">导入配置</button>
            <button onclick="exportConfig()">导出配置</button>
          </div>

          <!-- 配置向导 -->
          <div id="configWizard" class="section" style="display: none;">
            <div class="wizard-step" id="step1">
              <div class="section-title">步骤 1: 选择团队类型</div>
              <div class="description">
                请选择最符合您团队特点的选项，这将帮助我们为您推荐合适的配置模板。
              </div>
              <div class="form-group">
                <label>团队规模</label>
                <select id="teamSize">
                  <option value="small">小型团队 (1-5人)</option>
                  <option value="medium">中型团队 (6-15人)</option>
                  <option value="large">大型团队 (15人以上)</option>
                </select>
              </div>
              <div class="form-group">
                <label>项目类型</label>
                <select id="projectType">
                  <option value="enterprise">企业级应用</option>
                  <option value="startup">创业项目</option>
                  <option value="prototype">原型开发</option>
                </select>
              </div>
              <button onclick="nextStep()">下一步</button>
            </div>

            <div class="wizard-step" id="step2">
              <div class="section-title">步骤 2: 选择基础模板</div>
              <div class="description">
                基于您的选择，以下是推荐的配置模板。您可以选择一个作为起点，稍后可以根据需要调整具体参数。
              </div>
              <div id="templateList">
                <!-- 模板列表将通过 JavaScript 动态生成 -->
              </div>
              <div class="button-group">
                <button onclick="prevStep()">上一步</button>
                <button onclick="nextStep()">下一步</button>
              </div>
            </div>

            <div class="wizard-step" id="step3">
              <div class="section-title">步骤 3: 调整参数</div>
              <div class="description">
                您可以根据团队的具体需求调整各项参数。将鼠标悬停在参数上可以查看详细说明。
              </div>
              <div id="parameterConfig">
                <!-- 参数配置将通过 JavaScript 动态生成 -->
              </div>
              <div class="button-group">
                <button onclick="prevStep()">上一步</button>
                <button onclick="finishWizard()">完成配置</button>
              </div>
            </div>
          </div>

          <!-- 主配置界面 -->
          <div id="mainConfig">
            <div class="section">
              <div class="section-title">预设模板</div>
              <div class="template-list">
                <!-- 模板卡片将通过 JavaScript 动态生成 -->
              </div>
            </div>

            <div class="section">
              <div class="section-title">基础香气特征</div>
              <div id="fragranceConfig">
                <!-- 香气特征配置将通过 JavaScript 动态生成 -->
              </div>
            </div>

            <div class="section">
              <div class="section-title">详细指标</div>
              <div id="metricsConfig">
                <!-- 指标配置将通过 JavaScript 动态生成 -->
              </div>
            </div>

            <div class="section">
              <div class="section-title">可视化预览</div>
              <div class="chart-container">
                <canvas id="fragranceChart"></canvas>
              </div>
              <div class="preview-code">
                <!-- 示例代码预览将通过 JavaScript 动态生成 -->
              </div>
            </div>
          </div>
        </div>

        <script>
          (function() {
            const vscode = acquireVsCodeApi();
            let currentStyle = null;
            let currentStep = 1;
            let fragranceChart = null;
            let presetTemplates = null;
            let featureDescriptions = null;

            // 请求当前配置
            vscode.postMessage({ command: 'requestTeamStyle' });

            // 监听来自扩展的消息
            window.addEventListener('message', event => {
              const message = event.data;
              switch (message.command) {
                case 'updateTeamStyle':
                  currentStyle = message.style;
                  presetTemplates = message.templates;
                  featureDescriptions = message.descriptions;
                  renderConfig();
                  break;
                case 'startWizard':
                  currentStyle = message.style;
                  presetTemplates = message.templates;
                  featureDescriptions = message.descriptions;
                  showWizard();
                  break;
              }
            });

            function renderConfig() {
              if (!currentStyle || !presetTemplates || !featureDescriptions) {
                console.log('等待数据加载...');
                return;
              }

              renderTemplateList();
              renderFragranceConfig();
              renderMetricsConfig();
              updateChart();
            }

            function renderTemplateList() {
              if (!presetTemplates) return;
              const container = document.querySelector('.template-list');
              if (!container) return;

              container.innerHTML = Object.entries(presetTemplates)
                .map(([key, template]) => 
                  \`<div class="template-card" onclick="window.applyTemplate('\${key}')">
                    <h3>\${template.name}</h3>
                    <p>\${template.description}</p>
                  </div>\`
                ).join('');
            }

            function renderFragranceConfig() {
              if (!featureDescriptions || !currentStyle) return;
              const container = document.getElementById('fragranceConfig');
              if (!container) return;

              container.innerHTML = Object.entries(featureDescriptions)
                .map(([key, feature]) => 
                  \`<div class="form-group">
                    <label title="\${feature.description}">\${feature.title}</label>
                    <div class="range-group">
                      <input type="number" 
                             value="\${currentStyle[key].min}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateFeature('\${key}', 'min', this.value)">
                      <input type="range" 
                             value="\${currentStyle[key].min}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateFeature('\${key}', 'min', this.value)">
                      <span>到</span>
                      <input type="number" 
                             value="\${currentStyle[key].max}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateFeature('\${key}', 'max', this.value)">
                      <input type="range" 
                             value="\${currentStyle[key].max}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateFeature('\${key}', 'max', this.value)">
                      <span>权重:</span>
                      <input type="number" 
                             value="\${currentStyle[key].weight}" 
                             min="0" 
                             max="2" 
                             step="0.1"
                             onchange="window.updateFeature('\${key}', 'weight', this.value)">
                    </div>
                    <div class="feature-details">
                      <ul>
                        \${feature.details.map(detail => \`<li>\${detail}</li>\`).join('')}
                      </ul>
                    </div>
                  </div>\`
                ).join('');
            }

            function renderMetricsConfig() {
              if (!currentStyle) return;
              const container = document.getElementById('metricsConfig');
              if (!container) return;

              container.innerHTML = Object.entries(currentStyle.metrics)
                .map(([key, metric]) => 
                  \`<div class="form-group">
                    <label>\${key}</label>
                    <div class="range-group">
                      <input type="number" 
                             value="\${metric.min}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateMetric('\${key}', 'min', this.value)">
                      <input type="range" 
                             value="\${metric.min}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateMetric('\${key}', 'min', this.value)">
                      <span>到</span>
                      <input type="number" 
                             value="\${metric.max}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateMetric('\${key}', 'max', this.value)">
                      <input type="range" 
                             value="\${metric.max}" 
                             min="0" 
                             max="1" 
                             step="0.1"
                             onchange="window.updateMetric('\${key}', 'max', this.value)">
                      <span>权重:</span>
                      <input type="number" 
                             value="\${metric.weight}" 
                             min="0" 
                             max="2" 
                             step="0.1"
                             onchange="window.updateMetric('\${key}', 'weight', this.value)">
                    </div>
                  </div>\`
                ).join('');
            }

            function updateChart() {
              const ctx = document.getElementById('fragranceChart').getContext('2d');
              
              if (fragranceChart) {
                fragranceChart.destroy();
              }

              if (!featureDescriptions) return;

              const labels = Object.keys(featureDescriptions).map(key => featureDescriptions[key].title);
              const data = Object.keys(featureDescriptions).map(key => ({
                min: currentStyle[key].min,
                max: currentStyle[key].max
              }));

              fragranceChart = new Chart(ctx, {
                type: 'radar',
                data: {
                  labels: labels,
                  datasets: [{
                    label: '最小值',
                    data: data.map(d => d.min),
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                  }, {
                    label: '最大值',
                    data: data.map(d => d.max),
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                  }]
                },
                options: {
                  elements: {
                    line: {
                      borderWidth: 3
                    }
                  },
                  scales: {
                    r: {
                      angleLines: {
                        display: true
                      },
                      suggestedMin: 0,
                      suggestedMax: 1
                    }
                  }
                }
              });
            }

            // 将所有函数暴露到全局作用域
            window.updateFeature = function(key, field, value) {
              currentStyle[key][field] = parseFloat(value);
              renderConfig();
            };

            window.updateMetric = function(key, field, value) {
              currentStyle.metrics[key][field] = parseFloat(value);
              renderConfig();
            };

            window.applyTemplate = function(templateName) {
              vscode.postMessage({
                command: 'applyTemplate',
                templateName
              });
            };

            window.startWizard = function() {
              vscode.postMessage({ command: 'startWizard' });
            };

            window.importConfig = function() {
              vscode.postMessage({ command: 'importConfig' });
            };

            window.exportConfig = function() {
              vscode.postMessage({ command: 'exportConfig' });
            };

            window.showWizard = function() {
              document.getElementById('configWizard').style.display = 'block';
              document.getElementById('mainConfig').style.display = 'none';
              currentStep = 1;
              showStep(1);
            };

            window.showStep = function(step) {
              document.querySelectorAll('.wizard-step').forEach(el => {
                el.classList.remove('active');
              });
              document.getElementById(\`step\${step}\`).classList.add('active');
            };

            window.nextStep = function() {
              if (currentStep < 3) {
                currentStep++;
                showStep(currentStep);
              }
            };

            window.prevStep = function() {
              if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
              }
            };

            window.finishWizard = function() {
              document.getElementById('configWizard').style.display = 'none';
              document.getElementById('mainConfig').style.display = 'block';
              saveConfig();
            };

            window.saveConfig = function() {
              vscode.postMessage({
                command: 'saveTeamStyle',
                style: currentStyle
              });
            };
          })();
        </script>
      </body>
      </html>`;
  }
}
