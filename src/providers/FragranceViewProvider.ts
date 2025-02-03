import * as vscode from "vscode";
import { CodeFragrance } from "../types";
import { CodeAnalyzer } from "../analyzers/CodeAnalyzer";

export class FragranceViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _isVisible: boolean = false;
  private _analyzer: CodeAnalyzer;

  constructor(private readonly _extensionUri: vscode.Uri) {
    this._analyzer = new CodeAnalyzer();
    console.log("FragranceViewProvider initialized");
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    console.log("Resolving webview view");
    this._view = webviewView;
    this._isVisible = true;

    webviewView.onDidDispose(() => {
      console.log("Webview disposed");
      this._isVisible = false;
    });

    webviewView.onDidChangeVisibility(() => {
      this._isVisible = webviewView.visible;
      console.log("Visibility changed:", this._isVisible);
      if (this._isVisible) {
        this.handleUpdateRequest();
      }
    });

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // 处理来自 Webview 的消息
    webviewView.webview.onDidReceiveMessage(async (message) => {
      console.log("Received message:", message);
      switch (message.command) {
        case "requestUpdate":
          await this.handleUpdateRequest();
          break;
      }
    });

    // 初始化时立即分析当前文件
    this.handleUpdateRequest();
  }

  public isViewVisible(): boolean {
    return this._isVisible;
  }

  // 更新分析结果
  public updateFragrance(fragrance: CodeFragrance) {
    console.log("Updating fragrance in view");
    if (this._view) {
      this._view.webview.postMessage({
        command: "updateFragrance",
        fragrance,
      });
    }
  }

  private _getHtmlForWebview(_webview: vscode.Webview) {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline' https://cdn.jsdelivr.net;">
        <title>代码香气分析</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
        <style>
          body {
            padding: 20px;
            color: var(--vscode-foreground);
            font-family: var(--vscode-font-family);
          }
          .chart-container {
            position: relative;
            margin: auto;
            height: 400px;
            width: 100%;
            display: none;
          }
          .chart-container.active {
            display: block;
          }
          .metrics-container {
            margin-top: 20px;
            display: none;
          }
          .metrics-container.active {
            display: block;
          }
          .metric-item {
            margin: 10px 0;
            padding: 10px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
          }
          .metric-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .metric-value {
            color: var(--vscode-textLink-foreground);
          }
          .fragrance-description {
            margin: 20px 0;
            padding: 15px;
            background: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
          }
          .loading {
            text-align: center;
            padding: 20px;
            display: none;
          }
          .loading.active {
            display: block;
          }
          .no-file {
            text-align: center;
            padding: 20px;
            color: var(--vscode-descriptionForeground);
            display: none;
          }
          .no-file.active {
            display: block;
          }
          .error {
            text-align: center;
            padding: 20px;
            color: var(--vscode-errorForeground);
            display: none;
          }
          .error.active {
            display: block;
          }
        </style>
      </head>
      <body>
        <h2>代码香气分析</h2>
        <div class="fragrance-description">
          通过分析代码特征，将其转化为独特的"香气特征"，帮助您更直观地理解代码质量。
        </div>
        <div class="loading" id="loading">
          正在分析代码，请稍候...
        </div>
        <div class="no-file" id="noFile">
          请打开一个代码文件以查看分析结果
        </div>
        <div class="error" id="error">
          分析过程中出现错误
        </div>
        <div class="chart-container" id="chartContainer">
          <canvas id="fragranceChart"></canvas>
        </div>
        <div class="metrics-container" id="metrics">
          <!-- 指标详情将通过 JavaScript 动态添加 -->
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          let fragranceChart;

          function showLoading() {
            document.getElementById('loading').classList.add('active');
            document.getElementById('noFile').classList.remove('active');
            document.getElementById('error').classList.remove('active');
            document.getElementById('chartContainer').classList.remove('active');
            document.getElementById('metrics').classList.remove('active');
          }

          function showNoFile() {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('noFile').classList.add('active');
            document.getElementById('error').classList.remove('active');
            document.getElementById('chartContainer').classList.remove('active');
            document.getElementById('metrics').classList.remove('active');
          }

          function showError() {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('noFile').classList.remove('active');
            document.getElementById('error').classList.add('active');
            document.getElementById('chartContainer').classList.remove('active');
            document.getElementById('metrics').classList.remove('active');
          }

          function showContent() {
            document.getElementById('loading').classList.remove('active');
            document.getElementById('noFile').classList.remove('active');
            document.getElementById('error').classList.remove('active');
            document.getElementById('chartContainer').classList.add('active');
            document.getElementById('metrics').classList.add('active');
          }

          // 初始化图表
          function initChart() {
            console.log('Initializing chart');
            const ctx = document.getElementById('fragranceChart').getContext('2d');
            fragranceChart = new Chart(ctx, {
              type: 'radar',
              data: {
                labels: ['清新调', '木质调', '花香调', '果香调', '东方调', '海洋调'],
                datasets: [{
                  label: '代码香气特征',
                  data: [0, 0, 0, 0, 0, 0],
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                      stepSize: 0.2
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }
            });
            console.log('Chart initialized');
          }

          // 更新图表数据
          function updateChart(fragrance) {
            console.log('Updating chart with data:', fragrance);
            if (!fragrance) {
              showError();
              return;
            }
            showContent();
            fragranceChart.data.datasets[0].data = [
              fragrance.freshness,
              fragrance.woody,
              fragrance.floral,
              fragrance.fruity,
              fragrance.oriental,
              fragrance.marine
            ];
            fragranceChart.update();
          }

          // 更新指标详情
          function updateMetrics(metrics) {
            console.log('Updating metrics:', metrics);
            if (!metrics) return;
            const container = document.getElementById('metrics');
            container.innerHTML = Object.entries(metrics)
              .map(([key, value]) => \`
                <div class="metric-item">
                  <div class="metric-title">\${formatMetricName(key)}</div>
                  <div class="metric-value">\${(value * 100).toFixed(1)}%</div>
                </div>
              \`).join('');
          }

          // 格式化指标名称
          function formatMetricName(name) {
            return {
              complexity: '代码复杂度',
              commentRatio: '注释比率',
              functionLength: '函数平均长度',
              namingConsistency: '命名一致性',
              codeRepetition: '代码重复度',
              patternUsage: '设计模式使用度'
            }[name] || name;
          }

          // 监听来自扩展的消息
          window.addEventListener('message', event => {
            console.log('Received message from extension:', event.data);
            const message = event.data;
            switch (message.command) {
              case 'updateFragrance':
                if (message.fragrance) {
                  if (Object.values(message.fragrance).every(v => v === 0)) {
                    showNoFile();
                  } else {
                    updateChart(message.fragrance);
                    updateMetrics(message.fragrance.metrics);
                  }
                } else {
                  showError();
                }
                break;
            }
          });

          // 初始化
          document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM content loaded');
            initChart();
            showLoading();
            // 请求初始数据
            vscode.postMessage({ command: 'requestUpdate' });
          });
        </script>
      </body>
      </html>`;
  }

  // 处理更新请求
  private async handleUpdateRequest() {
    console.log("Handling update request");
    const editor = vscode.window.activeTextEditor;
    if (editor && this._view) {
      try {
        console.log("Analyzing file:", editor.document.fileName);
        const fragrance = await this._analyzer.analyzeFile(editor.document);
        console.log("Analysis complete:", fragrance);
        this.updateFragrance(fragrance);
      } catch (error) {
        console.error("Analysis error:", error);
        // 显示错误消息给用户
        vscode.window.showErrorMessage(`分析失败: ${error}`);
      }
    } else {
      console.log("No active editor or view");
      // 显示空状态
      if (this._view) {
        this._view.webview.postMessage({
          command: "updateFragrance",
          fragrance: {
            freshness: 0,
            woody: 0,
            floral: 0,
            fruity: 0,
            oriental: 0,
            marine: 0,
            metrics: {
              complexity: 0,
              commentRatio: 0,
              functionLength: 0,
              namingConsistency: 0,
              codeRepetition: 0,
              patternUsage: 0,
            },
          },
        });
      }
    }
  }
}
