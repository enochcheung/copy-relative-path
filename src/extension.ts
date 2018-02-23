'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { copy } from 'copy-paste';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "copy-relative-path" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    const prefix = vscode.workspace.getConfiguration('relativePath').get('prefix');
    let disposable = vscode.commands.registerCommand('extension.copyRelativePathOfActiveFile', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const workspace = vscode.workspace;
            // Copy relative path if a folder is opened, copy the full path otherwise.
            const path = workspace.rootPath ? workspace.asRelativePath(activeEditor.document.uri) : activeEditor.document.fileName;
            copy(`${prefix ? prefix + ' ' : ''}${path}`);
        } else {
            vscode.window.showInformationMessage("Open a file first to copy its path");
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
