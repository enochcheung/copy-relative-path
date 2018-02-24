// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { copy } from 'copy-paste';

export const shiftPath = (path: string) => path.split('/').slice(1).join('/');

export const copyRelativePathOfActiveFile = () => {
    const { activeTextEditor, showInformationMessage } = vscode.window;
    if (activeTextEditor) {
        const { workspace: { getConfiguration, rootPath, asRelativePath }, window: { activeTextEditor } } = vscode;

        const config = getConfiguration('relativePath');

        // Copy relative path if a folder is opened, copy the full path otherwise.
        const path = rootPath ? asRelativePath(activeTextEditor.document.uri) : activeTextEditor.document.fileName;

        const isMultiRoot = config.get('multi-root');
        const prefix = config.get('prefix') ? `${config.get('prefix')} ` : '';

        copy(`${prefix}${isMultiRoot ? shiftPath(path) : path}`);
    } else {
        showInformationMessage("Open a file first to copy its path");
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.copyRelativePathOfActiveFile', copyRelativePathOfActiveFile);
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
