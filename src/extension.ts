import * as vscode from 'vscode';
const iconv = require('iconv-lite');

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('encode-sjis-hex', () => doReplace('sjis'))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('encode-utf8-hex', () => doReplace('utf8'))
	);
}

export function deactivate() {}

function doReplace(encode: string) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}

	const document = editor.document;
	const selection = editor.selection;

	const text = document.getText(selection);

	const replaceText = text.replace(/"([^"]+?)"/g, (sub, ...args) => {
		let s = '';
		for (const b of iconv.encode(args[0], encode)) {
			s += `\\x${b.toString(16).toUpperCase()}`;
		}
		return `"${s}" /* ${args[0]}(${encode}) */ `;
	});

	editor.edit(editBuilder => editBuilder.replace(selection, replaceText));
}
