## 🔥 The Code
```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => next(error));
};
```
### 🧠 1️⃣ What is this?

👉 It’s a function that returns another function

👉 Used to wrap async controllers and catch errors automatically

### 🔍 2️⃣ Break it into Parts
**🔹 Part 1**
```js
const asyncHandler = (fn) =>
```
👉 This function takes another function fn

Example:
```js
asyncHandler(async (req, res) => {
  // your controller
});
```
**🔹 Part 2**
```js
(req, res, next) => { ... }
```
👉 It returns a function that Express understands

Express always expects:
```js
(req, res, next)
```
**🔹 Part 3 (Main Logic)**
```js
Promise.resolve(fn(req, res, next))
```
👉 This runs your async function safely

Even if fn is async:
```js
async function fn() {}
```
It becomes a Promise.

**🔹 Part 4 (Error Handling)**
```js
.catch(error => next(error))
```
👉 If any error happens:<br>
	•	It catches the error<br>
	•	Sends it to Express using next(error)