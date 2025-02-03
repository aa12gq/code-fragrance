import * as vscode from "vscode";

export class TeamStyleViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

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
      });
    }
  }

  private getDefaultStyle() {
    return {
      freshness: {
        min: 0.6,
        max: 0.9,
        weight: 1,
      },
      woody: {
        min: 0.5,
        max: 0.8,
        weight: 1,
      },
      floral: {
        min: 0.4,
        max: 0.7,
        weight: 1,
      },
      fruity: {
        min: 0.3,
        max: 0.6,
        weight: 1,
      },
      oriental: {
        min: 0.4,
        max: 0.7,
        weight: 1,
      },
      marine: {
        min: 0.5,
        max: 0.8,
        weight: 1,
      },
      metrics: {
        complexity: {
          min: 0.4,
          max: 0.7,
          weight: 1,
        },
        commentRatio: {
          min: 0.5,
          max: 0.8,
          weight: 1,
        },
        functionLength: {
          min: 0.6,
          max: 0.9,
          weight: 1,
        },
        namingConsistency: {
          min: 0.7,
          max: 1.0,
          weight: 1,
        },
        codeRepetition: {
          min: 0.6,
          max: 0.9,
          weight: 1,
        },
        patternUsage: {
          min: 0.4,
          max: 0.7,
          weight: 1,
        },
      },
    };
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>团队风格配置</title>
        <style>
          body {
            padding: 20px;
            color: var(--vscode-foreground);
            font-family: var(--vscode-font-family);
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
        </style>
      </head>
      <body>
        <div class="description">
          配置团队的代码风格标准，设置每个指标的期望范围和权重。
          这些设置将用于评估代码是否符合团队风格。
        </div>

        <div id="styleConfig">
          <!-- 配置内容将通过 JavaScript 动态生成 -->
        </div>

        <button onclick="saveConfig()">保存配置</button>

        <script>
          const vscode = acquireVsCodeApi();
          let currentStyle = null;

          // 请求当前配置
          vscode.postMessage({ command: 'requestTeamStyle' });

          // 监听来自扩展的消息
          window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
              case 'updateTeamStyle':
                currentStyle = message.style;
                renderConfig();
                break;
            }
          });

          function renderConfig() {
            if (!currentStyle) return;

            const container = document.getElementById('styleConfig');
            container.innerHTML = \`
              <div class="section">
                <div class="section-title">基础香气特征</div>
                \${renderFeatureConfig('freshness', '清新度', '代码简洁性')}
                \${renderFeatureConfig('woody', '木质感', '代码结构稳定性')}
                \${renderFeatureConfig('floral', '花香调', '设计模式优雅度')}
                \${renderFeatureConfig('fruity', '果香调', '创新解决方案')}
                \${renderFeatureConfig('oriental', '东方调', '算法复杂度')}
                \${renderFeatureConfig('marine', '海洋调', '接口灵活性')}
              </div>

              <div class="section">
                <div class="section-title">详细指标</div>
                \${renderMetricConfig('complexity', '代码复杂度')}
                \${renderMetricConfig('commentRatio', '注释比率')}
                \${renderMetricConfig('functionLength', '函数长度')}
                \${renderMetricConfig('namingConsistency', '命名一致性')}
                \${renderMetricConfig('codeRepetition', '代码重复度')}
                \${renderMetricConfig('patternUsage', '设计模式使用')}
              </div>
            \`;
          }

          function renderFeatureConfig(key, name, description) {
            const feature = currentStyle[key];
            return \`
              <div class="form-group">
                <label>\${name}（\${description}）</label>
                <div class="range-group">
                  <input type="number" 
                         value="\${feature.min}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateFeature('\${key}', 'min', this.value)">
                  <input type="range" 
                         value="\${feature.min}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateFeature('\${key}', 'min', this.value)">
                  <span>到</span>
                  <input type="number" 
                         value="\${feature.max}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateFeature('\${key}', 'max', this.value)">
                  <input type="range" 
                         value="\${feature.max}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateFeature('\${key}', 'max', this.value)">
                  <span>权重:</span>
                  <input type="number" 
                         value="\${feature.weight}" 
                         min="0" 
                         max="2" 
                         step="0.1"
                         onchange="updateFeature('\${key}', 'weight', this.value)">
                </div>
              </div>
            \`;
          }

          function renderMetricConfig(key, name) {
            const metric = currentStyle.metrics[key];
            return \`
              <div class="form-group">
                <label>\${name}</label>
                <div class="range-group">
                  <input type="number" 
                         value="\${metric.min}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateMetric('\${key}', 'min', this.value)">
                  <input type="range" 
                         value="\${metric.min}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateMetric('\${key}', 'min', this.value)">
                  <span>到</span>
                  <input type="number" 
                         value="\${metric.max}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateMetric('\${key}', 'max', this.value)">
                  <input type="range" 
                         value="\${metric.max}" 
                         min="0" 
                         max="1" 
                         step="0.1"
                         onchange="updateMetric('\${key}', 'max', this.value)">
                  <span>权重:</span>
                  <input type="number" 
                         value="\${metric.weight}" 
                         min="0" 
                         max="2" 
                         step="0.1"
                         onchange="updateMetric('\${key}', 'weight', this.value)">
                </div>
              </div>
            \`;
          }

          function updateFeature(key, field, value) {
            currentStyle[key][field] = parseFloat(value);
            renderConfig();
          }

          function updateMetric(key, field, value) {
            currentStyle.metrics[key][field] = parseFloat(value);
            renderConfig();
          }

          function saveConfig() {
            vscode.postMessage({
              command: 'saveTeamStyle',
              style: currentStyle
            });
          }
        </script>
      </body>
      </html>`;
  }
}
