

class APIFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    //(search product spesifique par name)
    search(){
        const Keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                $options : 'i'
            }

        } : {}

       console.log(Keyword);
       this.query = this.query.find({ ...Keyword} );
       return this;
    }

    //filleter  functionality 

    filter(){
        const queryCopy = {...this.queryStr};

        //console.log(queryCopy);
        //Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(elm => delete queryCopy[elm]);
        //console.log(queryCopy);

       //Advanced filter for price,ratings etc

       //convert queryCopy to string (queryStr)
       let queryStr =JSON.stringify(queryCopy);
       queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    
       console.log(queryStr);
    
       this.query = this.query.find(JSON.parse(queryStr));
       return this;
    }

    // numeration the page  and Segmentation of products on pages
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1 ;
        
        // Skip the results posted on the previous (précédente) page 
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}  

module.exports = APIFeatures;