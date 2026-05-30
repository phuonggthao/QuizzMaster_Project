// Bỏ dấu cách thừa và tách biệt IP với PORT cho rõ ràng
const BACKEND_IP = '10.40.171.133'; 
const BACKEND_PORT = '5000';

// Ghép lại thành URL chuẩn
const BASE_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/api`;

export default BASE_URL;