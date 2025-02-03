import * as vscode from "vscode";
import { CodeAnalyzer } from "./analyzers/CodeAnalyzer";
import { FragranceViewProvider } from "./providers/FragranceViewProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("Code Fragrance is now active!");

  // 创建代码分析器
  const codeAnalyzer = new CodeAnalyzer();

  // 创建视图提供者
  const fragranceViewProvider = new FragranceViewProvider(context.extensionUri);

  // 注册视图
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "code-fragrance.fragranceView",
      fragranceViewProvider
    )
  );

  // 监听文本编辑器变化
  let analyzeTimeout: NodeJS.Timeout | undefined;
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(async (editor) => {
      // 只在视图可见时进行分析
      if (!fragranceViewProvider.isViewVisible()) {
        return;
      }

      if (editor) {
        // 清除之前的定时器
        if (analyzeTimeout) {
          clearTimeout(analyzeTimeout);
        }

        // 延迟分析，避免频繁更新
        analyzeTimeout = setTimeout(async () => {
          try {
            // 分析代码
            const fragrance = await codeAnalyzer.analyzeFile(editor.document);
            fragranceViewProvider.updateFragrance(fragrance);
          } catch (error) {
            // 静默处理错误，避免频繁弹出错误提示
            console.error("Analysis error:", error);
          }
        }, 1000); // 1秒延迟
      }
    })
  );

  // 注册分析当前文件的命令
  context.subscriptions.push(
    vscode.commands.registerCommand("code-fragrance.analyzeFile", async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        try {
          // 显示进度提示
          await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: "分析代码香气",
              cancellable: false,
            },
            async (progress) => {
              progress.report({
                message: "正在分析代码特征...",
                increment: 30,
              });

              // 分析代码
              const fragrance = await codeAnalyzer.analyzeFile(editor.document);

              progress.report({ message: "正在更新视图...", increment: 60 });
              // 更新视图
              fragranceViewProvider.updateFragrance(fragrance);

              progress.report({ message: "分析完成", increment: 100 });

              // 显示成功消息
              vscode.window.showInformationMessage("代码香气分析完成！");
            }
          );
        } catch (error) {
          vscode.window.showErrorMessage(`分析失败: ${error}`);
        }
      } else {
        vscode.window.showWarningMessage("请先打开一个文件！");
      }
    })
  );

  // 注册分析工作区的命令
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-fragrance.analyzeWorkspace",
      async () => {
        if (!vscode.workspace.workspaceFolders) {
          vscode.window.showWarningMessage("请先打开一个工作区！");
          return;
        }

        try {
          await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: "分析工作区代码香气",
              cancellable: true,
            },
            async (_progress, _token) => {
              // TODO: 实现工作区分析逻辑
              vscode.window.showInformationMessage("工作区分析功能即将推出！");
            }
          );
        } catch (error) {
          vscode.window.showErrorMessage(`分析失败: ${error}`);
        }
      }
    )
  );
}

export function deactivate() {}
