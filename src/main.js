import http from 'http';
import path from 'path';
import Express from 'express';
import Caller from './caller';

if (process.argv.length < 3) {
  console.error('Provide cipher.');
  process.exit(1);
}

const caller = new Caller(process.argv[2]);
// short-circuit for backend-only execution
if (process.argv.length > 3) {
  caller.doAll(process.argv[3]).then((result) => {
    console.log(`In the city of ${result.city},\nit's ${result.temp}°F,\nthe timezone is ${result.timezone},\nand the general elevation is ${result.elevation} ft.\nHave a nice day!`);
    process.exit(0);
  });
} else {
  const app = new Express();
  app.use(Express.static('./dist/web'))

  app.get('/demo', (req, res) => {
    const zip = req.query.zip;
    if (zip && zip.length === 5) {
      caller.doAll(req.query.zip)
      .then((result) => res.status(200).send(result))
      .catch((error) => res.status(500).send(error));
    } else {
      res.status(400).end();
    }
  });

  app.listen(3000, () => {
    console.log('Server started at localhost on port 3000');
  });
}
