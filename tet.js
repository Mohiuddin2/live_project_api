const text = 'helloThereMister';
const result = text.replace(/([A-Z])/g, " $1");
const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
console.log(finalResult);