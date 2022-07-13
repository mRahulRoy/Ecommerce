class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  /*
  Just getting the documents or records based on the queryStr that can look like this: category = "Laptops". According to this laptop all the documents or records will be saved to this.query.
  */
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          }
        }
      : {};
      /*here we are passing the keyword like this : 
        { name: { '$regex': 'Flute', '$options': 'i' } }
        That will search in all the field "name" in document containing "keyword that we want to search" , and $options means "insensitive". 
      */
    this.query = this.query.find({ ...keyword });
    return this; //returning the reference of this class
  }

  filter() {
    const queryCopy = { ...this.queryStr }; //using spread operator so that we do not change the original this.queryStr just becouse of the reference. Spread operator do not creates a refrence.

    // removing fields to search acording to the category
    const removeFields = ["keyword", "page", "limit"]; //This will filter results or records having these values.

    //deleting the above keys from the removeFields array. 
    removeFields.forEach((key) => {
      delete queryCopy[key];
    });

    // filter for price and ratings, converting the object into string so that we can easily apply regex on it.
    let queryStr = JSON.stringify(queryCopy);


    //as we know to use $regex we need to put dollar symbol to the keys , we are grabbing the key from queryCopy and searching for (lt ,lte, gt, gte) and adding the symbol dollar at first to make that like this: $gt,$gte,$lt,$lte 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    //Now here we are seraching the records according to the 
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * Math.abs(currentPage - 1);
    this.query = this.query.find().limit(resultPerPage).skip(skip);
    // this.query = this.query.limit(resultPerPage).skip(skip); //above and this both code are same.
    return this; // returning this complete instance.
  }
}
module.exports = ApiFeatures;
