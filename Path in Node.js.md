## 🧠 1. What is path in Node.js?

👉 path is a core Node.js module used to work with file & folder paths safely
```js
import path from "path";
```
## 🔥 Why do we even need it?

Because paths are different across OS:
```
Windows → C:\users\project
Linux/Mac → /users/project
```
👉 path makes your code:
```
Cross-platform ✅
```
## 🧩 2. Types of Paths (VERY IMPORTANT)

🔹 Relative Path
```
"./public/temp"
```
👉 Means:
```
"Go from where the app is running"
```
❌ Problem:
	•	Can break depending on where you run Node
  
🔹 Absolute Path
```
"/User/yourname/project/public/temp"
```
👉 Full path from root
👉 Always correct ✅

## ⚙️ 3. Most Important Methods

🔹 path.join()
```js
path.join("public", "temp")
```
👉 Output:
```
public/temp
```
👉 Safely joins paths (handles / or \ automatically)

🔹 Real Example
```js
const uploadPath = path.join(process.cwd(), "public", "temp");
```
👉 Output:
```
/project/public/temp
```
🔹 path.resolve()
```js
path.resolve("public", "temp")
```
👉 Converts to absolute path:
```
/project/public/temp
```
🔥 Difference (IMPORTANT)
| Method | Behavior |
| ------ | -------- |
| join() | joins paths |
| resolve() | returns absolute path |

## ⚙️ 4. process.cwd()
```
process.cwd()
```
👉 Returns:
```
Where your app is running from
```
## ⚙️ 5. __dirname (Super Important)

In CommonJS
```js
console.log(__dirname);
```
👉 Folder of current file

**In ES Modules**
```js
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```
## ⚙️ 6. path.basename()
```js
path.basename("/folder/file.txt")
```
👉 Output:
```
file.txt
```
## ⚙️ 7. path.extname()
```js
path.extname("image.jpg")
```
👉 Output:
```
.jpg
```
👉 Useful in multer:
```js
path.extname(file.originalname)
```

## ⚙️ 8. path.dirname()
```js
path.dirname("/folder/file.txt")
```
👉 Output:
```
/folder
```
## ⚙️ 9. path.parse()
```js
path.parse("/folder/file.txt")
```
👉 Output:
```js
{
  root: '/',
  dir: '/folder',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
```
## 🔥 Real Use Case (Multer)
```js
const uploadPath = path.join(process.cwd(), "public", "temp");
```
👉 Safe + absolute + production-ready
