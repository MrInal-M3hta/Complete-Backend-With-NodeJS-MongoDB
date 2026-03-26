## 🧠 1. What does this mean?
```js
type: mongoose.Schema.Types.ObjectId
```
👉 It means:
```text
"This field will stores ONLY an ObjectId (a reference ID)"
```
## 📦 2. Example
```js
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
```
👉 In database it stores:
```js
{
  title: "React Tutorial",
  owner: "65f1a2b3c4d5e6f7..."  // just ID ✅
}
```

## ❗ Important

👉 It does NOT store full user data ❌
```js
owner: {
  username: "mrinal",
  avatar: "img.jpg"
} ❌
```
## 🧠 3. Why only ID?

**Because MongoDB is NoSQL, and we avoid duplicating data.**

👉 Instead of storing full user everywhere:
```
video → ownerId
comment → ownerId
like → userId
```
✔ Saves memory<br>
✔ Keeps data consistent

## 🔥 4. How do we get full user data then?

**👉 Using populate()**
```js
const video = await Video.findById(id).populate("owner");
```

**Before populate**
```js
{
    title: "React Tutorial",
    owner: "abc123"
}
```
**After populate**
```js
{
  title: "React Tutorial",
  owner: {
    _id: "abc123",
    username: "mrinal",
    avatar: "img.jpg"
  }
}
```
## 🧠 5. Role of ref
```js
ref: "User"
```
👉 Tells Mongoose:
```
"This ObjectId belong to User collection"
```
👉 So populate() knows where to fetch from 

## ⚠️ 6. If you don’t use ref
```js
owner: {
    type: mongoose.Schema.Type.ObjectId
}
```
👉 Then:
```js
.populate("owner") ❌ won’t work
```
***
---
___
## Two ways to store data in MongoDB

👉 1. Embedding (store data inside)
```js
{
  title: "React Tutorial",
  owner: {
    username: "mrinal",
    avatar: "img.jpg"
  }
}
```
👉 2. Referencing (store ObjectId)
```js
{
  title: "React Tutorial",
  owner: ObjectId("abc123")
}
```

## Diffrence between Embedding and Referencing
| Feature | Embedding | Referencing |
| ------- | --------- | ----------- |
| Data sored | Inside document | Separate collection |
| Performance | Fast read ✅ | Extra query ❌ |
| Duplication | Yes | No |
| Updates | Hard | Easy |
| Use case | small/static data | large/dynamic data |
---

<br>

# Aggregation Pipeline

## 🧠 What is Aggregation Pipeline (Real Meaning)

**👉 It is a way to process data step-by-step inside MongoDB**
```
Data → Stage 1 → Stage 2 → Stage 3 → Final Result
```
**👉 Each step = pipeline stage**

### 🧠 Think like this:
```
Factory 🏭

Raw material → machine 1 → machine 2 → machine 3 → final product
```
👉 MongoDB pipeline = same idea

## 📦 Basic Structure
```js
db.collection.aggregate([
  { stage1 },
  { stage2 },
  { stage3 }
]);
```