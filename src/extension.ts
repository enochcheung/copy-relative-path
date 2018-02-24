'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { copy } from 'copy-paste';

export const copyRelativePathOfActiveFile = () => {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor) {
        const { workspace } = vscode;
        const prefix = workspace.getConfiguration('relativePath').get('prefix');
        // Copy relative path if a folder is opened, copy the full path otherwise.
        const path = workspace.rootPath
            ? workspace.asRelativePath(activeTextEditor.document.uri)
            : activeTextEditor.document.fileName;

        copy(`${prefix ? prefix + ' ' : ''}${path}`);
    } else {
        vscode.window.showInformationMessage("Open a file first to copy its path");
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.copyRelativePathOfActiveFile', copyRelativePathOfActiveFile);
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
