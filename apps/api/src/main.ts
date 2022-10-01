import * as express from 'express';
import { MongoClient } from 'mongodb';
import * as multer from 'multer';

//Connect to MongoDB using Mongoose
import {
  ApiResponse,
  RawMeasurement,
  RawObjectData,
  SensorType,
} from '@bosch/api-interfaces';
import { readFileSync } from 'fs';

const upload = multer({ dest: 'uploads/' });

async function connectToMongo() {
  console.log(process.env.MONGO_URL);
  const mongo = new MongoClient(process.env.MONGO_URL);
  await mongo.connect();
  return mongo.db('bosch');
}

function denormDistance(v: number) {
  return v / 128;
}

function denormSpeed(v: number) {
  return v / 256;
}

function denormAcceleration(v: number) {
  return v / 2048;
}

function denormProbability(v: number) {
  return v / 128;
}

function parseObjects(rest: string[]) {
  const objects: RawObjectData[] = [];
  for (let i = 0; i < 15; i++) {
    objects.push({
      sensorType: SensorType.CAMERA,
      x: denormDistance(Number(rest[i])),
      y: denormDistance(Number(rest[i + 15])),
      objectType: Number(rest[i + 30]),
      vx: denormSpeed(Number(rest[i + 45])),
      vy: denormSpeed(Number(rest[i + 60])),
    });
  }
  for (let measurementIdx = 0; measurementIdx < 10; measurementIdx++) {
    for (let sensorIdx = 0; sensorIdx < 4; sensorIdx++) {
      objects.push({
        sensorId: sensorIdx,
        sensorType: SensorType.RADAR,
        ax: denormAcceleration(
          Number(rest[79 + measurementIdx * 4 + sensorIdx])
        ),
        ay: denormAcceleration(
          Number(rest[79 + 40 + measurementIdx * 4 + sensorIdx])
        ),
        x: denormDistance(
          Number(rest[79 + 80 + measurementIdx * 4 + sensorIdx])
        ),
        y: denormDistance(
          Number(rest[79 + 120 + measurementIdx * 4 + sensorIdx])
        ),
        z: denormDistance(
          Number(rest[79 + 120 + measurementIdx * 4 + sensorIdx])
        ),
        obstacleProbability: denormDistance(
          Number(rest[79 + 200 + measurementIdx * 4 + sensorIdx])
        ),
        vx: denormSpeed(
          Number(rest[79 + 240 + measurementIdx * 4 + sensorIdx])
        ),
        vy: denormSpeed(
          Number(rest[79 + 280 + measurementIdx * 4 + sensorIdx])
        ),
      });
    }
  }
  return objects;
}

async function main() {
  const app = express();
  const mongo = await connectToMongo();

  app.get('/api/info', async (req, res) => {
    const dataset = req.query.dataset as string;
    if (!dataset) {
      res.status(400).send('Missing dataset parameter');
    }
    const data = await mongo.collection('datasets').findOne({ name: dataset });
    res.send(data);
  });

  app.get('/api/data', async (req, res) => {
    const dataset = req.query.dataset as string;
    const cursor = Number(req.query.cursor as string);

    if (!dataset) {
      res.status(400).send('Missing dataset parameter');
      return;
    }

    if (cursor === undefined || Number.isNaN(cursor)) {
      res.status(400).send('Missing cursor parameter');
      return;
    }

    const data = await mongo
      .collection<RawMeasurement>(dataset)
      .find({
        timestamp: {
          $gt: cursor,
        },
      })
      .limit(500)
      .toArray();
    const response = {
      data: data as unknown as RawMeasurement[],
    } as ApiResponse;
    res.send(response);
  });

  app.post('/api/data', upload.single('file'), async (req, res) => {
    const TIMESTAMP_MULTIPLIER = 100;
    const dataset = req.body.dataset;
    if (!dataset) {
      res.status(400).send('Missing dataset parameter');
      return;
    }
    const path = (req as any).file.path;
    const content = readFileSync(path, 'utf-8');
    const lines = content.split('\n');
    const firstTimestamp = Math.floor(
      Number(lines[1].split(',')[0]) * TIMESTAMP_MULTIPLIER
    );
    const data = lines.slice(1, lines.length - 1).map((line) => {
      const [timestamp, cameraTimestamp, ...rest] = line.split(',');
      // TODO: transform the row into a RawMeasurement
      const measurement: RawMeasurement = {
        consumed: false,
        timestamp:
          Math.floor(Number(timestamp) * TIMESTAMP_MULTIPLIER) - firstTimestamp,
        objects: parseObjects(rest),
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

  app.post('/api/data/velocity', upload.single('file'), async (req, res) => {
    const TIMESTAMP_MULTIPLIER = 100;
    const dataset = req.body.dataset;
    if (!dataset) {
      res.status(400).send('Missing dataset parameter');
      return;
    }
    const path = (req as any).file.path;
    const content = readFileSync(path, 'utf-8');
    const lines = content.split('\n');
    const firstTimestamp = Math.floor(
      Number(lines[1].split(',')[0]) * TIMESTAMP_MULTIPLIER
    );
    const collection = mongo.collection<RawMeasurement>(dataset as string);
    lines.slice(1, lines.length - 1).forEach((line) => {
      const [timestamp, ax, ay, _, __, vx, vy] = line.split(',');
      // TODO: transform the row into a RawMeasurement
      collection.updateOne(
        {
          timestamp: {
            $eq:
              Math.floor(Number(timestamp) * TIMESTAMP_MULTIPLIER) -
              firstTimestamp,
          },
        },
        {
          $set: {
            car: {
              vx: denormSpeed(Number(vx)),
              vy: denormSpeed(Number(vy)),
              ax: denormAcceleration(Number(ax)),
              ay: denormAcceleration(Number(ay)),
            },
          },
        }
      );
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
