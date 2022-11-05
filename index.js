const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		const userCollection = client.db("nodeMongoCrud").collection("users");
		app.delete("/users/:id", async (req, res) => {
			const id = req.params.id;
			const query = {
				_id: ObjectId(id),
			};
			const deletedUser = await userCollection.deleteOne(query);
			res.send(deletedUser);
		});
		app.get("/users", async (req, res) => {
			const query = {};
			const cursor = userCollection.find(query);
			const users = await cursor.toArray();
			res.send(users);
		});
		app.get("/users/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const user = await userCollection.findOne(query);
			res.send(user);
		});
		app.put("/users", async (req, res) => {
			const user = req.body;
			const result = await userCollection.insertOne(user);
			res.send(result);
		});
		app.put("/users/:id", async (req, res) => {
			const id = req.params.id;
			const filter = {
				_id: ObjectId(id),
			};
			const option = {
				upsert: true,
			};

			const user = req.body;
			const updatedUser = {
				$set: {
					username: user.username,
					email: user.email,
					password: user.password,
				},
			};

			const result = await userCollection.updateOne(
				filter,
				updatedUser,
				option
			);
			res.send(result);
		});
	} catch (error) {}
}

run().catch((err) => console.log(err));

app.listen(port, () => {
	console.log(`Sever is running on port ${port}`);
});
