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
          },
        }
      : {};

    console.log("Keyword is ", keyword);
    console.log("queryString is ", this.queryStr.keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }


  filter() {
    const queryCopy = { ...this.queryStr };//using spread operator so that we do not change the original this.queryStr.

    // removing fields for category
    const removeFields = ["keyword", "page", "limit"];//will filter results or records having these values.

    removeFields.forEach((key) => {
      console.log("element to be deleted is : ",key)
      delete queryCopy[key];
    });


    // filter for price and ratings
    let queryStr = JSON.stringify(queryCopy);
    console.log(queryStr);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.find().limit(resultPerPage).skip(skip);
    // this.query = this.query.limit(resultPerPage).skip(skip); //above and this both code are same.
    return this;// returning this complete instance.
  }
}
module.exports = ApiFeatures;
