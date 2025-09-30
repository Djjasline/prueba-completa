const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    await client.connect();
    const db = client.db("astap_reports");
    const reports = db.collection("reports");

    const result = await reports.insertOne({
      ...data,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: result.insertedId }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};
