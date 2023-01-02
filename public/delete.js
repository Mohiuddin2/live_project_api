function remove(s){
    var sArr = s.split('').reverse();
    console.log(sArr)
        len = sArr.length;
        num = 0;
        for(i = 0; i < len; i++){
          if (sArr[i] == sArr[i + 1] == '!' || sArr[i] == '!' || sArr[i + 1] == '!') {
            num++;
          }
          else{break}
        }
    if (num === 0) {
      return s;
    }else{return s.slice(0,-num)}
  };

  remove("Hi!", "Hi")
	remove("Hi!!!", "Hi")
	remove("!Hi", "!Hi")
	remove("!Hi!", "!Hi")
	remove("Hi! Hi!", "Hi! Hi")
	remove("Hi", "Hi")