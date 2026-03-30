# What is DataBase ?

_An organised collection of data. A method to manipulate and access the data._

## What is MongoDB ?

MongoDB is a NoSQL database that stores
data in flexible, JSON-like documents,
making it easy to scale and handle large
volumes of unstructured data.

## MongoDB Structure

MongoDB stores data in collections and documents.

A collection is a group of MongoDB documents
A document is a set of key-value pairs.

**_MongoDB_**:<br>
**Collection**: A container for document (like a table).<br>
**Document**: A JSON-like record within a collection (like a row).<br>
**Field**: A key-value pair within a document (like a column).

### Schema Flexibility

**_NoSQl_**: Schema-less design allows for easy storage of
diverse and rapidly changing data without needing to
alter the schema.<br>
**_SQL_**: Requires a predefined schema. Altering the schema
(e.g., adding new columns) can be complex and time-
consuming, especially with large datasets.

## Create Database and Collection

_To create a database_: `use database_name`

```
use car_dealership
```

_To create a Collection_: `db.createCollection("myCollection")`

```
db.createCollection("Cars")
```

_To show all databases_: `show dbs`

_To show all collection_: `show collections`

## DROP Database and Collection

_To delete OR drop a database_: db.dropDatabase()

_To delete OR drop a collection_: collection_name.drop()

## CRUD Operations

#### CREATE

**insertOne()**<br>
**insertMany()**

```js
db.Cars.insertOne({
  maker: "Tata",
  model: "Nexon",
  fuel_type: "Petrol",
  transmission: "Automatic",
  engine: {
    type: "Turbocharged",
    cc: 1199,
    torque: "170 Nm",
  },
  features: ["Touchscreen", "Reverse Camera", "Bluetooth Connectivity"],
  sunroof: false,
  airbags: 2,
});
```

```js
db.Cars.insertMany([
  {
    maker: "Hyundai",
    model: "Creta",
    fuel_type: "Diesel",
    transmission: "Manual",
    engine: {
      type: "Naturally Aspirated",
      cc: 1493,
      torque: "250 Nm",
    },
    features: [
      "Sunroof",
      "Leather Seats",
      "Wireless Charging",
      "Ventilated Seats",
      "Bluetooth",
    ],
    sunroof: true,
    airbags: 6,
  },
  {
    maker: "Maruti Suzuki",
    model: "Baleno",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: {
      type: "Naturally Aspirated",
      cc: 1197,
      torque: "113 Nm",
    },
    features: ["Projector Headlamps", "Apple CarPlay", "ABS"],
    sunroof: false,
    airbags: 2,
  },
  {
    maker: "Mahindra",
    model: "XUV500",
    fuel_type: "Diesel",
    transmission: "Manual",
    engine: {
      type: "Turbocharged",
      cc: 2179,
      torque: "360 Nm",
    },
    features: ["All-Wheel Drive", "Navigation System", "Cruise Control"],
    sunroof: true,
    airbags: 6,
  },
  {
    maker: "Honda",
    model: "City",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: {
      type: "Naturally Aspirated",
      cc: 1498,
      torque: "145 Nm",
    },
    features: ["Keyless Entry", "Auto AC", "Multi-angle Rearview Camera"],
    sunroof: false,
    airbags: 4,
  },
]);
```

#### READ

**find()**<br>
**findOne()**

```js
db.Cars.find();
```

```js
db.Cars.findOne();
```

```js
db.Cars.find({}, { maker: 1, model: 1, _id: 0 });
```

```js
// This will filter all data in whose maker is Honda only these collection will shown.
db.Cars.find({ maker: "Honda" });
```

```js
db.Cars.find({ features: "Sunroof" });
```

```js
db.Cars.find("engine.type":"Turbocharge")
```

#### UPDATE

**updateOne()**<br>
**updateMany()**

```js
db.Cars.updateOne(
  { model: "Nexon" }, // This is filter.
  { $set: { colour: "Red" } },
);
```

```js
db.Cars.updateOne(
  { model: "Nexon" }, //Filter to find the specific document.
  { $push: { features: "Heated Seats" } }, // Add new fiels
);
```

```js
db.Cars.updateMany(
  { model: "Nexon" },
  { $set: { fuel_type: "Electric" } }, // update the fuel_type to Electric
);
```

#### DELETE

**deleteOne()**<br>
**deleteMany()**

```js
db.Cars.deleteOne({ fuel_type: "Petrol" });
```

```js
db.Cars.deleteMany({ fuel_type: "Petrol" });
```

## Comparison Operators:

**=** : `$eq`
**!=** : `$ne`
**<** : `$lt`
**>** : `$gt`
**<=** : `$lte`
**>=** : `$gte`
**_Example_** : `{age:{$eq:25}}`

```js
db.Cars.find({ "engine.cc": { $gt: 1400 } });
```

`$in  $nin`

```js
db.Cars.find({ "engine.cc": { $in: [1498, 2179] } });
```

```js
db.Cars.find({ "engine.cc": { $nin: [1498, 2179] } });
```

## Logical Operator

`$and  $or $nor  $not`

```js
db.Cars.find({
  $or: [{ fuel_type: "Diesel" }, { "engine.type": "Turbocharge" }],
});
```

```js
db.Cars.find({
  $and: [
    { fuel_type: "Diesel" },
    { "engine.type": "Turbocharge" },
    { sunroof: true },
  ],
});
```

## Element Operators

**$exists**<br>
&emsp;`{age:{$exists:true}}`

**$type**<br>
Here we can filter the content based on BASON
type like string, bool etc
This can be useful to find field with null values<br>
&emsp;`{name:{$type:"string"}}`

## Array Operator

`$size`<br>
&emsp;Return all documents that match specified array
size<br>
`db.Cars.find({features:{$size:3}})`

`$all`<br
&emsp;Return all documents that match the pattern
(all user with hobbies of play and read)<br>
`db.Cars.find({features:{$all:["Bluethooth"]}})`

## Cursor Method

**Count**<br>
&emsp;`find().count()`<br>
**Sort**<br>
&emsp;`find().sort({"name":1}) -1 is for descending order`<br>
**Limit**<br>
&emsp;`find().limit(2)`<br>
**Skip**<br>
&emsp;`find().skip(3)`

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
db.collection.aggregate([{ stage1 }, { stage2 }, { stage3 }]);
```

### Most commonly used stages in MongoDB aggregation:

- $match<br>
- $group<br>
- $project<br>
- $sort<br>
- $limit<br>
- $unwind<br>
- $lookup<br>
- $addFields<br>
- $count<br>
- $skip

All these methods are used on this JSON document:

```js
db.Cars.insertMany([
  {
    maker: "Hyundai",
    model: "Creta",
    fuel_type: "Diesel",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 1493, torque: "250 Nm" },
    features: [
      "Sunroof",
      "Leather Seats",
      "Wireless Charging",
      "Ventilated Seats",
      "Bluetooth",
    ],
    sunroof: true,
    airbags: 6,
    price: 1500000,
    owners: [
      { name: "Raju", purchase_date: "2021-03-15", location: "Mumbai" },
      { name: "Shyam", purchase_date: "2023-01-10", location: "Delhi" },
    ],
    service_history: [
      { date: "2022-04-10", service_type: "Oil Change", cost: 5000 },
      { date: "2023-07-18", service_type: "Brake Replacement", cost: 12000 },
    ],
  },
  {
    maker: "Maruti Suzuki",
    model: "Baleno",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Naturally Aspirated", cc: 1197, torque: "113 Nm" },
    features: ["Projector Headlamps", "Apple CarPlay", "ABS"],
    sunroof: false,
    airbags: 2,
    price: 800000,
    owners: [
      { name: "Baburao", purchase_date: "2020-08-22", location: "Pune" },
    ],
    service_history: [
      { date: "2021-05-12", service_type: "Tire Rotation", cost: 2000 },
      { date: "2022-11-05", service_type: "Battery Replacement", cost: 7000 },
    ],
  },
  {
    maker: "Mahindra",
    model: "XUV500",
    fuel_type: "Diesel",
    transmission: "Manual",
    engine: { type: "Turbocharged", cc: 2179, torque: "360 Nm" },
    features: ["All-Wheel Drive", "Navigation System", "Cruise Control"],
    sunroof: true,
    airbags: 6,
    price: 1800000,
    owners: [
      { name: "Raju", purchase_date: "2019-11-30", location: "Bangalore" },
      { name: "Shyam", purchase_date: "2022-02-15", location: "Hyderabad" },
    ],
    service_history: [
      { date: "2021-02-25", service_type: "Transmission Repair", cost: 35000 },
      { date: "2023-03-10", service_type: "Tire Replacement", cost: 15000 },
    ],
  },
  {
    maker: "Honda",
    model: "City",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Naturally Aspirated", cc: 1498, torque: "145 Nm" },
    features: ["Keyless Entry", "Auto AC", "Multi-angle Rearview Camera"],
    sunroof: false,
    airbags: 4,
    price: 1200000,
    owners: [
      { name: "Baburao", purchase_date: "2020-05-20", location: "Chennai" },
    ],
    service_history: [
      { date: "2021-08-10", service_type: "Oil Change", cost: 5000 },
      { date: "2022-10-25", service_type: "Brake Replacement", cost: 10000 },
    ],
  },
  {
    maker: "Tata",
    model: "Nexon",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Turbocharged", cc: 1199, torque: "170 Nm" },
    features: ["Touchscreen", "Reverse Camera", "Bluetooth Connectivity"],
    sunroof: false,
    airbags: 2,
    price: 1100000,
    owners: [
      { name: "Raju", purchase_date: "2021-12-05", location: "Kolkata" },
    ],
    service_history: [
      { date: "2022-12-01", service_type: "Oil Change", cost: 6000 },
      { date: "2023-06-15", service_type: "Tire Rotation", cost: 3000 },
    ],
  },
  {
    maker: "Hyundai",
    model: "Venue",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Turbocharged", cc: 998, torque: "172 Nm" },
    features: [
      "Sunroof",
      "Touchscreen Infotainment",
      "Keyless Entry",
      "Rear Camera",
      "Cruise Control",
    ],
    sunroof: true,
    airbags: 4,
    price: 1200000,
    owners: [
      { name: "Amit", purchase_date: "2020-05-20", location: "Bangalore" },
      { name: "Priya", purchase_date: "2022-11-05", location: "Chennai" },
    ],
    service_history: [
      { date: "2021-07-15", service_type: "Oil Change", cost: 4000 },
      { date: "2023-03-22", service_type: "Tire Replacement", cost: 8000 },
    ],
  },
  {
    maker: "Hyundai",
    model: "i20",
    fuel_type: "Petrol",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 1197, torque: "114 Nm" },
    features: [
      "Apple CarPlay",
      "ABS",
      "Projector Headlamps",
      "Wireless Charging",
    ],
    sunroof: false,
    airbags: 2,
    price: 900000,
    owners: [{ name: "Rohit", purchase_date: "2021-06-15", location: "Delhi" }],
    service_history: [
      { date: "2022-09-10", service_type: "Battery Replacement", cost: 7000 },
      { date: "2023-05-25", service_type: "Tire Rotation", cost: 2500 },
    ],
  },
  {
    maker: "Maruti Suzuki",
    model: "Swift",
    fuel_type: "Petrol",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 1198, torque: "113 Nm" },
    features: [
      "Touchscreen Infotainment",
      "ABS",
      "Keyless Entry",
      "Rear Parking Sensors",
    ],
    sunroof: false,
    airbags: 2,
    price: 750000,
    owners: [
      { name: "Vijay", purchase_date: "2019-03-20", location: "Hyderabad" },
    ],
    service_history: [
      { date: "2020-05-18", service_type: "Oil Change", cost: 3000 },
      { date: "2022-08-10", service_type: "Brake Replacement", cost: 5000 },
    ],
  },
  {
    maker: "Tata",
    model: "Harrier",
    fuel_type: "Diesel",
    transmission: "Automatic",
    engine: { type: "Turbocharged", cc: 1956, torque: "350 Nm" },
    features: [
      "Panoramic Sunroof",
      "Leather Upholstery",
      "Terrain Response System",
      "Auto-Dimming IRVM",
    ],
    sunroof: true,
    airbags: 6,
    price: 2000000,
    owners: [
      { name: "Deepak", purchase_date: "2022-01-10", location: "Mumbai" },
    ],
    service_history: [
      { date: "2022-10-15", service_type: "Transmission Repair", cost: 45000 },
      { date: "2023-04-20", service_type: "Brake Replacement", cost: 15000 },
    ],
  },
  {
    maker: "Honda",
    model: "Amaze",
    fuel_type: "Diesel",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 1498, torque: "200 Nm" },
    features: [
      "Keyless Entry",
      "Auto AC",
      "Rear Parking Camera",
      "Cruise Control",
    ],
    sunroof: false,
    airbags: 4,
    price: 1000000,
    owners: [
      { name: "Anil", purchase_date: "2020-11-25", location: "Kolkata" },
    ],
    service_history: [
      { date: "2021-12-10", service_type: "Oil Change", cost: 4500 },
      { date: "2022-08-15", service_type: "Tire Rotation", cost: 2500 },
    ],
  },
  {
    maker: "Tata",
    model: "Nexon EV",
    fuel_type: "Electric",
    transmission: "Automatic",
    engine: {
      type: "Electric Motor",
      battery_capacity: "30.2 kWh",
      torque: "245 Nm",
    },
    features: [
      "Touchscreen Infotainment",
      "Wireless Charging",
      "Connected Car Tech",
      "Sunroof",
    ],
    sunroof: true,
    airbags: 6,
    price: 1400000,
    owners: [
      { name: "Vikas", purchase_date: "2021-05-20", location: "Bangalore" },
    ],
    service_history: [
      { date: "2022-06-10", service_type: "Battery Check", cost: 0 },
      { date: "2023-03-15", service_type: "Tire Rotation", cost: 3000 },
    ],
  },
  {
    maker: "Hyundai",
    model: "Kona Electric",
    fuel_type: "Electric",
    transmission: "Automatic",
    engine: {
      type: "Electric Motor",
      battery_capacity: "39.2 kWh",
      torque: "395 Nm",
    },
    features: ["Wireless Charging", "Ventilated Seats", "Sunroof", "Auto AC"],
    sunroof: true,
    airbags: 6,
    price: 2300000,
    owners: [
      { name: "Sneha", purchase_date: "2022-01-15", location: "Mumbai" },
    ],
    service_history: [
      { date: "2022-09-10", service_type: "Battery Check", cost: 0 },
      { date: "2023-06-05", service_type: "Brake Replacement", cost: 8000 },
    ],
  },
  {
    maker: "Maruti Suzuki",
    model: "WagonR",
    fuel_type: "CNG",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 998, torque: "90 Nm" },
    features: ["Manual AC", "ABS", "Power Windows"],
    sunroof: false,
    airbags: 2,
    price: 600000,
    owners: [{ name: "Rahul", purchase_date: "2019-07-22", location: "Delhi" }],
    service_history: [
      { date: "2020-11-10", service_type: "CNG Kit Checkup", cost: 2000 },
      { date: "2021-08-15", service_type: "Tire Rotation", cost: 1500 },
    ],
  },
  {
    maker: "Honda",
    model: "Amaze",
    fuel_type: "CNG",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 1199, torque: "110 Nm" },
    features: [
      "Keyless Entry",
      "Auto AC",
      "Rear Parking Camera",
      "Cruise Control",
    ],
    sunroof: false,
    airbags: 4,
    price: 800000,
    owners: [{ name: "Sanjay", purchase_date: "2021-03-18", location: "Pune" }],
    service_history: [
      { date: "2021-09-10", service_type: "CNG Kit Checkup", cost: 2500 },
      { date: "2022-05-15", service_type: "Oil Change", cost: 3500 },
    ],
  },
]);
```

**Group**

Find the no. of cars of each brand && Find no. of cars of diffrent fuel_type

```js
db.Cars.aggregate([
  {
    $group: {
      _id: "$maker", // "_id" Kis value k bases pe grouping krni hain.
      TotalCars: { $sum: 1 },
    },
  },
]);

db.Cars.aggregate([{ $group: { _id: "$fuel_type", TotalCars: { $sum: 1 } } }]);
// The $sun:1 operator counts the number of documents in each group.
```

```js
db.Cars.aggregate([
  { $group: { _id: "$maker", AvgPrice: { $avg: "$price" } } },
]);
```

**Match**

Hyundai cars having engine of more than 1200cc

```js
db.Cars.aggregate([
  {
    $match: {
      maker: "Hyundai",
      "engine.cc": { $gt: 1200 },
    },
  },
]);
```

**Count**

Print Total no. of hyundai cars

```js
db.Cars.aggregate([{ $match: { maker: "Hyundai" } }, { $count: "Total_cars" }]);
```

Count no. of diesel and petrol cars of Hyundai brand

```js
db.Cars.aggregate([
  { $match: { maker: "Hyundai" } },
  { $group: { _id: "$fuel_type", TotalCars: { $sum: 1 } } },
]);
```

**Project**

Find all the Hyundai cars and only show Maker, Model and
Fuel_type details

```js
db.Cars.aggregate([
  { $match: { maker: "Hyundai" } },
  {
    $project: {
      maker: 1,
      model: 1,
      fuel_type: 1,
      _id: 0,
    },
  },
]);
// In $project we use "1" to show that value and "0" to hide that value in output.
```

**Sort**

For the previous output, sort the data based on Model

```js
db.Cars.aggregate([
  { $match: { maker: "Hyndai" } },
  { $project: { maker: 1, model: 1, fuel_type: 1, _id: 0 } },
  { $sort: { model: 1 } },
]);
```

**_sortByCount_**

Group the cars by Maker and then sort based on count(no. of cars)

```js
db.Cars.aggregate({ $sortByCount: "$maker" });
// This will do grouping and sort and also provide the count on the bases of maker field.
```

**Unwind**

```js
db.Cars.aggregation([{ $unwind: "$owners" }]);
```

## String Operators

Most commenly used

- $concat
- $toUpper
- $toLower
- $regexMatch
- ltrim
- $split
  Document - https://www.mongodb.com/docs/manual/reference/operator/aggregation/#string-expression-operators

**$concat**

List down all the Hyundai cars and print the name as
Maker + Model i.e. CarName Hyundai Creta

```js
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  { $project: { _id: 0, CarName: { $concat: ["$maker", " ", "$model"] } } },
]);
```

**$toUpper**

```js
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  { $project: { _id: 0, model: { $toUpper: "$model" } } },
]);
```

```js
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  {
    $project: {
      _id: 0,
      CarName: { $toLower: { $concat: ["$maker", " ", "$model"] } },
    },
  },
]);
```

**$regexMatch**

Add a flag is_diesel = true/false for each car

```js
db.cars.aggregate([
  {
    $project: {
      model: 1,
      _id: 0,
      is_diesel: { $regexMatch: { input: "$fuel_type", regex: "Die" } },
    },
  },
]);
```

**Out**

After aggregating, store the result in an another
collection 'hyundai_cars'

```js
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  { $project: { _id: 0, CarName: { $concat: ["$maker", " ", "$model"] } } },
  { $out: "hyundai_cars" },
]);
```

## Arithmetic Operators

- $add
- $subtract
- $divide
- $multiply
- $round
- $abs
- $ceil

Document - https://www.mongodb.com/docs/manual/reference/operator/aggregation/#arithmetic-expression-operators

**$add**

Print all the cars model and price with hike of 55000
(similarly we can use $subtract too)

```js
db.cars.aggregate({
  $project: { model: 1, _id: 0, price: { $add: ["$price", 55000] } },
});
```

We can do this to all, for more detail read Documentation .

### $AddFields / $Set

$addFields and $set are EXACTLY the same.

What is $addFields?

- Adds new fields OR modifies existing fields in documents
- Same as $addFields (just different name)

**$AddFields**

Print details of cars with price in lakhs (15 lakhs)

```js
db.cars.aggregate([
  { $project: { model: 1, _id: 0, price: 1 } },
  { $addFields: { price_in_lakhs: { $divide: ["$price", 100000] } } },
]);
```

**$Set**

Calculate Total service cost of each Hyundai Car.

```js
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  { $set: { total_service_cost: { $sum: "$service_history.cost" } } },
  { $project: { model: 1, maker: 1, _id: 0, total_service_cost: 1 } },
]);
```

## Conditional Operators

- $cond
- $ifNull
- $switch

  | Operator | Purpose                                 |
  | -------- | --------------------------------------- |
  | $cond    | if -> else                              |
  | $ifNull  | handle null / missing                   |
  | $switch  | multiple condition (like switch - case) |

Document - https://www.mongodb.com/docs/manual/reference/operator/aggregation/#conditional-expression-operators

The $cond operator in MongoDB is a ternary
conditional operator
{ $cond: [ <condition>, <true-case>, <false-case> ] }

**$cond**

Suppose we want to check if a car's fuel_type is "Petrol"
and categorize the cars into ‘Petrol Car’ & ‘Non-Petrol’

```js
db.cars.aggregate([
  {
    $project: {
      _id: 0,
      maker: 1,
      model: 1,
      fuelCategory: {
        $cond: {
          if: { $eq: ["$fuel_type", "Petrol"] },
          then: "Petrol Car",
          else: "Non-Petrol Car",
        },
      },
    },
  },
]);
```

**$ifNull**
If value is null → replace it

Syntax:

```js
{
  $ifNull: [ <field>, <defaultValue>]
}
```

```js
db.cars.aggregate([
  {
    $project: {
      _id: 0,
      maker: 1,
      model: 1,
      fuelCategory: {
        $ifNull: ["$fuel_type", "Unknown Fuel"],
      },
    },
  },
]);
```

Means:

- If fuel_type exists → return it
- If fuel_type is null/missing → return "Unknown Fuel"

**$switch**
Syntax:

```
{
  $switch: {
    branches: [
      { case: <condition1>, then: <result1>},
      { case: <condition2>, then: <result2>},
      .....
    ],
    default: <defaultResult>
  }
}
```

Suppose we want to categorize the price of the car into three categories:
"Budget", "Midrange", and "Premium"

```js
db.cars.aggregate([
  {
    $project: {
      _id: 0,
      maker: 1,
      model: 1,
      priceCategory: {
        $switch: {
          branches: [
            { case: { $lt: ["$price", 500000] }, then: "Budget" },
            {
              case: {
                $and: [
                  { $gte: ["$price", 500000] },
                  { $lt: ["$price", 1000000] },
                ],
              },
              then: "Midrange",
            },
            { case: { $gte: ["$price", 1000000] }, then: "Premium" },
          ],
          default: "Unknown",
        },
      },
    },
  },
]);
```

## DATE Operators

- $dateAdd
- $dateDiff
- $month
- $year
- $hour
- $dateOfMonth
- $dayOfYear

Document - https://www.mongodb.com/docs/manual/reference/operator/aggregation/#date-expression-operators

Syntax:

```js
db.collection.aggregate([
  {
    $project: {
      newDate: {
        $dateAdd: {
          startDate: new Date("2024-08-29"), // Starting date
          unit: "day", // Unit to add (e.g., "day", "month", "year")
          amount: 7, // Amount to add
        },
      },
    },
  },
]);
```

Document - https://www.mongodb.com/docs/manual/aggregation/

## Variables in MongoDB

_System Generated Variables :_
Document - https://www.mongodb.com/docs/manual/reference/aggregation-variables/#system-variables

```js
db.cars.aggregate({ $project: { _id: 0, model: 1, date: "$$NOW" } });
```

_User Defined Variables_
These variables allow you to store values and
reuse them within the same pipeline, making the
pipeline more readable and efficient in certain
scenarios.

```js
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  {
    $set: {
      total_service_cost: {
        $sun: "$service_history.cost",
      },
    },
  },
  {
    $project: {
      maker: 1,
      model: 1,
      total_services_cost: 1,
      cost_status: {
        $let: {
          vars: { totalCost: "$total_service_cost" },
          in: {
            $cond: {
              if: { $gte: ["$totalCost", 10000] },
              then: "High",
              else: "Low",
            },
          },
        },
      },
    },
  },
]);
```

## Data Modeling

#### Relations

MongoDB is a NoSQL database, it doesn't enforce strict schema relationship like foreign keys in relational databases.
We can still model relationships between documents in
MongoDB using a few approaches.

The two main types of relationships are:

- Embedded Documents (Denormalization)
- Referenced Documents (Normalization)

Types of Relationship:

- One to One
- One to Many
- Many to Many

We use $lookup to JOIN Refrenced Document
**$lookup\*\*

```js
//users collection
[
  {
    _id: "user1",
    name: "Amit Sharma",
    email: "amit.sharma@example.com",
    phone: "+91-987654210",
    address: "MG Road, Mumbai, Maharashtra",
  },
  {
    _id: "user2",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "+91-987654211",
    address: "Nehru Place, New Delhi, Delhi",
  },
  {
    _id: "user3",
    name: "Rahul Singh",
    email: "rahul.singh@example.com",
    phone: "+91-987654212",
    address: "Sector 18, Noida, Uttar Pradesh",
  },
  {
    _id: "user4",
    name: "Anjali Nair",
    email: "anjali.nair@example.com",
    phone: "+91-987654213",
    address: "Marine Drive, Kochi, Kerala",
  },
  {
    _id: "user5",
    name: "Vikram Desai",
    email: "vikram.desai@example.com",
    phone: "+91-987654214",
    address: "Park Street, Kolkata, West Bengal",
  },
][
  // orders collection

  ({
    _id: "order1",
    user_id: "user1",
    product: "Laptop",
    amount: 50000,
    order_date: "2024-08-01",
  },
  {
    _id: "order2",
    user_id: "user2",
    product: "Mobile Phone",
    amount: 15000,
    order_date: "2024-08-05",
  },
  {
    _id: "order3",
    user_id: "user1",
    product: "Headphones",
    amount: 2000,
    order_date: "2024-08-10",
  },
  {
    _id: "order4",
    user_id: "user3",
    product: "Tablet",
    amount: 25000,
    order_date: "2024-08-12",
  },
  {
    _id: "order5",
    user_id: "user4",
    product: "Smart Watch",
    amount: 8000,
    order_date: "2024-08-15",
  })
];
```

```js
db.users.aggregate([
  {
    $lookup: {
      from: "orders", // The target collection to join with
      localField: "_id", // The field from the 'users' collection
      foreginField: "user_id", // The field from the 'orders' collection
      as: "orders", // The name of the new array field to add to the 'users'
    },
  },
]);
```

## Schema Validation

MongoDB uses a JSON Schema format to define the
validation rules.

Allows you to specify various constraints and rules
for your documents, such as required fields, field
types, and value ranges.

Documentaion- https://www.mongodb.com/docs/v5.2/core/schema-validation/?utm_source=canva&utm_medium=iframely

**_We can add validation while creating collection_**

```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        name: {
          bsonTypes: "string",
          description: "Must be a string and is required",
        },
        age: {
          bsonType: "int",
          minimum: 18,
          description: "Must be a integer and is required",
        },
      },
    },
  },
  validationLevel: "strict",
  validationAction: "error",
});
```

**_Validation Levels:_**

strict: The document must fully comply with the schema validation
rules. If a document does not comply, it will not be inserted or
updated in the collection.

moderate: Only new documents and modified fields in existing
documents are validated against the schema. This allows for partial
validation and can be useful for legacy systems or gradual schema
enforcement.

**_Validation Actions:_**

error: If a document does not meet the schema validation criteria,
MongoDB will throw an error and reject the insert or update
operation.

warn: MongoDB logs a warning message when a document does not
meet the schema validation criteria but still allows the insert or
update operation.

**We can update the existing collection to add validation**

```js
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        name: {
          bsonType: "string",
          description: "Must be a string and is required",
        },
        age: {
          bsonType: "int",
          minimum: 18,
          description: "Must be a integer and is required",
        },
      },
    },
  },
  validationLevel: "moderate", // Change validation level to moderate
  validationAction: "warn", // Change validation action to warn
});
```

## INDEXES
An INDEX is a data structure that improves
the speed of query operations by allowing
the database to quickly locate and access the
required data without scanning every
document in a collection.

Stores the indexed fields in a sorted order,
along with pointers to the actual documents
in the collection.

```js
db.collection.createIndex(
  {
    <field1>:<type1>,
    <field2>: <type2>
  }
)
```
```js
db.collection.dropIndex("fieldName")
```
```js
db.collection.getIndexes()
```

Types of Indexes:

- Single Field Index

- Compound Index: Involves multiple fields.

- Unique Index: Index that ensures no two documents have the
same value for the indexed field.

- TTL Index: TTL (Time to Live) indexes that are used to
automatically remove documents after a certain period.

Performance Considerations:

- Impact on Write Operations: While indexes speed up
reads, they can slow down insertions, updates, and
deletions because the indexes need to be maintained.

- Indexing Large Collections: Learn about the
considerations when indexing large collections, such as
index size and the impact on RAM.
## 🧠 1. What does this mean?

```js
type: mongoose.Schema.Types.ObjectId;
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
ref: "User";
```

👉 Tells Mongoose:

```
"This ObjectId belong to User collection"
```

👉 So populate() knows where to fetch from

## ⚠️ 6. If you don’t use ref

```js
owner: {
  type: mongoose.Schema.Type.ObjectId;
}
```

👉 Then:

```js
.populate("owner") ❌ won’t work
```

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

| Feature     | Embedding         | Referencing         |
| ----------- | ----------------- | ------------------- |
| Data sored  | Inside document   | Separate collection |
| Performance | Fast read ✅      | Extra query ❌      |
| Duplication | Yes               | No                  |
| Updates     | Hard              | Easy                |
| Use case    | small/static data | large/dynamic data  |

## Populate vs $lookup

| Feature     | populate()                       | $lookup                 |
| ----------- | -------------------------------- | ----------------------- |
| Level       | Mongoose (app layer)             | MongoDB (DB layer)      |
| Ease        | Very easy                        | More control            |
| Performance | Can be slower (multiple queries) | Fast (single pipleline) |
| Flexibility | Limited                          | Very poerful            |

_Note_
| Symbol | Meaning |
| ------ | ------- |
| $ | Access a field from document |
| $$ | Access a customer or system variable |
