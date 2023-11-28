const { getStockCode, getListStockData } = require("./stock.js");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

const stockTypes = ["HOSE", "HNX", "UPCOM"];

const crawlData = async (stockType) => {
  const currentTime = moment().format("HH:mm");

  if (
    (currentTime >= "09:00" && currentTime <= "11:00") ||
    (currentTime >= "14:00" && currentTime <= "16:30")
  ) {
    console.log("Crawling data at ", currentTime);
    const crawledTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const stockCodes = await getStockCode(stockType);
    const stringStockCodes = stockCodes.join(",");

    const stockDatas = await getListStockData(stringStockCodes);
    const datas = stockDatas.map((data) => {
      return {
        "mã CK": data.sym,
        "giá trần": data.c,
        "giá sàn": data.f,
        "bên mua": {
          "giá 1": data.g1.split("|")[0],
          "kl 1": data.g1.split("|")[1],
          "giá 2": data.g2.split("|")[0],
          "kl 2": data.g2.split("|")[1],
          "giá 3": data.g3.split("|")[0],
          "kl 3": data.g3.split("|")[1],
        },
        "bên mua": {
          "giá 1": data.g4.split("|")[0],
          "kl 1": data.g4.split("|")[1],
          "giá 2": data.g5.split("|")[0],
          "kl 2": data.g5.split("|")[1],
          "giá 3": data.g6.split("|")[0],
          "kl 3": data.g6.split("|")[1],
        },
        "khớp lệnh": {
          giá: data.lastPrice,
          kl: data.lastVolume,
          "tổng kl": data.lot,
          ot: data.ot,
        },
        "trung bình": data.avePrice,
        cao: data.highPrice,
        thấp: data.lowPrice,
        "ĐTNN mua": data.fBVol,
        "ĐTNN bán": data.fSVolume,
        "ĐTNN room": data.fRoom,
        "Dư mua": data.fBValue,
        "Dư bán": data.fSValue,
        crawledTime: crawledTime,
      };
    });
    updateDataInJsonFile(stockType, datas);
  }
};

const updateDataInJsonFile = (stockType, datas) => {
  const filePath = path.join(__dirname, `./data/${stockType}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File không tồn tại, tạo file mới với nội dung là []
        const initialData = [];
        fs.writeFile(filePath, JSON.stringify(initialData), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File created with initial data");
          }
        });
      } else {
        console.log(err);
      }
    } else {
      fileData = JSON.parse(data);
      fileData = [...fileData, ...datas];
      fs.writeFile(filePath, JSON.stringify(fileData), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Data written to file");
        }
      });
    }
  });
};

setInterval(() => {
  stockTypes.forEach((stockType) => crawlData(stockType.toLowerCase()));
}, 30 * 60 * 1000); // 30 phút
