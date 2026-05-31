import express from 'express';
const app = express();

app.get('/test', (req, res) => {
    res.json({ message: "Server chạy cực chuẩn!" });
});

app.listen(5000, () => console.log("🚀 Server test đang chạy tại port 5000"));
