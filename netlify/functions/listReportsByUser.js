const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const userId = event.queryStringParameters.userId;
    await client.connect();
    const db = client.db("astap_reports");
    const reports = db.collection("reports");

    const data = await reports.find({ userId }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};
