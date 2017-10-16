// This function will return the vendor list
// Create multiple such functions to get the list of required entity
var getVendors = function(data){
  return _.uniq(_.pluck(data,'vendor'));
}

var getModelsPerVendor = function(vendor, data){
  var models = _.where(data,{'vendor':vendor});
  return _.uniq(_.pluck(models,'model'));
}

// This will populate the summary panel with the count of vendors.
// This function can be scaled to be used for other data in the summary;
var populateSummaryPanel = function(data){
  var vendors = getVendors(data);
  $(".panel-body").html(vendors.length+" Vendors");
}



var generateChart = function(el, selectedItem,data){
  var models = getModelsPerVendor(selectedItem,data);
  var addingX = ['x'];
  var modelsWithX = addingX.concat(models);

  var modelsCount = [];

  _.each(models, function(model){
    modelsCount.push((_.where(data,{'model':model})).length);
  });

  var addingY = ['models'];
  var countWithY = addingY.concat(modelsCount);

  var chart = c3.generate({
    bindto: '#deviceChart',
    data: {
      x: 'x',
      columns: [
        modelsWithX,
        countWithY
      ],
      type: 'bar',

    },
    axis: {
        x: {
            type: 'category'
        },
        y: {
            max: 10,
            min: 0,
            padding: { top: 0, bottom: 0 }
        },
        rotated:true
    },
    bar:{
      width:20
    }
  });

}

var populateVendorDropdown = function(vendors, data){
  var $dropdown = $(".vendor-dropdown");
  $dropdown.change(function(e){
    //console.log($dropdown.val());
    selectedItem = $dropdown.val();
    var chartEl = $(".device-chart");
    generateChart(chartEl, selectedItem, data)

  });
  var $html = _.map(vendors,function(vendor){
    return "<option value='"+vendor+"'>"+vendor+"</option>"
  });
  $dropdown.html($html);
}

/* This function will take the html container or element and the data to generate the bar chart */
var createBarChartWidget = function(el, data){
  //the below line will get the unique vendors from from the json
  var vendors = getVendors(data);
  console.log(vendors);

  populateVendorDropdown(vendors,data);

};
/* This will get executed once the data is fetched from the server */
var onFetch = function(data){
  console.log(data.length);
  //Populate the summary panel with the data
  populateSummaryPanel(data);
  //create the bar chart widget
  createBarChartWidget($(".vendor-devices"), data);
};

/* This will get executed if there is an error from the server */
var onError = function(error){
  console.log(error);
};


/* Separated the function to make a ajax call */
var getData = function(url){
  $.ajax({
    url:url,
    success: onFetch,
    error: onError,
    dataType: "json"
  });
};

/* This will run when the document is loaded*/
$(function(){
  var json_url = "data/vendor.json";
  getData(json_url);

});
