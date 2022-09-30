import * as express from 'express';
import { MongoClient } from 'mongodb';
import * as multer from 'multer';

//Connect to MongoDB using Mongoose
import { getDatasetInfo } from './dataset';
import { ApiResponse, RawMeasurement } from '@bosch/api-interfaces';
import { readFileSync } from 'fs';

const upload = multer({ dest: 'uploads/' });

async function connectToMongo() {
  console.log(process.env.MONGO_URL);
  const mongo = new MongoClient(process.env.MONGO_URL);
  await mongo.connect();
  return mongo.db('bosch');
}

async function main() {
  const app = express();
  const mongo = await connectToMongo();

  app.get('/api/info', async (req, res) => {
    const dataset = req.query.dataset as string;
    if (!dataset) {
      res.status(400).send('Missing dataset parameter');
    }
    const data = await mongo
      .collection('datasets')
      .findOne({ name: dataset + '-dataset' });
    res.send(data);
  });

  app.get('/api/data', async (req, res) => {
    const dataset = req.query.dataset as string;
    const chunk = Number(req.query.chunk as string);

    if (!dataset) {
      res.status(400).send('Missing dataset parameter');
      return;
    }

    if (chunk === undefined || Number.isNaN(chunk)) {
      res.status(400).send('Missing chunk parameter');
      return;
    }

    const data = await mongo
      .collection(dataset + '-dataset')
      .find()
      .toArray();
    const response = {
      data: data.slice(chunk * 1000, 1000) as unknown as RawMeasurement[],
    } as ApiResponse;
    res.send(response);
  });

  app.post('/api/data', upload.single('file'), async (req, res) => {
    const dataset = req.body.dataset;
    if (!dataset) {
      res.status(400).send('Missing dataset parameter');
      return;
    }
    const path = (req as any).file.path;
    const content = readFileSync(path, 'utf-8');
    const lines = content.split('\n');
    const data = lines.map((line) => {
      const [timestamp] = line.split(',');
      // TODO: transform the row into a RawMeasurement
      const measurement: RawMeasurement = {
        a: 0,
        b: 0,
        consumed: false,
        timestamp: 0,
      };
      return measurement;
    });
    const collection = mongo.collection(dataset as string);
    await collection.insertMany(data);
    await mongo.collection('datasets').insertOne({
      name: dataset,
      length: data.length,
      lastTimestamp: data[data.length - 1].timestamp,
    });
    res.send('OK');
  });

  const port = process.env.port || 3333;
  const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/api');
  });
  server.on('error', console.error);
}

main();
