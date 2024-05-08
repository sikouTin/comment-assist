const vscode = require('vscode');

// 插入注释内容函数
async function insertComment(editor) {

    //拓展名取得
    let fileExtension = getActiveEditorFileExtension();    
    // 选中的对象
    let selections = editor.selections;
    // 选中的全部内容
    let preSelectedText = editor.document.getText(editor.selection); // 注意使用editor.selections会报错

    // 如果没有选中内容
    if (preSelectedText === '') {
        // 将光标移动到当前行最后
        let currentLine = editor.document.lineAt(editor.selection.active.line);
        let endPosition = new vscode.Position(currentLine.range.end.line, currentLine.range.end.character);
        editor.selection = new vscode.Selection(endPosition, endPosition);

        // 然后发送一个Enter键
        await vscode.commands.executeCommand('type', { text: '\n' });

        // 等待一段时间,确保编辑器状态稳定
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // 在此处重新获取选中的文本对象（因为上面有可能发送了Enter键，会导致选中对象发生变化）
    selections = editor.selections;
    // 选中所有选区所在的行的全部内容
    let startLine = selections[0].start.line;
    let endLine = selections[selections.length - 1].end.line;
    let start = new vscode.Position(startLine, 0);
    let end = new vscode.Position(endLine, editor.document.lineAt(endLine).range.end.character);
    editor.selection = new vscode.Selection(start, end);
    
    // 选中的全部内容
    let selectedText = editor.document.getText(editor.selection);

    if (editor) {
        // 执行添加注释的操作
        addComment(editor, fileExtension, selectedText);
    }
}

async function addComment(editor, fileExtension, selectedText) {

    // 匹配第一行，行首的所有空白字符(空格、制表符等)
    let firstlineIndent = '';
    // 匹配最后行，行首的所有空白字符(空格、制表符等)
    let lastlineIndent = '';
    // 全部选中文本
    let lines = selectedText.split('\n');

    // 对选中的多行文本进行遍历,取得第一行和最后一行的缩进
    for (let i = 0; i < lines.length; i++) {
        let lineText = lines[i];
        if (i === 0) {
            firstlineIndent = lineText.match(/^\s*/)[0];
        }
        if (i === lines.length - 1) {
            lastlineIndent = lineText.match(/^\s*/)[0];
        }
    }
    
    // 包含操作对象文本和注释内容的全部文字列
    let commentText = '';

    if (fileExtension === 'ts') {
        // 构造ts文件中要插入的注释内容
        commentText = `${firstlineIndent}// ▼ ${global.keyword1}${global.keyword2}${global.keyword3}ADD START\n${selectedText}\n${lastlineIndent}// ▲ ${global.keyword1}${global.keyword2}${global.keyword3}ADD END`;
    } else {
        // 构造html文件中要插入的注释内容
        commentText = `${firstlineIndent}<!-- ▼ ${global.keyword1}${global.keyword2}${global.keyword3}ADD START -->\n${selectedText}\n${lastlineIndent}<!-- ▲ ${global.keyword1}${global.keyword2}${global.keyword3}ADD END -->`;
    }

    // 插入注释内容
    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, commentText);
    });

    // 获取当前光标位置
    let position = editor.selection.active;
    // 获取当前光标所在行的内容
    let line = editor.document.lineAt(position.line);
    // 将光标移动到第二行注释的行末
    let newPosition = position.with(position.line + 1, line.text.length);
    let newSelection = new vscode.Selection(newPosition, newPosition);
    editor.selection = newSelection;
}

// 获取文件类型
function getActiveEditorFileExtension() {
    let activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        let fileName = activeEditor.document.fileName;
        let fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        return fileExtension;
    }
    return null;
}
module.exports = insertComment;
