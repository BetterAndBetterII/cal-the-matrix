function ocr(imageFile){
    
    const encrypt = function(e) {
        var t = 0
        , n = {
            "words": [
                2103802918,
                1500803166,
                1061901616,
                1668834165,
                1617197410,
                963793487,
                1345544489,
                742275145
            ],
            "sigBytes": 32
        }
        , r = {
            "words": [
                1163163974,
                1432439637,
                930494283,
                1465405562
            ],
            "sigBytes": 16
        };
        return CryptoJS.AES.encrypt(e, n, {
            iv: r,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
    }

    const decrypt = function(e) {
        var t = 0
        , n = {
            "words": [
                2103802918,
                1500803166,
                1061901616,
                1668834165,
                1617197410,
                963793487,
                1345544489,
                742275145
            ],
            "sigBytes": 32
        }
        , r = {
            "words": [
                1163163974,
                1432439637,
                930494283,
                1465405562
            ],
            "sigBytes": 16
        };
        return CryptoJS.AES.decrypt(e, n, {
            iv: r,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
    }

    function url(){
        function l(e) {
            e = e || 32;
            for (var t = "ABCDEFGHJKMNP9gqQRSToOLVvI1lWXYZabcdefhijkmnprstwxyz2345678", n = t.length, r = "", i = 0; i < e; i++)
                r += t[Math.floor(Math.random() * n)];
            return r
        }

        function p(e, t) {
            return t = 1 < arguments.length && void 0 !== t ? t : 0,
            e[l(Math.floor(3 * Math.random() + 1))] = l(Math.floor(2 * Math.random() + 2)),
            e = encrypt(l(10) + "%%" + JSON.stringify(e), t),
            encodeURIComponent(e)
        }

        function m() {
            var e = "simpletex_ocr_v2_web";
            var t = (Date.parse(new Date) / 1e3).toFixed();
            return "https://server.simpletex.cn/api/gt/" + encodeURI(p({
                time: t,
                url: e
            })) + "/"
        }

        return m()
    }

    function uuid() {
        // 生成随机128位随机字符串
        // 46efb729a1aa4d9992c2101ee9e1ebae
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";
    
        var uuid = s.join("");
        return uuid + uuid + uuid + uuid;
        
    }
    const formData = new FormData();
    formData.append('uuid', uuid());
    formData.append('file', imageFile);
    formData.append('use_v25', 'true');
    formData.append('rec_mode', 'auto');
    return new Promise((resolve, reject) => {
        axios.post(url(), formData)
        .then(response => {
        const res = decrypt(response.data);
        const result = JSON.parse(res.split("%%")[1]);
        resolve(result["res"]["info"]);
        })
        .catch(error => {
        console.error(error);
        reject(error);
        });
    })
    
}

window.ocr = ocr;

// const imagePath = "D:\\Coding\\Python\\scraper\\js\\test.png";

// ocr(imagePath)
// .then(result => {
//     console.log(result);
// })
// .catch(error => {
//     console.error(error);
// });