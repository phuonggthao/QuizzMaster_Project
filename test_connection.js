import pkg from 'mongodb';
const { MongoClient } = pkg;

const uri = "mongodb://admin:123456ABC@ac-1jjcnit-shard-00-00.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-01.rivxhf9.mongodb.net:27017,ac-1jjcnit-shard-00-02.rivxhf9.mongodb.net:27017/?ssl=true&replicaSet=atlas-dz725f-shard-0&authSource=admin&appName=ClusterQuizzMaster";
const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Đang thử kết nối tới Atlas...");
    await client.connect();
    // Gửi lệnh ping để kiểm tra kết nối
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping thành công! Kết nối tới MongoDB hoạt động tốt!");
  } catch (error) {
    console.error("❌ Kết nối thất bại, chi tiết lỗi:", error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);