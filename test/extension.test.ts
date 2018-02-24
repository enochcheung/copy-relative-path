
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import * as copyPaste from 'copy-paste';
import { copyRelativePathOfActiveFile, shiftPath } from '../src/extension';

describe('copy-relative-path', () => {
    let sandbox: sinon.SinonSandbox;
    let copyStub: sinon.SinonStub;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        copyStub = sandbox.stub(copyPaste, 'copy');
    });
    afterEach(() => sandbox.restore());

    type ConfigVarOpts = { 'multi-root'?: boolean, prefix?: string }
    const createConfigVars = (opts: ConfigVarOpts) => {
        const get = sandbox.stub()
        for (const configVar in opts) {
            get.withArgs(configVar).returns(opts[configVar as keyof ConfigVarOpts])
        }
        return sandbox.stub(vscode.workspace, 'getConfiguration').returns({ get })
    };

    const createRootPathStub = (rootPath: string | undefined = undefined) => sandbox.stub(vscode.workspace, 'rootPath').get(() => rootPath);

    const createActiveEditorStub = () => sandbox.stub(vscode.window, 'activeTextEditor').get(() => ({ document: { fileName: 'some/other/path' } }));


    it('shows an information message if there is no active editor', () => {
        sandbox.stub(vscode.window, 'activeTextEditor').get(() => undefined);
        const showInformationStub: sinon.SinonStub = sandbox.stub(vscode.window, 'showInformationMessage');
        copyRelativePathOfActiveFile();
        assert.equal(showInformationStub.firstCall.args[0], 'Open a file first to copy its path');
    });

    it('uses activeEditor.document.fileName if no workspace.rootpath', () => {
        createActiveEditorStub();
        createRootPathStub();
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
        createConfigVars({ prefix: 'im a prefix' });
        sandbox.stub(vscode.workspace, 'asRelativePath').returns('some/path');
        copyRelativePathOfActiveFile();
        assert.equal(copyStub.firstCall.args[0], 'im a prefix some/path');
    });

    it('shifts the path in by 1 if isMultiRoot is set', () => {
        createActiveEditorStub();
        createRootPathStub('/some/even/longer/path/' + 'some/path');
        createConfigVars({ 'multi-root': true });
        sandbox.stub(vscode.workspace, 'asRelativePath').returns('some/path');
        copyRelativePathOfActiveFile();
        assert.equal(copyStub.firstCall.args[0], 'path');
    });

    it('handles multi-root with a prefix', () => {
        createActiveEditorStub();
        createRootPathStub('/some/even/longer/path/' + 'some/path');
        createConfigVars({ 'multi-root': true, prefix: 'npm run mocha --' });
        sandbox.stub(vscode.workspace, 'asRelativePath').returns('some/path');
        copyRelativePathOfActiveFile();
        assert.equal(copyStub.firstCall.args[0], 'npm run mocha -- path');
    });

    describe('shiftPath', () => {
        it('removes the first folder from the path', () => {
            const path = 'hi/there/waves'
            assert.equal(shiftPath(path), 'there/waves')
        })
    })
})
