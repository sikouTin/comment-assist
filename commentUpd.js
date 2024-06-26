const vscode = require('vscode');

// 更新注释内容函数
async function updateComment(editor) {
    //拓展名取得
    let fileExtension = getActiveEditorFileExtension();

    // 选中的对象
    let selections = editor.selections;

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

    // 全部选中文本
    let lines = selectedText.split('\n');

    // 包含操作对象文本和注释内容的全部文字列
    let commentText = '';

    // 首行缩进（所有需要被注释的内容，全部应用首行缩进）
    let lineIndent = trimEnd(lines[0]).match(/^\s*/)[0];

    if (fileExtension === 'ts') {
        // 对选中的多行文本进行遍历,在每一行开头添加注释和缩进
        for (let i = 0; i < lines.length; i++) {
            let lineText = trimEnd(lines[i]);
            // // 如果已经是注释行
            // if (lineText.trim().startsWith('//')) {
            // // 将注释提到文字列的最前方
            // commentText += `${lineIndent}${transformCommentTs(lineText)}\n`;
            // // 如果不是注释行
            // } else {
            //     commentText += `${lineIndent}// ${lineText}\n`;
            // }
            commentText += `${lineIndent}// ${lineText}\n`;
        }
        commentText = `${lineIndent}// ▼ ${global.keyword1}${global.keyword2}${global.keyword3}DELETE START\n${commentText}${selectedText}\n${lineIndent}// ▲ ${global.keyword1}${global.keyword2}${global.keyword3}DELETE END`;
    } else {
        // 对选中的多行文本进行遍历,在每一行开头添加注释和缩进
        for (let i = 0; i < lines.length; i++) {
            let lineText = trimEnd(lines[i]);
            // 删除末尾的 -->
            lineText = lineText.replace(/\s*-->$/, '');
            lineText = trimEnd(lineText);
            // 如果已经是注释行
            if (lineText.trim().startsWith('<!--')) {
                // 将注释提到文字列的最前方
                commentText += `${lineIndent}${transformCommentHtml(lineText)} -->\n`;
            // 如果不是注释行
            }else {
                commentText += `${lineIndent}<!-- ${lineText} -->\n`;
            }
        }
        commentText = `${lineIndent}<!-- ▼ ${global.keyword1}${global.keyword2}${global.keyword3}DELETE START -->\n${commentText}${selectedText}\n${lineIndent}<!-- ▲ ${global.keyword1}${global.keyword2}${global.keyword3}DELETE END -->`;
    }

    // 插入注释内容
    await editor.edit(editBuilder => {
        editBuilder.replace(editor.selection, commentText);
    });

    // 获取当前光标位置
    let position = editor.selection.active;
    // 获取当前光标所在行的内容
    let line = editor.document.lineAt(position.line - 1);
    // 将光标移动到光标行的上一行的行末
    let newPosition = position.with(position.line - 1, line.text.length);
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

// 去掉末尾的换行符和空白
function trimEnd(str) {
    return str.replace(/[\s\n]+$/, '');
}

// // 将注释符提到文字列的最前方
// function transformCommentTs(comment) {
//     // 使用正则表达式匹配注释的空格或制表符
//     const match = comment.match(/^(\s*)(\/\/)/);
//     if (match) {
//         const spaces = match[1] || ''; // 获取空格或制表符
//         const commentText = match[2]; // 获取注释文本

//         // 将空格或制表符移动到注释后面
//         return `${commentText}${spaces}${comment.substring(match[0].length)}`;
//     } else {
//         // 如果注释没有空格或制表符，则返回原始注释
//         return comment;
//     }
// }
function transformCommentHtml(comment) {
    // 使用正则表达式匹配注释的空格或制表符
    const match = comment.match(/^(\s*)(<!--)/);
    if (match) {
        const spaces = match[1] || ''; // 获取空格或制表符
        const commentText = match[2]; // 获取注释文本

        // 将空格或制表符移动到注释后面
        return `${commentText}${spaces}${comment.substring(match[0].length)}`;
    } else {
        // 如果注释没有空格或制表符，则返回原始注释
        return comment;
    }
}
module.exports = updateComment;
