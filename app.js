import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import {DatabaseGateway} from "./src/data/fmlocal.db.gateway.js";
import querys from "./src/constant/constant.query.js"
import {S3Service} from "./src/aws/s3.service.js";
import {ExcelBuilder} from "./src/utils/excel.builder.js";

const app = express();

app.listen('3000', () => {
  console.log("Listening ...");
})

app.get('/', async (req, res) => {
  // mysql database query
  const db = DatabaseGateway.getInstance()
  const conn = db.createConnectionPool();
  const query = querys.SELECT_ALL;
  const response = await db.execute(conn, query)
  console.log(response)
  console.log(typeof response)
  // create Excel file
  let file = ExcelBuilder.jsonToExcelBuffer(response);
  console.log(file)
  console.log(typeof file)
  // upload aws s3 sdk
  const s3 = new S3Service(
    process.env.S3_KEY,
    process.env.S3_SECRET
  );
  const awsResponse = await s3.uploadBigExcelInChunks(file, 'second.xlsx')
  console.log(awsResponse);
  console.log(typeof awsResponse)
  // get url presigned
  const url = await s3.getExcelPreSignedUrl('second.xlsx');
  console.log(url);
  console.log(typeof url);
  // response
  res.send('wuuuu');
})