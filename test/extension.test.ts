
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import * as copyPaste from 'copy-paste';
import { copyRelativePathOfActiveFile } from '../src/extension';

describe('copy-relative-path', () => {
    let sandbox: sinon.SinonSandbox;
    let copyStub: sinon.SinonStub;

    const createGetPrefixStub = (prefix = undefined) => sandbox.stub(vscode.workspace, 'getConfiguration').returns({
        get: sandbox.stub().withArgs('prefix').returns(prefix)
    });
    const createRootPathStub = (rootPath) => sandbox.stub(vscode.workspace, 'rootPath').get(() => rootPath);
    const createActiveEditorStub = () => sandbox.stub(vscode.window, 'activeTextEditor').get(() => ({ document: { fileName: 'some/other/path' } }));
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        copyStub = sandbox.stub(copyPaste, 'copy');
    });
    afterEach(() => sandbox.restore());

    it('shows an information message if there is no active editor', () => {
        sandbox.stub(vscode.window, 'activeTextEditor').get(() => undefined);
        const showInformationStub: sinon.SinonStub = sandbox.stub(vscode.window, 'showInformationMessage');
        copyRelativePathOfActiveFile();
        assert.equal(showInformationStub.firstCall.args[0], 'Open a file first to copy its path');
    });

    it('uses activeEditor.document.fileName if no workspace.rootpath', () => {
        createActiveEditorStub();
        createRootPathStub(undefined);
        copyRelativePathOfActiveFile();
        assert.equal(copyStub.firstCall.args[0], 'some/other/path');
    });

    it('uses workspace.asRelativePath if workspace.rootpath is present', () => {
        createActiveEditorStub();
        createRootPathStub('/some/even/longer/path/' + 'some/path');
        sandbox.stub(vscode.workspace, 'asRelativePath').returns('some/path');
        copyRelativePathOfActiveFile();
        assert.equal(copyStub.firstCall.args[0], 'some/path');
    });

    it('appends a prefix if the prefix is set', () => {
        createActiveEditorStub();
        createRootPathStub('/some/even/longer/path/' + 'some/path');
        createGetPrefixStub('im a prefix');
        sandbox.stub(vscode.workspace, 'asRelativePath').returns('some/path');
        copyRelativePathOfActiveFile();
        assert.equal(copyStub.firstCall.args[0], 'im a prefix some/path');
    });

})
