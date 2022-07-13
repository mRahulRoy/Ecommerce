//  This is How we can extract all the methods present in an Object.

const obj = {
  name: "RAhul",
  walk: () => {},
  talk: () => {},
  laugh: () => {},
  dance: () => {},
  eat: () => {},
};
const returnMethods = (obj = {}) => {
  const members = Object.getOwnPropertyNames(obj); //this gives all the property

  const methods = members.filter((el) => {
    return typeof obj[el] === "function";
  });
  return methods;
};
//  console.log(returnMethods(Array.prototype));
// //  console.log(returnMethods(Array.prototype).length);

//  This is How we can find length of an Object.

console.log(returnMethods(obj));
