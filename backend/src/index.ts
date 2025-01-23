//main router
import express from 'express';
import router from './routes/mainRoute';
const app = express();
app.use(express.json());
app.use('/api/v1', router);

app.listen(3000,()=>{console.log(`app is running on port ${3000}`)});