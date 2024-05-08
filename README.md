# CommentAssistForTsAndHtmlSourceCode

## Features

- 当按下快捷键时,在光标位置插入一段注释。
1. Alt+A : ADD
-    // ▼ Keyword1 Keyword2 Keyword3 ADD START
-    // ▲ Keyword1 Keyword2 Keyword3 ADD END
2. Alt+S : UPDATE
-    // ▼ Keyword1 Keyword2 Keyword3 UPDATE START
-    // ▲ Keyword1 Keyword2 Keyword3 UPDATE END
3. Alt+D : DELETE
-    // ▼ Keyword1 Keyword2 Keyword3 DELETE START
-    // ▲ Keyword1 Keyword2 Keyword3 DELETE END

## Usage

1. 只适配了ts文件和html文件。
2. 如需更改快捷键，可修改keybindings.json文件来实现修改快捷键功能。
-    {
-        "key": "alt+a",
-        "command": "extension.commentAdd",
-        "when": "editorTextFocus"
-    },
-    {
-        "key": "alt+s",
-        "command": "extension.commentUpdate",
-        "when": "editorTextFocus"
-    },
-    {
-        "key": "alt+d",
-        "command": "extension.commentdelete",
-        "when": "editorTextFocus"
-    }
3. 使用前需根据实际需求，设定插件设置中的Keyword1,Keyword2,Keyword3。当任何一个设置被设置为文字列now时，输出系统日期yyyy/MM/dd。